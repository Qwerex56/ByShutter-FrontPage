namespace ByShutterBackend.Web.Common;

/// <summary>
/// Publiczne endpointy GET przyjmuja pageSize/page z URL. Bez limitu ktos moze poprosic
/// o pageSize=10000000 i zajac baze/pamiec (tani DoS), a ujemne wartosci koncza sie 500.
/// </summary>
public static class Paging
{
    public const int MaxPageSize = 100;

    public static bool IsValid(int pageSize, int page) =>
        pageSize is > 0 and <= MaxPageSize && page is >= 0 and <= 100_000;

    public static IResult Invalid() => Results.Problem(
        statusCode: StatusCodes.Status400BadRequest,
        title: $"pageSize must be 1..{MaxPageSize} and page must be >= 0");
}
