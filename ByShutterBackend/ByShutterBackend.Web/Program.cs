using System.Security.Cryptography;
using System.Threading.RateLimiting;
using ByShutterBackend.Application;
using ByShutterBackend.Application.Common.Behaviour;
using ByShutterBackend.Domain.ClientAccess;
using ByShutterBackend.Domain.Common.Interfaces;
using ByShutterBackend.Infrastructure.Persistance;
using ByShutterBackend.Infrastructure.Repositories;
using ByShutterBackend.Web.Common;
using ByShutterBackend.Web.Endpoints.ClientAccess;
using ByShutterBackend.Web.Endpoints.HomeConfig;
using ByShutterBackend.Web.Endpoints.Portfolio;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<ImageStoragePathOptions>(
    builder.Configuration.GetSection(nameof(ImageStoragePathOptions))
);

var maxUploadBytes = builder.Configuration.GetValue<long?>("Upload:MaxBytes") ?? 50L * 1024 * 1024;
builder.Services.Configure<FormOptions>(options => options.MultipartBodyLengthLimit = maxUploadBytes);
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = maxUploadBytes + 1024 * 1024);

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddOpenApi();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

// Klucze Data Protection szyfruja cookie sesji. Bez trwalego katalogu kazdy restart kontenera wylogowuje.
var keysDirectory = builder.Configuration["DataProtection:KeysDirectory"];
var dataProtection = builder.Services.AddDataProtection().SetApplicationName("ByShutter");
if (!string.IsNullOrWhiteSpace(keysDirectory))
{
    dataProtection.PersistKeysToFileSystem(new DirectoryInfo(keysDirectory));
}

// Za Caddy + cloudflared aplikacja dostaje HTTP; prawdziwy schemat/IP przychodza w naglowkach X-Forwarded-*.
// Backend nie publikuje portow poza siecia dockera, wiec ufamy proxy z tej sieci.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownIPNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "byshutter-session";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = builder.Environment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.Strict;
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();

// Ochrona przed brute-force hasla: 5 prob logowania na minute z jednego IP.
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy(RateLimitPolicies.Login, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            ClientIp.Get(context),
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

builder.Services.AddScoped<IHomeProfileRepository, HomeProfileRepository>();
builder.Services.AddScoped<IPortfolioTileRepository, PortfolioTileRepository>();

builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<IPhotoRepository, PhotoRepository>();
builder.Services.AddScoped<IFileStorage, FileStorage>();

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? "Host=postgres;Port=5432;Database=byshutter;Username=byshutter;Password=byshutter_password;";

builder.Services.AddDbContext<ByShutterDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});


builder.Services.AddMediatR(options =>
{
    options.LicenseKey = builder.Configuration["MediatR:LicenseKey"] ??
        "eyJhbGciOiJSUzI1NiIsImtpZCI6Ikx1Y2t5UGVubnlTb2Z0d2FyZUxpY2Vuc2VLZXkvYmJiMTNhY2I1OTkwNGQ4OWI0Y2IxYzg1ZjA4OGNjZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x1Y2t5cGVubnlzb2Z0d2FyZS5jb20iLCJhdWQiOiJMdWNreVBlbm55U29mdHdhcmUiLCJleHAiOiIxODE1NjA5NjAwIiwiaWF0IjoiMTc4NDEzNTI0MyIsImFjY291bnRfaWQiOiIwMTlmNjZiZWFlYjk3NmIwYjdhNTZmMjZlNTgzMDk3MSIsImN1c3RvbWVyX2lkIjoiMDE5ZjY2YmVhZWI5NzZiMGI3YTU2ZjI2ZTU4MzA5NzEiLCJzdWJfaWQiOiItIiwiZWRpdGlvbiI6IjAiLCJ0eXBlIjoiMiJ9.1Eu2a9X4v_eueKPHpH0CMM5CuT1nri69StbH1GmM_F0QFU6xkNH6L3j3kffxDGv6WlUPyLuRz701wMWwLHQ639dota5lOSd1BJJyCiOV-lF6W_v6gS_nBEYkTreYKrODCOV2WZy-i1AoE9DDuJp_W7YrGRRVPmigDoJEJuK5MDHgRJDmD-3rM58Yo1aNukivg7rrvR1Rcb_Sj4K47PXa3-3Kj4WXP1e1pIpmDhcG8BqIishB1iXktOzzrSaoWF8whRScwj_u0u9VhiJauf5nb9Cw-L9KAZdX6WJ_zKQNgwW7H1UcGJbs2tJ-ZVPphbuxcY7BZpcndGkW9C10ClSGhg";
    options.RegisterServicesFromAssembly(typeof(AssemblyReference).Assembly);
});

builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));


builder.Services.AddValidatorsFromAssemblyContaining<AssemblyReference>();

// W produkcji frontend i API sa pod jedna domena (Caddy), wiec CORS jest potrzebny tylko w dev.
var frontendOrigin = builder.Configuration["FrontendOrigin"];
builder.Services.AddCors(option =>
{
    option.AddPolicy("CorsPolicy", policy =>
    {
        if (!string.IsNullOrWhiteSpace(frontendOrigin))
        {
            policy.WithOrigins(frontendOrigin.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
        }
    });
});

var app = builder.Build();

// Migrate database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ByShutterDbContext>();
    dbContext.Database.Migrate();

    if (!dbContext.Users.Any())
    {
        var username = app.Configuration["Authentication:InitialUsername"];
        var password = app.Configuration["Authentication:InitialPassword"];

        if (!app.Environment.IsDevelopment() && (string.IsNullOrWhiteSpace(password) || password.Length < 12 || password == "change-me"))
        {
            throw new InvalidOperationException(
                "Authentication:InitialPassword musi miec co najmniej 12 znakow (ustaw ADMIN_PASSWORD w .env).");
        }

        if (!string.IsNullOrWhiteSpace(username) && !string.IsNullOrWhiteSpace(password))
        {
            var salt = RandomNumberGenerator.GetBytes(32);
            var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, 120_000, HashAlgorithmName.SHA256, 32);
            dbContext.Users.Add(new User(username, Convert.ToBase64String(hash), Convert.ToBase64String(salt)));
            dbContext.SaveChanges();
        }
    }
}

app.UseForwardedHeaders();
app.UseExceptionHandler();

// Antiforgery jest wylaczone, wiec dla zapytan zmieniajacych dane sprawdzamy naglowek Origin.
// Razem z SameSite=Strict zamyka to CSRF takze z subdomen (ktore przegladarka uznaje za "same-site").
var trustedOrigins = (frontendOrigin ?? string.Empty)
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    .ToHashSet(StringComparer.OrdinalIgnoreCase);
app.Use(async (context, next) =>
{
    var method = context.Request.Method;
    if (!HttpMethods.IsGet(method) && !HttpMethods.IsHead(method) && !HttpMethods.IsOptions(method))
    {
        var origin = context.Request.Headers.Origin.ToString();
        var self = $"{context.Request.Scheme}://{context.Request.Host}";
        if (!string.IsNullOrEmpty(origin) &&
            !string.Equals(origin, self, StringComparison.OrdinalIgnoreCase) &&
            !trustedOrigins.Contains(origin))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return;
        }
    }

    await next(context);
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ByShutterBackend v1");
    });
}

if (app.Configuration.GetValue("UseHttpsRedirection", false))
{
    app.UseHttpsRedirection();
}

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.MapAuthEndpoints();
app.MapHomeProfileEndpoints();
app.MapPortfolioTilesEndpoints();

app.MapPhotoEndpoints();
app.MapAlbumEndpoints();

app.Run();
