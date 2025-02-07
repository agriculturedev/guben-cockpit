import { initReactI18next } from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from 'i18next-resources-to-backend';
import { Language } from './Languages';
import i18next from 'i18next';
import { FetchInterceptor } from "@/utilities/fetchApiExtensions";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`../../assets/locales/${language}/${namespace}.json`)))
  .init({
    load: "languageOnly",
    defaultNS: "common",
    supportedLngs: Object.keys(Language),
    fallbackLng: Language.de,
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key) =>
      console.error(`Translation for key '${ns}/${key}' in languages: ${lngs} is missing`)
  });

// Correct way to handle language changes
i18next.on("languageChanged", (lng) => {
  console.log("langauge changed", lng)
  FetchInterceptor.setHeader("Accept-Language", lng);
});
