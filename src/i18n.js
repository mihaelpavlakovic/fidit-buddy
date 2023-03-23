import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";

i18n
  .use(backend)
  .use(initReactI18next)
  .init({
    lng: "hr",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
