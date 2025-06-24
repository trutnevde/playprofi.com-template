import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const toggleLanguage = () => {
    window.location.reload();
    const newLang = language === "en" ? "ru" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    setLanguage(newLang);
    
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && savedLang !== language) {
      i18n.changeLanguage(savedLang);
      setLanguage(savedLang);
    }
  }, []);

  return (
    <p
      className="cursor-pointer rounded-lg bg-dark-supporting px-3 py-1 text-[14px] text-gray transition-colors duration-300 hover:text-main-accent"
      onClick={toggleLanguage}
    >
      {language.toUpperCase()}
    </p>
  );
};

export default LanguageSwitcher;
