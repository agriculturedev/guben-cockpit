using System.Xml.Serialization;

namespace Integrations.GubenEvents;
[XmlRoot(ElementName="IMAGELINK_XL")]
public class IMAGELINKXL {

	[XmlAttribute(AttributeName="width")]
	public int Width { get; set; }

	[XmlAttribute(AttributeName="height")]
	public int Height { get; set; }

	[XmlAttribute(AttributeName="sha1_hash")]
	public string Sha1Hash { get; set; }

	[XmlText]
	public string Text { get; set; }
}

[XmlRoot(ElementName="IMAGELINK_2_XL")]
public class IMAGELINK2XL {

	[XmlAttribute(AttributeName="width")]
	public int Width { get; set; }

	[XmlAttribute(AttributeName="height")]
	public int Height { get; set; }

	[XmlAttribute(AttributeName="sha1_hash")]
	public string Sha1Hash { get; set; }

	[XmlText]
	public string Text { get; set; }
}

[XmlRoot(ElementName="IMAGELINK_3_XL")]
public class IMAGELINK3XL {

	[XmlAttribute(AttributeName="width")]
	public int Width { get; set; }

	[XmlAttribute(AttributeName="height")]
	public int Height { get; set; }

	[XmlAttribute(AttributeName="sha1_hash")]
	public string Sha1Hash { get; set; }

	[XmlText]
	public string Text { get; set; }
}

[XmlRoot(ElementName="EVENT")]
public class XmlEvent {

	[XmlElement(ElementName="E_ID")]
	public int EID { get; set; }

	[XmlElement(ElementName="EVENT_ID")]
	public int EVENTID { get; set; }

	[XmlElement(ElementName="TERMIN_ID")]
	public int TERMINID { get; set; }

	[XmlElement(ElementName="E_TITEL")]
	public string ETITEL { get; set; }

	[XmlElement(ElementName="E_BESCHREIBUNG")]
	public string EBESCHREIBUNG { get; set; }

	[XmlElement(ElementName="E_PREISTEXT")]
	public object EPREISTEXT { get; set; }

	[XmlElement(ElementName="E_DATUM_VON")]
	public DateTime EDATUMVON { get; set; }

	[XmlElement(ElementName="E_ZEIT_VON")]
	public object EZEITVON { get; set; }

	[XmlElement(ElementName="E_DATUM_BIS")]
	public DateTime EDATUMBIS { get; set; }

	[XmlElement(ElementName="E_ZEIT_BIS")]
	public object EZEITBIS { get; set; }

	[XmlElement(ElementName="E_ZEIT_TEXT")]
	public string EZEITTEXT { get; set; }

	[XmlElement(ElementName="E_NODATES")]
	public int ENODATES { get; set; }

	[XmlElement(ElementName="E_NONTOURISTIC")]
	public int ENONTOURISTIC { get; set; }

	[XmlElement(ElementName="E_MOTHER_ID")]
	public object EMOTHERID { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE_ID")]
	public int EUSERKATEGORIEID { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE_ID_NEU")]
	public int EUSERKATEGORIEIDNEU { get; set; }

	[XmlElement(ElementName="KATEGORIE_NAME_D")]
	public string KATEGORIENAMED { get; set; }

	[XmlElement(ElementName="KATEGORIE_NAME_E")]
	public string KATEGORIENAMEE { get; set; }

	[XmlElement(ElementName="KATEGORIE_NAME_PL")]
	public string KATEGORIENAMEPL { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_ID")]
	public object EUSERKATEGORIE2ID { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_ID_NEU")]
	public object EUSERKATEGORIE2IDNEU { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_NAME")]
	public object EUSERKATEGORIE2NAME { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_NAME_E")]
	public object EUSERKATEGORIE2NAMEE { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE2_NAME_PL")]
	public object EUSERKATEGORIE2NAMEPL { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_ID")]
	public object EUSERKATEGORIE3ID { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_ID_NEU")]
	public object EUSERKATEGORIE3IDNEU { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_NAME")]
	public object EUSERKATEGORIE3NAME { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_NAME_E")]
	public object EUSERKATEGORIE3NAMEE { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE3_NAME_PL")]
	public object EUSERKATEGORIE3NAMEPL { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_ID")]
	public object EUSERKATEGORIE4ID { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_ID_NEU")]
	public object EUSERKATEGORIE4IDNEU { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_NAME")]
	public object EUSERKATEGORIE4NAME { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_NAME_E")]
	public object EUSERKATEGORIE4NAMEE { get; set; }

	[XmlElement(ElementName="E_USERKATEGORIE4_NAME_PL")]
	public object EUSERKATEGORIE4NAMEPL { get; set; }

	[XmlElement(ElementName="E_URL1")]
	public string EURL1 { get; set; }

	[XmlElement(ElementName="E_URL1DESC")]
	public string EURL1DESC { get; set; }

	[XmlElement(ElementName="E_URL2")]
	public string EURL2 { get; set; }

	[XmlElement(ElementName="E_URL2DESC")]
	public string EURL2DESC { get; set; }

	[XmlElement(ElementName="E_TICKETURL_D")]
	public object ETICKETURLD { get; set; }

	[XmlElement(ElementName="E_SPENDENURL")]
	public object ESPENDENURL { get; set; }

	[XmlElement(ElementName="REGION_NAME_D")]
	public string REGIONNAMED { get; set; }

	[XmlElement(ElementName="REGION_ID")]
	public int REGIONID { get; set; }

	[XmlElement(ElementName="TMBORTE_NAME")]
	public string TMBORTENAME { get; set; }

	[XmlElement(ElementName="E_TMBORTE_ID")]
	public int ETMBORTEID { get; set; }

	[XmlElement(ElementName="E_TMBORTE_ID_NEU")]
	public int ETMBORTEIDNEU { get; set; }

	[XmlElement(ElementName="E_ISHIGHLIGHT")]
	public int EISHIGHLIGHT { get; set; }

	[XmlElement(ElementName="E_HIGHLIGHTREGION")]
	public int EHIGHLIGHTREGION { get; set; }

	[XmlElement(ElementName="E_FERIEN_HIGHLIGHT")]
	public int EFERIENHIGHLIGHT { get; set; }

	[XmlElement(ElementName="E_MONAT_HIGHLIGHT")]
	public int EMONATHIGHLIGHT { get; set; }

	[XmlElement(ElementName="E_NURREGIONAL")]
	public int ENURREGIONAL { get; set; }

	[XmlElement(ElementName="E_NURSTADTREGIONAL")]
	public int ENURSTADTREGIONAL { get; set; }

	[XmlElement(ElementName="E_TMBUSER_ID")]
	public int ETMBUSERID { get; set; }

	[XmlElement(ElementName="E_ISVIRTUELL")]
	public int EISVIRTUELL { get; set; }

	[XmlElement(ElementName="E_LIVESTREAMURL")]
	public object ELIVESTREAMURL { get; set; }

	[XmlElement(ElementName="E_AUSGEBUCHT")]
	public int EAUSGEBUCHT { get; set; }

	[XmlElement(ElementName="E_LOC_NAME")]
	public string ELOCNAME { get; set; }

	[XmlElement(ElementName="E_LOC_STRASSE")]
	public string ELOCSTRASSE { get; set; }

	[XmlElement(ElementName="E_LOC_PLZ")]
	public int ELOCPLZ { get; set; }

	[XmlElement(ElementName="E_LOC_ORT")]
	public string ELOCORT { get; set; }

	[XmlElement(ElementName="E_LOC_TEL")]
	public string ELOCTEL { get; set; }

	[XmlElement(ElementName="E_LOC_FAX")]
	public string ELOCFAX { get; set; }

	[XmlElement(ElementName="E_LOC_EMAIL")]
	public string ELOCEMAIL { get; set; }

	[XmlElement(ElementName="E_LOC_WEB")]
	public string ELOCWEB { get; set; }

	[XmlElement(ElementName="E_GEOKOORD_LAT")]
	public double EGEOKOORDLAT { get; set; }

	[XmlElement(ElementName="E_GEOKOORD_LNG")]
	public double EGEOKOORDLNG { get; set; }

	[XmlElement(ElementName="E_TMBKOORDS_X")]
	public int ETMBKOORDSX { get; set; }

	[XmlElement(ElementName="E_TMBKOORDS_Y")]
	public int ETMBKOORDSY { get; set; }

	[XmlElement(ElementName="E_KONTAKT_FIRMA")]
	public string EKONTAKTFIRMA { get; set; }

	[XmlElement(ElementName="E_KONTAKT_NAME")]
	public string EKONTAKTNAME { get; set; }

	[XmlElement(ElementName="E_KONTAKT_STRASSE")]
	public string EKONTAKTSTRASSE { get; set; }

	[XmlElement(ElementName="E_KONTAKT_PLZ")]
	public int EKONTAKTPLZ { get; set; }

	[XmlElement(ElementName="E_KONTAKT_ORT")]
	public string EKONTAKTORT { get; set; }

	[XmlElement(ElementName="E_KONTAKT_TEL")]
	public string EKONTAKTTEL { get; set; }

	[XmlElement(ElementName="E_KONTAKT_FAX")]
	public string EKONTAKTFAX { get; set; }

	[XmlElement(ElementName="E_KONTAKT_EMAIL")]
	public string EKONTAKTEMAIL { get; set; }

	[XmlElement(ElementName="E_KONTAKT_WEB")]
	public string EKONTAKTWEB { get; set; }

	[XmlElement(ElementName="IMAGELINK")]
	public string IMAGELINK { get; set; }

	[XmlElement(ElementName="IMAGELINK_BIG")]
	public string IMAGELINKBIG { get; set; }

	[XmlElement(ElementName="IMAGELINK_XL")]
	public IMAGELINKXL IMAGELINKXL { get; set; }

	[XmlElement(ElementName="E_PIC1ALT")]
	public string EPIC1ALT { get; set; }

	[XmlElement(ElementName="E_PIC1TITLE")]
	public string EPIC1TITLE { get; set; }

	[XmlElement(ElementName="E_PIC1PHOTOGRAPHER")]
	public string EPIC1PHOTOGRAPHER { get; set; }

	[XmlElement(ElementName="E_PIC1COPYRIGHT")]
	public object EPIC1COPYRIGHT { get; set; }

	[XmlElement(ElementName="E_PIC1LICENSE")]
	public object EPIC1LICENSE { get; set; }

	[XmlElement(ElementName="IMAGELINK_2")]
	public string IMAGELINK2 { get; set; }

	[XmlElement(ElementName="IMAGELINK_2_BIG")]
	public string IMAGELINK2BIG { get; set; }

	[XmlElement(ElementName="IMAGELINK_2_XL")]
	public IMAGELINK2XL IMAGELINK2XL { get; set; }

	[XmlElement(ElementName="E_PIC2ALT")]
	public string EPIC2ALT { get; set; }

	[XmlElement(ElementName="E_PIC2TITLE")]
	public string EPIC2TITLE { get; set; }

	[XmlElement(ElementName="E_PIC2PHOTOGRAPHER")]
	public string EPIC2PHOTOGRAPHER { get; set; }

	[XmlElement(ElementName="E_PIC2COPYRIGHT")]
	public object EPIC2COPYRIGHT { get; set; }

	[XmlElement(ElementName="E_PIC2LICENSE")]
	public object EPIC2LICENSE { get; set; }

	[XmlElement(ElementName="IMAGELINK_3")]
	public string IMAGELINK3 { get; set; }

	[XmlElement(ElementName="IMAGELINK_3_BIG")]
	public string IMAGELINK3BIG { get; set; }

	[XmlElement(ElementName="IMAGELINK_3_XL")]
	public IMAGELINK3XL IMAGELINK3XL { get; set; }

	[XmlElement(ElementName="E_PIC3ALT")]
	public string EPIC3ALT { get; set; }

	[XmlElement(ElementName="E_PIC3TITLE")]
	public string EPIC3TITLE { get; set; }

	[XmlElement(ElementName="E_PIC3PHOTOGRAPHER")]
	public string EPIC3PHOTOGRAPHER { get; set; }

	[XmlElement(ElementName="E_PIC3COPYRIGHT")]
	public object EPIC3COPYRIGHT { get; set; }

	[XmlElement(ElementName="E_PIC3LICENSE")]
	public object EPIC3LICENSE { get; set; }

	[XmlElement(ElementName="E_TITEL_E")]
	public object ETITELE { get; set; }

	[XmlElement(ElementName="E_BESCHREIBUNG_E")]
	public object EBESCHREIBUNGE { get; set; }

	[XmlElement(ElementName="E_PREISTEXT_E")]
	public object EPREISTEXTE { get; set; }

	[XmlElement(ElementName="E_URL1DESC_E")]
	public object EURL1DESCE { get; set; }

	[XmlElement(ElementName="E_URL2DESC_E")]
	public object EURL2DESCE { get; set; }

	[XmlElement(ElementName="E_KONTAKT_FIRMA_E")]
	public object EKONTAKTFIRMAE { get; set; }

	[XmlElement(ElementName="E_LOC_NAME_E")]
	public object ELOCNAMEE { get; set; }

	[XmlElement(ElementName="E_TICKETURL_E")]
	public object ETICKETURLE { get; set; }

	[XmlElement(ElementName="E_ZEIT_TEXT_E")]
	public object EZEITTEXTE { get; set; }

	[XmlElement(ElementName="E_PIC1ALT_E")]
	public object EPIC1ALTE { get; set; }

	[XmlElement(ElementName="E_PIC2ALT_E")]
	public object EPIC2ALTE { get; set; }

	[XmlElement(ElementName="E_PIC3ALT_E")]
	public object EPIC3ALTE { get; set; }

	[XmlElement(ElementName="REGION_NAME_E")]
	public object REGIONNAMEE { get; set; }

	[XmlElement(ElementName="E_TITEL_PL")]
	public object ETITELPL { get; set; }

	[XmlElement(ElementName="E_BESCHREIBUNG_PL")]
	public object EBESCHREIBUNGPL { get; set; }

	[XmlElement(ElementName="E_PREISTEXT_PL")]
	public object EPREISTEXTPL { get; set; }

	[XmlElement(ElementName="E_URL1DESC_PL")]
	public object EURL1DESCPL { get; set; }

	[XmlElement(ElementName="E_URL2DESC_PL")]
	public object EURL2DESCPL { get; set; }

	[XmlElement(ElementName="E_KONTAKT_FIRMA_PL")]
	public object EKONTAKTFIRMAPL { get; set; }

	[XmlElement(ElementName="E_LOC_NAME_PL")]
	public object ELOCNAMEPL { get; set; }

	[XmlElement(ElementName="E_TICKETURL_PL")]
	public object ETICKETURLPL { get; set; }

	[XmlElement(ElementName="E_ZEIT_TEXT_PL")]
	public object EZEITTEXTPL { get; set; }

	[XmlElement(ElementName="E_PIC1ALT_PL")]
	public object EPIC1ALTPL { get; set; }

	[XmlElement(ElementName="E_PIC2ALT_PL")]
	public object EPIC2ALTPL { get; set; }

	[XmlElement(ElementName="E_PIC3ALT_PL")]
	public object EPIC3ALTPL { get; set; }

	[XmlElement(ElementName="REGION_NAME_PL")]
	public object REGIONNAMEPL { get; set; }

	[XmlElement(ElementName="E_BARRIEREFREI_TYPES")]
	public object EBARRIEREFREITYPES { get; set; }

	[XmlElement(ElementName="E_BARRIEREFREI_TEXT")]
	public object EBARRIEREFREITEXT { get; set; }

	[XmlElement(ElementName="E_BARRIEREFREI_URL")]
	public object EBARRIEREFREIURL { get; set; }

	[XmlElement(ElementName="E_BARRIEREFREI_URLDESC")]
	public object EBARRIEREFREIURLDESC { get; set; }

	[XmlElement(ElementName="E_MODIFYDATE")]
	public DateTime EMODIFYDATE { get; set; }
}

[XmlRoot(ElementName="brandenburgevents")]
public class BrandenburgEvents {

	[XmlElement(ElementName="date")]
	public DateTime Date { get; set; }

	[XmlElement(ElementName="count")]
	public int Count { get; set; }

	[XmlElement(ElementName="EVENT")]
	public IEnumerable<XmlEvent> Events { get; set; }
}

