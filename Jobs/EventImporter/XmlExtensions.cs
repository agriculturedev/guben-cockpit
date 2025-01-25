using System.Xml.Linq;

namespace Jobs.EventImporter;

public static class XmlExtensions
{
  public static int? GetIntAttribute(this XElement element, string attributeName)
  {
    var attribute = (string?)element.Element(attributeName);
    if (string.IsNullOrWhiteSpace(attribute))
      return null;

    var success = int.TryParse(attribute, out var result);
    if (success)
      return result;
    return null;
  }
}
