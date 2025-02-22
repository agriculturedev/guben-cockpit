using System.Globalization;
using System.Xml.Serialization;

namespace Jobs.EventImporter;
// using System.Xml.Serialization;
// XmlSerializer serializer = new XmlSerializer(typeof(EVENT));
// using (StringReader reader = new StringReader(xml))
// {
//    var test = (EVENT)serializer.Deserialize(reader);
// }

[XmlRoot(ElementName="IMAGELINK_XL")]
public class ImageLinkXl {

	[XmlAttribute(AttributeName="width")]
	public string? Width { get; set; }

	[XmlAttribute(AttributeName="height")]
	public string? Height { get; set; }

	[XmlAttribute(AttributeName="sha1_hash")]
	public string? Sha1Hash { get; set; }

	[XmlText]
	public string? Text { get; set; }
}

[XmlRoot(ElementName="IMAGELINK_2_XL")]
public class ImageLink2Xl {

	[XmlAttribute(AttributeName="width")]
	public string? Width { get; set; }

	[XmlAttribute(AttributeName="height")]
	public string? Height { get; set; }

	[XmlAttribute(AttributeName="sha1_hash")]
	public string? Sha1Hash { get; set; }

	[XmlText]
	public string? Text { get; set; }
}

[XmlRoot(ElementName="IMAGELINK_3_XL")]
public class ImageLink3Xl {

	[XmlAttribute(AttributeName="width")]
	public string? Width { get; set; }

	[XmlAttribute(AttributeName="height")]
	public string? Height { get; set; }

	[XmlAttribute(AttributeName="sha1_hash")]
	public string? Sha1Hash { get; set; }

	[XmlText]
	public string? Text { get; set; }
}


[XmlRoot(ElementName="EVENT", Namespace="")]
public class XmlEvent {

  public string? GetTitle(CultureInfo culture)
  => culture.TwoLetterISOLanguageName switch
    {
      "en" => Etitele,
      "pl" => Etitelpl,
      _ => Etitel,
    };

  public string? GetDescription(CultureInfo culture)
    => culture.TwoLetterISOLanguageName switch
    {
      "en" => Ebeschreibunge,
      "pl" => Ebeschreibungpl,
      _ => Ebeschreibung,
    };

  public string? GetLocationName(CultureInfo culture)
    => culture.TwoLetterISOLanguageName switch
    {
      "en" => Elocnamee,
      "pl" => Elocnamepl,
      _ => Elocname,
    };

  public string? GetLocationCity() => Elocort;

  public string? GetLocationStreet() => Elocstrasse;

  public string? GetLocationTel() => Eloctel;

  public string? GetLocationFax() => Elocfax;

  public string? GetLocationEmail() => Elocemail;

  public string? GetLocationWeb() => Elocweb;

  public string? GetLocationZip() => Elocplz;

  public DateTime GetStartDate()
  {
    var datumVon = DateOnly.FromDateTime(Edatumvon);
    var zeitVon = Ezeitvon;

    var parsedZeitVon = !string.IsNullOrWhiteSpace(zeitVon) ? $"{zeitVon}" : string.Empty;

    return DateTime.Parse($"{datumVon} {parsedZeitVon}");
  }

  public DateTime GetEndDate()
  {
    var datumBis = DateOnly.FromDateTime(Edatumbis);
    var zeitBis = Ezeitbis;

    var parsedZeitBis = !string.IsNullOrWhiteSpace(zeitBis) ? $"{zeitBis}" : string.Empty;

    return DateTime.Parse($"{datumBis} {parsedZeitBis}");
  }

  public string GetEventId() => Eventid;
  public string GetTerminId() => Terminid;

  public double? GetLatitude()
  {
    if (double.TryParse(Egeokoordlat, out var latitude))
      return latitude;

    return null;
  }

  public double? GetLongitude()
  {
    if (double.TryParse(Egeokoordlng, out var longitude))
      return longitude;

    return null;
  }

  public List<(int, string)> GetUserCategories(CultureInfo cultureInfo)
  {
    var categories = new List<(int, string)>();

    var ids = new List<string?>()
    {
      Euserkategorieid, Euserkategorie2Id, Euserkategorie3Id, Euserkategorie4Id
    };

    var germanItems = new List<string?>()
    {
      Kategorienamed,
      Euserkategorie2Name,
      Euserkategorie3Name,
      Euserkategorie4Name
    };

    var englishItems = new List<string?>()
    {
      Kategorienamee,
      Euserkategorie2Namee,
      Euserkategorie3Namee,
      Euserkategorie4Namee
    };

    var polishItems = new List<string?>()
    {
      Kategorienamepl,
      Euserkategorie2Namepl,
      Euserkategorie3Namepl,
      Euserkategorie4Namepl
    };

    switch (cultureInfo.TwoLetterISOLanguageName)
    {
      case "en":
        AddParsedCategories(categories, ids, englishItems);
        break;
      case "pl":
        AddParsedCategories(categories, ids, polishItems);
        break;
      default:
        AddParsedCategories(categories, ids, germanItems);
        break;
    }

    return categories;
  }

  private void AddParsedCategories(List<(int, string)> categories, List<string?> ids, List<string?> names)
  {
    for (var i = 0; i < ids.Count; i++)
    {
      if (int.TryParse(ids[i], out var parsedId) && !string.IsNullOrWhiteSpace(names[i]))
        categories.Add((parsedId, names[i]!));
    }
  }

	[XmlElement(ElementName="E_ID")]
	public string? Eid { get; set; }

	[XmlElement(ElementName="EVENT_ID")]
	public string? Eventid { get; set; }

	[XmlElement(ElementName="TERMIN_ID")]
	public string? Terminid { get; set; }

	[XmlElement(ElementName="E_TITEL")]
	public string? Etitel { get; set; }

	[XmlElement(ElementName="E_BESCHREIBUNG")]
	public string? Ebeschreibung { get; set; }

	[XmlElement(ElementName="E_PREISTEXT")]
	public string?Epreistext { get; set; }

	[XmlElement(ElementName="E_DATUM_VON")]
	public DateTime Edatumvon { get; set; }

	[XmlElement(ElementName="E_ZEIT_VON")]
	public string? Ezeitvon { get; set; }

	[XmlElement(ElementName="E_DATUM_BIS")]
	public DateTime Edatumbis { get; set; }

	[XmlElement(ElementName="E_ZEIT_BIS")]
	public string? Ezeitbis { get; set; }

	[XmlElement(ElementName="E_ZEIT_TEXT")]
	public string?Ezeittext { get; set; }

	[XmlElement(ElementName="E_NODATES")]
	public string? Enodates { get; set; }

	[XmlElement(ElementName="E_NONTOURISTIC")]
	public string? Enontouristic { get; set; }

	[XmlElement(ElementName="E_MOTHER_ID")]
	public string? Emotherid { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE_ID")]
	public string? Euserkategorieid { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE_ID_NEU")]
	public string? Euserkategorieidneu { get; set; }

	[XmlElement(ElementName="KATEGORIE_NAME_D")]
	public string? Kategorienamed { get; set; }

	[XmlElement(ElementName="KATEGORIE_NAME_E")]
	public string? Kategorienamee { get; set; }

	[XmlElement(ElementName="KATEGORIE_NAME_PL")]
	public string? Kategorienamepl { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_ID")]
	public string? Euserkategorie2Id { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_ID_NEU")]
	public string? Euserkategorie2Idneu { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_NAME")]
	public string? Euserkategorie2Name { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_NAME_E")]
	public string? Euserkategorie2Namee { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_NAME_PL")]
	public string? Euserkategorie2Namepl { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_ID")]
	public string? Euserkategorie3Id { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_ID_NEU")]
	public string? Euserkategorie3Idneu { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_NAME")]
	public string? Euserkategorie3Name { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_NAME_E")]
	public string? Euserkategorie3Namee { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_NAME_PL")]
	public string? Euserkategorie3Namepl { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_ID")]
	public string? Euserkategorie4Id { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_ID_NEU")]
	public string? Euserkategorie4Idneu { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_NAME")]
	public string? Euserkategorie4Name { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_NAME_E")]
	public string? Euserkategorie4Namee { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_NAME_PL")]
	public string? Euserkategorie4Namepl { get; set; }

	[XmlElement(ElementName="E_URL1")]
	public string? Eurl1 { get; set; }

	[XmlElement(ElementName="E_URL1DESC")]
	public string? Eurl1Desc { get; set; }

	[XmlElement(ElementName="E_URL2")]
	public string? Eurl2 { get; set; }

	[XmlElement(ElementName="E_URL2DESC")]
	public string? Eurl2Desc { get; set; }

	[XmlElement(ElementName="E_TICKETURL_D")]
	public string? Eticketurld { get; set; }

	[XmlElement(ElementName="E_SPENDENURL")]
	public string? Espendenurl { get; set; }

	[XmlElement(ElementName="REGION_NAME_D")]
	public string? Regionnamed { get; set; }

	[XmlElement(ElementName="REGION_ID")]
	public string? Regionid { get; set; }

	[XmlElement(ElementName="TMBORTE_NAME")]
	public string? Tmbortename { get; set; }

	[XmlElement(ElementName="E_TMBORTE_ID")]
	public string? Etmborteid { get; set; }

	[XmlElement(ElementName="E_TMBORTE_ID_NEU")]
	public string? Etmborteidneu { get; set; }

	[XmlElement(ElementName="E_ISHIGHLIGHT")]
	public string? Eishighlight { get; set; }

	[XmlElement(ElementName="E_HIGHLIGHTREGION")]
	public string? Ehighlightregion { get; set; }

	[XmlElement(ElementName="E_FERIEN_HIGHLIGHT")]
	public string? Eferienhighlight { get; set; }

	[XmlElement(ElementName="E_MONAT_HIGHLIGHT")]
	public string? Emonathighlight { get; set; }

	[XmlElement(ElementName="E_NURREGIONAL")]
	public string? Enurregional { get; set; }

	[XmlElement(ElementName="E_NURSTADTREGIONAL")]
	public string? Enurstadtregional { get; set; }

	[XmlElement(ElementName="E_TMBUSER_ID")]
	public string? Etmbuserid { get; set; }

	[XmlElement(ElementName="E_ISVIRTUELL")]
	public string? Eisvirtuell { get; set; }

	[XmlElement(ElementName="E_LIVESTREAMURL")]
	public string? Elivestreamurl { get; set; }

	[XmlElement(ElementName="E_AUSGEBUCHT")]
	public string? Eausgebucht { get; set; }

	[XmlElement(ElementName="E_LOC_NAME")]
	public string? Elocname { get; set; }

	[XmlElement(ElementName="E_LOC_STRASSE")]
	public string? Elocstrasse { get; set; }

	[XmlElement(ElementName="E_LOC_PLZ")]
	public string? Elocplz { get; set; }

	[XmlElement(ElementName="E_LOC_ORT")]
	public string? Elocort { get; set; }

	[XmlElement(ElementName="E_LOC_TEL")]
	public string? Eloctel { get; set; }

	[XmlElement(ElementName="E_LOC_FAX")]
	public string? Elocfax { get; set; }

	[XmlElement(ElementName="E_LOC_EMAIL")]
	public string? Elocemail { get; set; }

	[XmlElement(ElementName="E_LOC_WEB")]
	public string? Elocweb { get; set; }

	[XmlElement(ElementName="E_GEOKOORD_LAT")]
	public string? Egeokoordlat { get; set; }

	[XmlElement(ElementName="E_GEOKOORD_LNG")]
	public string? Egeokoordlng { get; set; }

	[XmlElement(ElementName="E_TMBKOORDS_X")]
	public string? Etmbkoordsx { get; set; }

	[XmlElement(ElementName="E_TMBKOORDS_Y")]
	public string? Etmbkoordsy { get; set; }

	[XmlElement(ElementName="E_KONTAKT_FIRMA")]
	public string? Ekontaktfirma { get; set; }

	[XmlElement(ElementName="E_KONTAKT_NAME")]
	public string? Ekontaktname { get; set; }

	[XmlElement(ElementName="E_KONTAKT_STRASSE")]
	public string? Ekontaktstrasse { get; set; }

	[XmlElement(ElementName="E_KONTAKT_PLZ")]
	public string? Ekontaktplz { get; set; }

	[XmlElement(ElementName="E_KONTAKT_ORT")]
	public string? Ekontaktort { get; set; }

	[XmlElement(ElementName="E_KONTAKT_TEL")]
	public string? Ekontakttel { get; set; }

	[XmlElement(ElementName="E_KONTAKT_FAX")]
	public string? Ekontaktfax { get; set; }

	[XmlElement(ElementName="E_KONTAKT_EMAIL")]
	public string? Ekontaktemail { get; set; }

	[XmlElement(ElementName="E_KONTAKT_WEB")]
	public string? Ekontaktweb { get; set; }

	[XmlElement(ElementName="IMAGELINK")]
	public string? Imagelink { get; set; }

	[XmlElement(ElementName="IMAGELINK_BIG")]
	public string? Imagelinkbig { get; set; }

	[XmlElement(ElementName="IMAGELINK_XL")]
	public ImageLinkXl ImageLinkXl { get; set; }

	[XmlElement(ElementName="E_PIC1ALT")]
	public string? Epic1Alt { get; set; }

	[XmlElement(ElementName="E_PIC1TITLE")]
	public string? Epic1Title { get; set; }

	[XmlElement(ElementName="E_PIC1PHOTOGRAPHER")]
	public string? Epic1Photographer { get; set; }

	[XmlElement(ElementName="E_PIC1COPYRIGHT")]
	public string? Epic1Copyright { get; set; }

	[XmlElement(ElementName="E_PIC1LICENSE")]
	public string? Epic1License { get; set; }

	[XmlElement(ElementName="IMAGELINK_2")]
	public string? Imagelink2 { get; set; }

	[XmlElement(ElementName="IMAGELINK_2_BIG")]
	public string? Imagelink2Big { get; set; }

	[XmlElement(ElementName="IMAGELINK_2_XL")]
	public ImageLink2Xl ImageLink2Xl { get; set; }

	[XmlElement(ElementName="E_PIC2ALT")]
	public string? Epic2Alt { get; set; }

	[XmlElement(ElementName="E_PIC2TITLE")]
	public string? Epic2Title { get; set; }

	[XmlElement(ElementName="E_PIC2PHOTOGRAPHER")]
	public string? Epic2Photographer { get; set; }

	[XmlElement(ElementName="E_PIC2COPYRIGHT")]
	public string? Epic2Copyright { get; set; }

	[XmlElement(ElementName="E_PIC2LICENSE")]
	public string? Epic2License { get; set; }

	[XmlElement(ElementName="IMAGELINK_3")]
	public string? Imagelink3 { get; set; }

	[XmlElement(ElementName="IMAGELINK_3_BIG")]
	public string? Imagelink3Big { get; set; }

	[XmlElement(ElementName="IMAGELINK_3_XL")]
	public ImageLink3Xl ImageLink3Xl { get; set; }

	[XmlElement(ElementName="E_PIC3ALT")]
	public string? Epic3Alt { get; set; }

	[XmlElement(ElementName="E_PIC3TITLE")]
	public string? Epic3Title { get; set; }

	[XmlElement(ElementName="E_PIC3PHOTOGRAPHER")]
	public string? Epic3Photographer { get; set; }

	[XmlElement(ElementName="E_PIC3COPYRIGHT")]
	public string? Epic3Copyright { get; set; }

	[XmlElement(ElementName="E_PIC3LICENSE")]
	public string? Epic3License { get; set; }

	[XmlElement(ElementName="E_TITEL_E")]
	public string? Etitele { get; set; }

	[XmlElement(ElementName="E_BESCHREIBUNG_E")]
	public string? Ebeschreibunge { get; set; }

	[XmlElement(ElementName="E_PREISTEXT_E")]
	public string? Epreistexte { get; set; }

	[XmlElement(ElementName="E_URL1DESC_E")]
	public string? Eurl1Desce { get; set; }

	[XmlElement(ElementName="E_URL2DESC_E")]
	public string? Eurl2Desce { get; set; }

	[XmlElement(ElementName="E_KONTAKT_FIRMA_E")]
	public string? Ekontaktfirmae { get; set; }

	[XmlElement(ElementName="E_LOC_NAME_E")]
	public string? Elocnamee { get; set; }

	[XmlElement(ElementName="E_TICKETURL_E")]
	public string? Eticketurle { get; set; }

	[XmlElement(ElementName="E_ZEIT_TEXT_E")]
	public string? Ezeittexte { get; set; }

	[XmlElement(ElementName="E_PIC1ALT_E")]
	public string? Epic1Alte { get; set; }

	[XmlElement(ElementName="E_PIC2ALT_E")]
	public string? Epic2Alte { get; set; }

	[XmlElement(ElementName="E_PIC3ALT_E")]
	public string? Epic3Alte { get; set; }

	[XmlElement(ElementName="REGION_NAME_E")]
	public string? Regionnamee { get; set; }

	[XmlElement(ElementName="E_TITEL_PL")]
	public string? Etitelpl { get; set; }

	[XmlElement(ElementName="E_BESCHREIBUNG_PL")]
	public string? Ebeschreibungpl { get; set; }

	[XmlElement(ElementName="E_PREISTEXT_PL")]
	public string? Epreistextpl { get; set; }

	[XmlElement(ElementName="E_URL1DESC_PL")]
	public string? Eurl1Descpl { get; set; }

	[XmlElement(ElementName="E_URL2DESC_PL")]
	public string? Eurl2Descpl { get; set; }

	[XmlElement(ElementName="E_KONTAKT_FIRMA_PL")]
	public string? Ekontaktfirmapl { get; set; }

	[XmlElement(ElementName="E_LOC_NAME_PL")]
	public string? Elocnamepl { get; set; }

	[XmlElement(ElementName="E_TICKETURL_PL")]
	public string? Eticketurlpl { get; set; }

	[XmlElement(ElementName="E_ZEIT_TEXT_PL")]
	public string? Ezeittextpl { get; set; }

	[XmlElement(ElementName="E_PIC1ALT_PL")]
	public string? Epic1Altpl { get; set; }

	[XmlElement(ElementName="E_PIC2ALT_PL")]
	public string? Epic2Altpl { get; set; }

	[XmlElement(ElementName="E_PIC3ALT_PL")]
	public string? Epic3Altpl { get; set; }

	[XmlElement(ElementName="REGION_NAME_PL")]
	public string? Regionnamepl { get; set; }

	[XmlElement(ElementName="E_BARRIEREFREI_TYPES")]
	public string? Ebarrierefreitypes { get; set; }

	[XmlElement(ElementName="E_BARRIEREFREI_TEXT")]
	public string? Ebarrierefreitext { get; set; }

	[XmlElement(ElementName="E_BARRIEREFREI_URL")]
	public string? Ebarrierefreiurl { get; set; }

	[XmlElement(ElementName="E_BARRIEREFREI_URLDESC")]
	public string? Ebarrierefreiurldesc { get; set; }

	[XmlElement(ElementName="E_MODIFYDATE")]
	public CustomDateTimeConverter Emodifydate { get; set; }
}


