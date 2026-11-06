using ByShutterBackend.Domain.Common.Interfaces;

namespace ByShutterBackend.Infrastructure.Repositories;

public class FileStorage : IFileStorage
{
    public async Task UploadFileAsync(string displayName, string directory, Stream stream)
    {
        var path = ResolveSafePath(directory, displayName);

        // CreateNew: nigdy nie nadpisujemy istniejacego pliku.
        await using var fs = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        await stream.CopyToAsync(fs);
    }

    public Task DeleteFileAsync(string fileName, string path)
    {
        var fullPath = ResolveSafePath(path, fileName);

        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }

        return Task.CompletedTask;
    }

    /// <summary>Gwarantuje, ze wynikowa sciezka lezy wewnatrz katalogu uploadow (brak path traversal).</summary>
    private static string ResolveSafePath(string directory, string fileName)
    {
        var root = Path.GetFullPath(directory);
        var fullPath = Path.GetFullPath(Path.Combine(root, Path.GetFileName(fileName)));

        if (!fullPath.StartsWith(root.TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar,
                StringComparison.Ordinal))
        {
            throw new InvalidOperationException("Invalid file path.");
        }

        return fullPath;
    }
}
