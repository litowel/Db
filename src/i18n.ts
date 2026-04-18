import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: { home: "Home", checkEligibility: "Check Eligibility", membership: "Membership", dashboard: "Dashboard", signIn: "Sign In", logOut: "Log Out" },
      footer: { description: "AI-powered funding matches for growing businesses." }
    }
  },
  fr: {
    translation: {
      nav: { home: "Accueil", checkEligibility: "Vérifier l'éligibilité", membership: "Adhésion", dashboard: "Tableau de bord", signIn: "Se connecter", logOut: "Se déconnecter" },
      footer: { description: "Des financements propulsés par l'IA pour les entreprises en croissance." }
    }
  },
  sw: {
    translation: {
      nav: { home: "Nyumbani", checkEligibility: "Angalia Kustahiki", membership: "Uanachama", dashboard: "Dashibodi", signIn: "Ingia", logOut: "Toka" },
      footer: { description: "Ufadhili unaendeshwa na AI kwa biashara zinazokua." }
    }
  },
  es: {
    translation: {
      nav: { home: "Inicio", checkEligibility: "Verificar Elegibilidad", membership: "Membresía", dashboard: "Panel", signIn: "Iniciar sesión", logOut: "Cerrar sesión" },
      footer: { description: "Financiamiento impulsado por IA para empresas en crecimiento." }
    }
  },
  zh: {
    translation: {
      nav: { home: "首页", checkEligibility: "检查资格", membership: "会员资格", dashboard: "仪表板", signIn: "登录", logOut: "登出" },
      footer: { description: "为成长型企业提供AI驱动的资金匹配。" }
    }
  },
  ar: {
    translation: {
      nav: { home: "الرئيسية", checkEligibility: "التحقق من الأهلية", membership: "العضوية", dashboard: "لوحة القيادة", signIn: "تسجيل الدخول", logOut: "تسجيل خروج" },
      footer: { description: "تمويل مدعوم بالذكاء الاصطناعي للشركات النامية." }
    }
  },
  hi: {
    translation: {
      nav: { home: "होम", checkEligibility: "पात्रता जांचें", membership: "सदस्यता", dashboard: "डैशबोर्ड", signIn: "साइन इन", logOut: "लॉग आउट" },
      footer: { description: "बढ़ते व्यवसायों के लिए एआई-संचालित फंडिंग मैच।" }
    }
  },
  pt: {
    translation: {
      nav: { home: "Início", checkEligibility: "Verificar Elegibilidade", membership: "Membros", dashboard: "Painel", signIn: "Entrar", logOut: "Sair" },
      footer: { description: "Financiamento impulsionado por IA para empresas em crescimento." }
    }
  },
  de: {
    translation: {
      nav: { home: "Startseite", checkEligibility: "Berechtigung prüfen", membership: "Mitgliedschaft", dashboard: "Dashboard", signIn: "Anmelden", logOut: "Abmelden" },
      footer: { description: "KI-gesteuerte Finanzierungen für wachsende Unternehmen." }
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
