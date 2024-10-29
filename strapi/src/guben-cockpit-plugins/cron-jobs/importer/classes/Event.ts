import {Contact, ParsedEvent, translatedString, Location, GeoCoords, Picture, UserCategory, TMBCoords, Barrierefrei, RawEvent, URL} from "../types/events";

export class Event implements ParsedEvent {

  _id: number;
  _eventId: number;
  _meetingId: number;
  _title: translatedString;
  _description: translatedString;
  _priceText: translatedString;
  _contact: Contact;
  _ticketUrl: translatedString;
  _donationUrl: string;
  _zeitText: translatedString;
  _region: translatedString;
  _location: Location;
  _von: Date;
  _bis: Date;
  _coords: GeoCoords;
  _pictures: Picture[];
  _categories: UserCategory[];
  _urls: URL[];
  _isHighlight: boolean;
  _nonTouristic: boolean;
  _noDates: boolean;
  _highlightRegion: number;
  _ferienHighlight: number;
  _monatHighlight: number;
  _nurRegional: boolean;
  _nurStadtRegional: boolean;
  _isVirtuell: boolean;
  _livestreamUrl: string;
  _ausgebucht: boolean;
  _tmbCoords: TMBCoords;
  _barrierefrei: Barrierefrei;
  _category: translatedString;
  _motherId: string;

  constructor(event: RawEvent) {
    this._id = event.E_ID;
    this._eventId = event.EVENT_ID;
    this._meetingId = event.TERMIN_ID;
    this._title = {
      DE: event.E_TITEL,
      EN: event.E_TITEL_E,
      PL: event.E_TITEL_PL
    };
    this._description = {
      DE: event.E_BESCHREIBUNG,
      EN: event.E_BESCHREIBUNG_E,
      PL: event.E_BESCHREIBUNG_PL
    };
    this._priceText = {
      DE: event.E_PREISTEXT,
      EN: event.E_PREISTEXT_E,
      PL: event.E_PREISTEXT_PL
    };
    this._contact = {
      name: {
        DE: event.E_KONTAKT_NAME,
        EN: "",
        PL: ""
      },
      firma: {
        DE: event.E_KONTAKT_FIRMA,
        EN: event.E_KONTAKT_FIRMA_E,
        PL: event.E_KONTAKT_FIRMA_PL
      },
      location: {
        name: event.E_KONTAKT_ORT,
        street: event.E_KONTAKT_STRASSE,
        zip: event.E_KONTAKT_PLZ,
        city: event.E_KONTAKT_ORT,
        tel: event.E_KONTAKT_TEL,
        fax: event.E_KONTAKT_FAX,
        email: event.E_KONTAKT_EMAIL,
        web: event.E_KONTAKT_WEB
      }
    };
    this._location = {
      name: {
        DE: event.E_LOC_NAME,
        EN: event.E_LOC_NAME_E,
        PL: event.E_LOC_NAME_PL
      },
      street: event.E_LOC_STRASSE,
      zip: event.E_LOC_PLZ,
      city: event.E_LOC_ORT,
      tel: event.E_LOC_TEL,
      fax: event.E_LOC_FAX,
      email: event.E_LOC_EMAIL,
      web: event.E_LOC_WEB
    };
    this._ticketUrl = {
      DE: event.E_TICKETURL_D,
      EN: event.E_TICKETURL_E,
      PL: event.E_TICKETURL_PL
    };
    this._donationUrl = event.E_SPENDENURL;
    this._zeitText = {
      DE: event.E_ZEIT_TEXT,
      EN: event.E_ZEIT_TEXT_E,
      PL: event.E_ZEIT_TEXT_PL
    };
    this._region = {
      DE: event.REGION_NAME_D,
      EN: event.REGION_NAME_E,
      PL: event.REGION_NAME_PL
    };
    this._von = new Date(`${event.E_DATUM_VON}${event.E_ZEIT_VON !== '' ? 'T' + event.E_ZEIT_VON : ''}`);
    this._bis = new Date(`${event.E_DATUM_BIS}${event.E_ZEIT_BIS !== '' ? 'T' + event.E_ZEIT_BIS : ''}`);
    this._coords = {
      lat: event.E_GEOKOORD_LAT,
      lng: event.E_GEOKOORD_LNG
    };
    this._pictures = [
      {
        url: event.IMAGELINK,
        urlBig: event.IMAGELINK_BIG,
        urlXL: event.IMAGELINK_XL,
        alt: {
          DE: event.E_PIC1ALT,
          EN: event.E_PIC1ALT_E,
          PL: event.E_PIC1ALT_PL
        },
        title: {
          DE: event.E_PIC1TITLE,
          EN: event.E_PIC1TITLE,
          PL: event.E_PIC1TITLE
        },
        photographer: event.E_PIC1PHOTOGRAPHER,
        copyright: event.E_PIC1COPYRIGHT,
        license: event.E_PIC1LICENSE
      },
      {
        url: event.IMAGELINK_2,
        urlBig: event.IMAGELINK_2_BIG,
        urlXL: event.IMAGELINK_2_XL,
        alt: {
          DE: event.E_PIC2ALT,
          EN: event.E_PIC2ALT_E,
          PL: event.E_PIC2ALT_PL
        },
        title: {
          DE: event.E_PIC2TITLE,
          EN: event.E_PIC2TITLE,
          PL: event.E_PIC2TITLE
        },
        photographer: event.E_PIC2PHOTOGRAPHER,
        copyright: event.E_PIC2COPYRIGHT,
        license: event.E_PIC2LICENSE
      },
      {
        url: event.IMAGELINK_3,
        urlBig: event.IMAGELINK_3_BIG,
        urlXL: event.IMAGELINK_3_XL,
        alt: {
          DE: event.E_PIC3ALT,
          EN: event.E_PIC3ALT_E,
          PL: event.E_PIC3ALT_PL
        },
        title: {
          DE: event.E_PIC3TITLE,
          EN: event.E_PIC3TITLE,
          PL: event.E_PIC3TITLE
        },
        photographer: event.E_PIC3PHOTOGRAPHER,
        copyright: event.E_PIC3COPYRIGHT,
        license: event.E_PIC3LICENSE
      }
    ];
    this._categories = [
      {
        id: event.E_USERKATEGORIE_ID,
        newId: event.E_USERKATEGORIE_ID_NEU,
        name: {
          DE: event.KATEGORIE_NAME_D,
          EN: event.KATEGORIE_NAME_E,
          PL: event.KATEGORIE_NAME_PL
        }
      },
      {
        id: parseInt(event.E_USERKATEGORIE2_ID),
        newId: parseInt(event.E_USERKATEGORIE2_ID_NEU),
        name: {
          DE: event.E_USERKATEGORIE2_NAME,
          EN: event.E_USERKATEGORIE2_NAME_E,
          PL: event.E_USERKATEGORIE2_NAME_PL
        }
      },
      {
        id: parseInt(event.E_USERKATEGORIE3_ID),
        newId: parseInt(event.E_USERKATEGORIE3_ID_NEU),
        name: {
          DE: event.E_USERKATEGORIE3_NAME,
          EN: event.E_USERKATEGORIE3_NAME_E,
          PL: event.E_USERKATEGORIE3_NAME_PL
        }
      },
      {
        id: parseInt(event.E_USERKATEGORIE4_ID),
        newId: parseInt(event.E_USERKATEGORIE4_ID_NEU),
        name: {
          DE: event.E_USERKATEGORIE4_NAME,
          EN: event.E_USERKATEGORIE4_NAME_E,
          PL: event.E_USERKATEGORIE4_NAME_PL
        }
      }
    ];
    this._urls = [
      {
        link: event.E_URL1,
        description: {
          DE: event.E_URL1DESC,
          EN: event.E_URL1DESC_E,
          PL: event.E_URL1DESC_PL
        }
      },
      {
        link: event.E_URL2,
        description: {
          DE: event.E_URL2DESC,
          EN: event.E_URL2DESC_E,
          PL: event.E_URL2DESC_PL
        }
      }
    ];
    this._isHighlight = Boolean(event.E_ISHIGHLIGHT);
    this._nonTouristic = event.E_NONTOURISTIC;
    this._noDates = event.E_NODATES;
    this._highlightRegion = event.E_HIGHLIGHTREGION;
    this._ferienHighlight = event.E_FERIEN_HIGHLIGHT;
    this._monatHighlight = event.E_MONAT_HIGHLIGHT;
    this._nurRegional = Boolean(event.E_NURREGIONAL);
    this._nurStadtRegional = Boolean(event.E_NURSTADTREGIONAL);
    this._isVirtuell = Boolean(event.E_ISVIRTUELL);
    this._livestreamUrl = event.E_LIVESTREAMURL;
    this._ausgebucht = Boolean(event.E_AUSGEBUCHT);
    this._tmbCoords = {
      x: event.E_TMBKOORDS_X,
      y: event.E_TMBKOORDS_Y
    };
    this._barrierefrei = {
      types: event.E_BARRIEREFREI_TYPES,
      text: event.E_BARRIEREFREI_TEXT,
      url: event.E_BARRIEREFREI_URL,
      urlDesc: event.E_BARRIEREFREI_URLDESC
    };
    this._category = {
      DE: event.KATEGORIE_NAME_D,
      EN: event.KATEGORIE_NAME_E,
      PL: event.KATEGORIE_NAME_PL
    };
    this._motherId = event.E_MOTHER_ID;
  }

  get id() {
    return this._id;
  }

  get eventId() {
    return this._eventId;
  }

  get meetingId() {
    return this._meetingId;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get priceText() {
    return this._priceText;
  }

  get contact() {
    return this._contact;
  }

  get ticketUrl() {
    return this._ticketUrl;
  }

  get donationUrl() {
    return this._donationUrl;
  }

  get zeitText() {
    return this._zeitText;
  }

  get region() {
    return this._region;
  }

  get location() {
    return this._location;
  }

  get von() {
    return this._von;
  }

  get bis() {
    return this._bis;
  }

  get coords() {
    return this._coords;
  }

  get pictures() {
    return this._pictures;
  }

  get categories() {
    return this._categories;
  }

  get urls() {
    return this._urls;
  }

  get isHighlight() {
    return this._isHighlight;
  }

  get nonTouristic() {
    return this._nonTouristic;
  }

  get noDates() {
    return this._noDates;
  }

  get highlightRegion() {
    return this._highlightRegion;
  }

  get ferienHighlight() {
    return this._ferienHighlight;
  }

  get monatHighlight() {
    return this._monatHighlight;
  }

  get nurRegional() {
    return this._nurRegional;
  }

  get nurStadtRegional() {
    return this._nurStadtRegional;
  }

  get isVirtuell() {
    return this._isVirtuell;
  }

  get livestreamUrl() {
    return this._livestreamUrl;
  }

  get ausgebucht() {
    return this._ausgebucht;
  }

  get tmbCoords() {
    return this._tmbCoords;
  }

  get barrierefrei() {
    return this._barrierefrei;
  }

  get category() {
    return this._category;
  }

  get motherId() {
    return this._motherId;
  }
}
