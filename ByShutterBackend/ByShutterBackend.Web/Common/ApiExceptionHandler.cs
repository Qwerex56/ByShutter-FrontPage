using ByShutterBackend.Application.Common.Exceptions;
using ByShutterBackend.Domain.Common.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace ByShutterBackend.Web.Common;

/// <summary>
/// Zamienia wyjatki domenowe na poprawne kody HTTP (400/404/409/413) zamiast 500
/// i nigdy nie zwraca klientowi stack trace ani tresci wyjatkow z bazy.
/// </summary>
public sealed class ApiExceptionHandler : IExceptionHandler
{
    private readonly IProblemDetailsService _problemDetails;
    private readonly ILogger<ApiExceptionHandler> _logger;

    public ApiExceptionHandler(IProblemDetailsService problemDetails, ILogger<ApiExceptionHandler> logger)
    {
        _problemDetails = problemDetails;
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken ct)
    {
        (int Status, string Title, Dictionary<string, string[]>? Errors) mapped = exception switch
        {
            ValidationException validation => (
                StatusCodes.Status400BadRequest,
                "Validation failed",
                validation.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray())),
            NotFoundException => (StatusCodes.Status404NotFound, "Not found", null),
            DuplicationException => (StatusCodes.Status409Conflict, "Already exists", null),
            DbUpdateException { InnerException: PostgresException { SqlState: PostgresErrorCodes.UniqueViolation } } =>
                (StatusCodes.Status409Conflict, "Already exists", null),
            DbUpdateException { InnerException: PostgresException { SqlState: PostgresErrorCodes.StringDataRightTruncation } } =>
                (StatusCodes.Status400BadRequest, "Value too long", null),
            BadHttpRequestException badRequest => (badRequest.StatusCode, "Bad request", null),
            OperationCanceledException when ct.IsCancellationRequested => (499, "Client closed request", null),
            _ => (StatusCodes.Status500InternalServerError, "Internal server error", null)
        };

        var (status, title, errors) = mapped;

        if (status >= 500)
        {
            _logger.LogError(exception, "Unhandled exception for {Method} {Path}", httpContext.Request.Method,
                httpContext.Request.Path);
        }

        httpContext.Response.StatusCode = status;

        var problem = new ProblemDetails { Status = status, Title = title };
        if (errors is not null)
        {
            problem.Extensions["errors"] = errors;
        }

        return await _problemDetails.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            ProblemDetails = problem,
            Exception = exception
        });
    }
}
