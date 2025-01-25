export enum Language {
  de = "de",
}

export const getLanguage = (lang: string | null): Language => {
  switch (lang) {
    case 'de':
      return Language.de;
    default:
      return Language.de; // Default to 'nl' if the language is not supported
  }
}
