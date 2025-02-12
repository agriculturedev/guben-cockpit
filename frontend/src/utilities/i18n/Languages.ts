export enum Language {
  de = "de",
  en = "en"
}

export const getLanguage = (lang: string | null): Language => {
  switch (lang) {
    case 'de':
      return Language.de;
    case 'en':
      return Language.en;
    default:
      return Language.de; // Default to 'nl' if the language is not supported
  }
}


export const getLocalizedLanguagename = (language: string) => {
  // returns the specified languages full name, in that given language so DE will be Deutsch, EN will be Englisch and NL would be Nederlands
  return new Intl.DisplayNames([language], {type: 'language'}).of(language);
}
