using System.Reflection;
using System.Xml.Linq;
using Domain;
using Shouldly;

namespace Api.Tests.Translations;

public class ResxTranslationTests
{
  private const string
    ResxFolderPath =
      @"../../../../Api/Infrastructure/Translations"; // Change this to your actual folder containing .resx files

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
        missingKeysReport.Add(
          $"Language {fileName.Split('.')[1].ToUpper()} is missing keys: {string.Join(", ", missingKeys)}");
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
        missingKeysReport.Add(
          $"Language {Path.GetFileName(file).Split('.')[1].ToUpper()} is missing keys: {string.Join(", ", missingKeys)}");
      }
    }

    Assert.True(missingKeysReport.Count == 0, string.Join("\n", missingKeysReport));
  }

  [Fact]
  public void ShouldNotHaveExtraKeysInTranslationFiles2()
  {
    // Get all translation keys from the TranslationKeys class
    var allTranslationKeys = typeof(TranslationKeys)
      .GetFields(BindingFlags.Public | BindingFlags.Static)
      .Select(field => field.GetValue(null).ToString())
      .ToHashSet();

    // Get all keys from .resx files
    var resxFiles = Directory.GetFiles(ResxFolderPath, "*.resx");

    var resxKeys = new Dictionary<string, HashSet<string>>();

    foreach (var file in resxFiles)
    {
      // Extract language code from the file name (assumes file name includes language code like en.resx, de.resx)
      var languageCode = Path.GetFileNameWithoutExtension(file).Split('.').Last();

      var doc = XDocument.Load(file);
      var keys = doc.Descendants("data")
        .Select(data => data.Attribute("name")?.Value)
        .Where(name => !string.IsNullOrEmpty(name))
        .ToHashSet();

      // Add keys to the dictionary grouped by language code
      resxKeys[languageCode] = keys;
    }

    // Find extra keys that are in the .resx files but not in the TranslationKeys class
    var extraKeysByLanguage = resxKeys
      .Where(kvp => kvp.Value.Any(key => !allTranslationKeys.Contains(key)))
      .ToDictionary(
        kvp => kvp.Key,
        kvp => kvp.Value.Where(key => !allTranslationKeys.Contains(key)).ToList()
      );

    // Assert that there are no extra keys in any language's .resx files
    foreach (var language in extraKeysByLanguage)
    {
      var languageCode = language.Key;
      var extraKeys = language.Value;
      extraKeys.ShouldBeEmpty(
        $"The following keys are present in the {languageCode}.resx file but not in the TranslationKeys class: {string.Join(", ", extraKeys)}");
    }
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
