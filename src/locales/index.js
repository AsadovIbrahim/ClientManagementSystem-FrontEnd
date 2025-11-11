import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import az from './az.json'
import ru from './ru.json'


const resources = {
  en: { translation: en }, 
  az: { translation: az },
  ru: { translation: ru },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "ru",
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false,
  },
});

