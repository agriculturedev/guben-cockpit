using System.Reflection;
using System.Xml.Linq;
using Domain;

namespace Api.Tests.Translations;

public class ResxTranslationTests
{
  private const string ResxFolderPath = @"../../../../Api/Infrastructure/Translations"; // Change this to your actual folder containing .resx files

  [Fact]
  public void AllResxFilesShouldHaveSameKeys()
  {
    var resxFiles = Directory.GetFiles(ResxFolderPath, "*.resx");
    var resxKeySets = new Dictionary<string, HashSet<string>>();

    // Load all keys from each .resx file
    foreach (var file in resxFiles)
    {
      var keys = GetResourceKeys(file);
      resxKeySets[Path.GetFileName(file)] = keys;
    }

    // Find the full set of keys across all files
    var allKeys = resxKeySets.Values.SelectMany(k => k).ToHashSet();

    // Check for missing keys in any file
    var missingKeysReport = new List<string>();

    foreach (var (fileName, keys) in resxKeySets)
    {
      var missingKeys = allKeys.Except(keys).ToList();
      if (missingKeys.Any())
      {
        missingKeysReport.Add($"Language {fileName.Split('.')[1].ToUpper()} is missing keys: {string.Join(", ", missingKeys)}");
      }
    }

    // Assert that there are no missing keys
    Assert.True(missingKeysReport.Count == 0, string.Join("\n", missingKeysReport));
  }

  [Fact]
  public void AllResxFilesShouldContainAllTranslationKeys()
  {
    var resxFiles = Directory.GetFiles(ResxFolderPath, "*.resx");
    var definedKeys = GetTranslationKeysFromClass();
    var missingKeysReport = new List<string>();

    foreach (var file in resxFiles)
    {
      var keysInFile = GetResourceKeys(file);
      var missingKeys = definedKeys.Except(keysInFile).ToList();

      if (missingKeys.Any())
      {
        missingKeysReport.Add($"Language {Path.GetFileName(file).Split('.')[1].ToUpper()} is missing keys: {string.Join(", ", missingKeys)}");
      }
    }

    Assert.True(missingKeysReport.Count == 0, string.Join("\n", missingKeysReport));
  }

  private HashSet<string> GetTranslationKeysFromClass()
  {
    return typeof(TranslationKeys)
      .GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
      .Where(fi => fi.IsLiteral && !fi.IsInitOnly) // Ensures only constants are retrieved
      .Select(fi => fi.GetValue(null)?.ToString())
      .Where(value => value != null)
      .ToHashSet();
  }

  private HashSet<string> GetResourceKeys(string resxFilePath)
  {
    var keys = new HashSet<string>();
    var xdoc = XDocument.Load(resxFilePath);

    foreach (var dataElement in xdoc.Descendants("data"))
    {
      if (!string.IsNullOrWhiteSpace(dataElement.Value))
      {
        var nameAttribute = dataElement.Attribute("name");
        if (nameAttribute != null)
        {
          keys.Add(nameAttribute.Value);
        }
      }
    }

    return keys;
  }
}
