export interface RawEvent {
  E_ID: number,
  EVENT_ID: number,
  TERMIN_ID: number,
  E_TITEL: string;
  E_BESCHREIBUNG: string,
  E_PREISTEXT: string;
  E_DATUM_VON: string,
  E_ZEIT_VON: string,
  E_DATUM_BIS: string,
  E_ZEIT_BIS: string,
  E_ZEIT_TEXT: string,
  E_NODATES: boolean,
  E_NONTOURISTIC: boolean,
  E_MOTHER_ID: string,
  E_USERKATEGORIE_ID: number,
  E_USERKATEGORIE_ID_NEU: number,
  KATEGORIE_NAME_D: string,
  KATEGORIE_NAME_E: string,
  KATEGORIE_NAME_PL: string,
  E_USERKATEGORIE2_ID: string,
  E_USERKATEGORIE2_ID_NEU: string,
  E_USERKATEGORIE2_NAME: string,
  E_USERKATEGORIE2_NAME_E: string,
  E_USERKATEGORIE2_NAME_PL: string,
  E_USERKATEGORIE3_ID: string,
  E_USERKATEGORIE3_ID_NEU: string,
  E_USERKATEGORIE3_NAME: string,
  E_USERKATEGORIE3_NAME_E: string,
  E_USERKATEGORIE3_NAME_PL: string,
  E_USERKATEGORIE4_ID: string,
  E_USERKATEGORIE4_ID_NEU: string,
  E_USERKATEGORIE4_NAME: string,
  E_USERKATEGORIE4_NAME_E: string,
  E_USERKATEGORIE4_NAME_PL: string,
  E_URL1: string,
  E_URL1DESC: string,
  E_URL2: string,
  E_URL2DESC: string,
  E_TICKETURL_D: string,
  E_SPENDENURL: string,
  REGION_NAME_D: string,
  REGION_ID: number,
  TMBORTE_NAME: string,
  E_TMBORTE_ID: number,
  E_TMBORTE_ID_NEU: number,
  E_ISHIGHLIGHT: number,
  E_HIGHLIGHTREGION: number,
  E_FERIEN_HIGHLIGHT: number,
  E_MONAT_HIGHLIGHT: number,
  E_NURREGIONAL: number,
  E_NURSTADTREGIONAL: number,
  E_TMBUSER_ID: number,
  E_ISVIRTUELL: number,
  E_LIVESTREAMURL: string,
  E_AUSGEBUCHT: number,
  E_LOC_NAME: string,
  E_LOC_STRASSE: string,
  E_LOC_PLZ: number,
  E_LOC_ORT: string,
  E_LOC_TEL: string,
  E_LOC_FAX: string,
  E_LOC_EMAIL: string,
  E_LOC_WEB: string,
  E_GEOKOORD_LAT: number,
  E_GEOKOORD_LNG: number,
  E_TMBKOORDS_X: number,
  E_TMBKOORDS_Y: number,
  E_KONTAKT_FIRMA: string,
  E_KONTAKT_NAME: string,
  E_KONTAKT_STRASSE: string,
  E_KONTAKT_PLZ: number,
  E_KONTAKT_ORT: string,
  E_KONTAKT_TEL: string,
  E_KONTAKT_FAX: string,
  E_KONTAKT_EMAIL: string,
  E_KONTAKT_WEB: string,
  IMAGELINK: string,
  IMAGELINK_BIG: string,
  IMAGELINK_XL: string,
  E_PIC1ALT: string,
  E_PIC1TITLE: string,
  E_PIC1PHOTOGRAPHER: string,
  E_PIC1COPYRIGHT: string,
  E_PIC1LICENSE: string,
  IMAGELINK_2: string,
  IMAGELINK_2_BIG: string,
  IMAGELINK_2_XL: string,
  E_PIC2ALT: string,
  E_PIC2TITLE: string,
  E_PIC2PHOTOGRAPHER: string,
  E_PIC2COPYRIGHT: string,
  E_PIC2LICENSE: string,
  IMAGELINK_3: string,
  IMAGELINK_3_BIG: string,
  IMAGELINK_3_XL: string,
  E_PIC3ALT: string,
  E_PIC3TITLE: string,
  E_PIC3PHOTOGRAPHER: string,
  E_PIC3COPYRIGHT: string,
  E_PIC3LICENSE: string,
  E_TITEL_E: string,
  E_BESCHREIBUNG_E: string,
  E_PREISTEXT_E: string,
  E_URL1DESC_E: string,
  E_URL2DESC_E: string,
  E_KONTAKT_FIRMA_E: string,
  E_LOC_NAME_E: string,
  E_TICKETURL_E: string,
  E_ZEIT_TEXT_E: string,
  E_PIC1ALT_E: string,
  E_PIC2ALT_E: string,
  E_PIC3ALT_E: string,
  REGION_NAME_E: string,
  E_TITEL_PL: string,
  E_BESCHREIBUNG_PL: string,
  E_PREISTEXT_PL: string,
  E_URL1DESC_PL: string,
  E_URL2DESC_PL: string,
  E_KONTAKT_FIRMA_PL: string,
  E_LOC_NAME_PL: string,
  E_TICKETURL_PL: string,
  E_ZEIT_TEXT_PL: string,
  E_PIC1ALT_PL: string,
  E_PIC2ALT_PL: string,
  E_PIC3ALT_PL: string,
  REGION_NAME_PL: string,
  E_BARRIEREFREI_TYPES: string,
  E_BARRIEREFREI_TEXT: string,
  E_BARRIEREFREI_URL: string,
  E_BARRIEREFREI_URLDESC: string,
  E_MODIFYDATE: string
}

export type translatedString = {
  DE: string;
  EN: string;
  PL: string;
}

export interface ParsedEvent {
  id: number;
  eventId: number;
  meetingId: number;
  title: translatedString;
  description: translatedString;
  priceText: translatedString;
  contact: Contact;
  ticketUrl: translatedString;
  donationUrl: string;
  zeitText: translatedString;
  region: translatedString;
  location: Location;
  von: Date;
  bis: Date;
  coords: GeoCoords;
  pictures: Picture[];
  categories: UserCategory[];
  urls: URL[];
  isHighlight: boolean;
  nonTouristic: boolean;
  noDates: boolean;
  highlightRegion: number;
  ferienHighlight: number;
  monatHighlight: number;
  nurRegional: boolean;
  nurStadtRegional: boolean;
  isVirtuell: boolean;
  livestreamUrl: string;
  ausgebucht: boolean;
  tmbCoords: TMBCoords;
  barrierefrei: Barrierefrei;
  category: translatedString;
  motherId: string,

  // TMBORTE_NAME: string,
  // E_TMBORTE_ID: number,
  // E_TMBORTE_ID_NEU: number,
  // E_TMBUSER_ID: number,
}

export interface Barrierefrei {
  types: string;
  text: string;
  url: string;
  urlDesc: string;
}

export interface Picture {
  url: string;
  urlBig: string;
  urlXL: string;
  alt: translatedString;
  title: translatedString;
  photographer: string;
  copyright: string;
  license: string;
}

export interface URL {
  link: string;
  description: translatedString;
}

export interface Region {
  id: number;
  name: translatedString;
}

export interface Location {
  name: string | translatedString;
  street: string;
  zip: number;
  city: string;
  tel: string;
  fax: string;
  email: string;
  web: string;
}

export interface GeoCoords {
  lat: number;
  lng: number;
}

export interface TMBCoords {
  x: number;
  y: number;
}

export type UserCategory = {
  id: number;
  newId: number;
  name: translatedString;
};

export interface Contact {
  firma: translatedString,
  name: translatedString,
  location: Location
}


export interface BrandenburgEvents {
  count: number;
  date: string;
  EVENT: RawEvent[];
}
