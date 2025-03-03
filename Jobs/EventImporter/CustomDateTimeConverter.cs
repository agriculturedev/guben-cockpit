using System.Globalization;
using System.Xml;
using System.Xml.Schema;
using System.Xml.Serialization;

namespace Jobs.EventImporter;

public class CustomDateTimeConverter : IXmlSerializable
{
  public DateTime Emodifydate { get; set; }

  public XmlSchema GetSchema() => null;

  public void ReadXml(XmlReader reader)
  {
    string dateString = reader.ReadElementContentAsString();
    Emodifydate = DateTime.ParseExact(dateString, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
  }

  public void WriteXml(XmlWriter writer)
  {
    writer.WriteString(Emodifydate.ToString("yyyy-MM-dd HH:mm:ss"));
  }
}
