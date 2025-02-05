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
