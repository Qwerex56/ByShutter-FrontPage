namespace ByShutterBackend.Web.Common;

public static class RateLimitPolicies
{
    public const string Login = "login";
}

public static class ClientIp
{
    /// <summary>
    /// Prawdziwe IP klienta. Cloudflare ustawia CF-Connecting-IP, a backend jest osiagalny
    /// tylko z sieci dockera (przez Caddy), wiec naglowek nie moze byc podrobiony z zewnatrz.
    /// </summary>
    public static string Get(HttpContext context)
    {
        var cfIp = context.Request.Headers["CF-Connecting-IP"].ToString();
        if (!string.IsNullOrWhiteSpace(cfIp))
        {
            return cfIp;
        }

        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}
