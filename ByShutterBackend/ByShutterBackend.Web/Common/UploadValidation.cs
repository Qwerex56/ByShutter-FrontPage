using System.Text.RegularExpressions;

namespace ByShutterBackend.Web.Common;

/// <summary>
/// Walidacja uploadu: nazwa pliku idzie prosto do Path.Combine i jest serwowana przez Caddy
/// pod ta sama domena, wiec musi byc bezpieczna (brak "../", brak .html/.svg itp.).
/// </summary>
public static partial class UploadValidation
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".heic"
    };

    // Litery (takze polskie), cyfry, spacja, - _ ( ) i kropka. Bez ukosnikow i znakow sterujacych.
    [GeneratedRegex(@"^[\p{L}\p{N} _\-().]+$")]
    private static partial Regex SafeFileName();

    public static string? ValidateFileName(string? fileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            return "FileName is required.";

        if (fileName.Length > 32)
            return "FileName must be at most 32 characters.";

        if (Path.GetFileName(fileName) != fileName || fileName.Contains("..") || fileName.StartsWith('.'))
            return "FileName must not contain a path.";

        if (!SafeFileName().IsMatch(fileName))
            return "FileName contains unsupported characters.";

        if (!AllowedExtensions.Contains(Path.GetExtension(fileName)))
            return "Unsupported file extension.";

        return null;
    }

    /// <summary>Sprawdza "magic bytes", zeby rozszerzenie .jpg nie ukrywalo np. HTML-a.</summary>
    public static async Task<bool> LooksLikeImageAsync(IFormFile file, CancellationToken ct)
    {
        var header = new byte[16];
        await using var stream = file.OpenReadStream();
        var read = await stream.ReadAtLeastAsync(header, header.Length, throwOnEndOfStream: false, ct);
        if (read < 12) return false;

        ReadOnlySpan<byte> h = header;
        ReadOnlySpan<byte> jpeg = [0xFF, 0xD8, 0xFF];
        ReadOnlySpan<byte> png = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

        return h.StartsWith(jpeg)                                                  // JPEG
            || h.StartsWith(png)                                                   // PNG
            || h.StartsWith("GIF8"u8)                                              // GIF
            || (h.StartsWith("RIFF"u8) && h.Slice(8, 4).SequenceEqual("WEBP"u8))   // WEBP
            || h.Slice(4, 4).SequenceEqual("ftyp"u8);                              // AVIF / HEIC
    }
}
