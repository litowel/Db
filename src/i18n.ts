import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        checkEligibility: "Check Eligibility",
        membership: "Membership",
        dashboard: "Dashboard",
        signIn: "Sign In",
        logOut: "Log Out"
      },
      footer: {
        description: "AI-powered funding matches for growing businesses.",
        rights: "DealBridge AI (powered by Upfrica.africa) &copy; 2026. All rights reserved."
      }
    }
  },
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        checkEligibility: "Vérifier l'éligibilité",
        membership: "Adhésion",
        dashboard: "Tableau de bord",
        signIn: "Se connecter",
        logOut: "Se déconnecter"
      },
      footer: {
        description: "Des financements propulsés par l'IA pour les entreprises en croissance.",
        rights: "DealBridge AI (géré par Upfrica.africa) &copy; 2026. Tous droits réservés."
      }
    }
  },
  sw: {
    translation: {
      nav: {
        home: "Nyumbani",
        checkEligibility: "Angalia Kustahiki",
        membership: "Uanachama",
        dashboard: "Dashibodi",
        signIn: "Ingia",
        logOut: "Toka"
      },
      footer: {
        description: "Ufadhili unaendeshwa na AI kwa biashara zinazokua.",
        rights: "DealBridge AI (inaendeshwa na Upfrica.africa) &copy; 2026. Haki zote zimehifadhiwa."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
