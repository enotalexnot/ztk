import { useState, useEffect } from "react";

export type Language = "ru" | "en";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "ru";
    }
    return "ru";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === "ru" ? "en" : "ru");
  };

  return { language, setLanguage, toggleLanguage };
}

export const translations = {
  ru: {
    // Navigation
    home: "Главная",
    catalog: "Каталог",
    about: "О компании",
    services: "Услуги",
    contact: "Контакты",
    admin: "Админ",
    
    // Home page
    heroTitle: "Электротехническая компания",
    heroSubtitle: "Профессиональные решения для промышленности",
    heroDescription: "Более 15 лет на рынке электротехнического оборудования. Поставляем качественную продукцию для промышленных предприятий.",
    viewCatalog: "Смотреть каталог",
    getConsultation: "Получить консультацию",
    
    // Categories
    categoriesTitle: "Категории продукции",
    categoriesSubtitle: "Широкий ассортимент электротехнического оборудования",
    viewProducts: "Просмотреть товары",
    
    // Company info
    aboutCompany: "О компании",
    experience: "лет опыта",
    clients: "клиентов",
    projects: "проектов",
    products: "товаров",
    
    // News
    news: "Новости",
    articles: "Статьи",
    
    // Contact
    contactTitle: "Свяжитесь с нами",
    contactSubtitle: "Получите консультацию по выбору оборудования",
    name: "Имя",
    email: "Email",
    phone: "Телефон",
    company: "Компания",
    message: "Сообщение",
    send: "Отправить",
    
    // Catalog
    catalogTitle: "Каталог продукции",
    catalogSubtitle: "Промышленное оборудование высокого качества",
    allProducts: "Все товары",
    filters: "Фильтры",
    search: "Поиск",
    searchProducts: "Поиск товаров...",
    subcategory: "Подкатегория",
    allSubcategories: "Все подкатегории",
    foundProducts: "Найдено товаров",
    productsNotFound: "Товары не найдены",
    changeFilters: "Попробуйте изменить фильтры или поисковый запрос",
    showAll: "Показать все товары",
    previous: "Предыдущая",
    next: "Следующая",
    order: "Заказать",
    recommended: "Рекомендуем",
    model: "Модель",
    
    // Footer
    footerDescription: "Профессиональные решения в области электротехнического оборудования",
    quickLinks: "Быстрые ссылки",
    contactInfo: "Контактная информация",
    followUs: "Мы в соцсетях",
    allRights: "Все права защищены",
  },
  en: {
    // Navigation
    home: "Home",
    catalog: "Catalog",
    about: "About",
    services: "Services",
    contact: "Contact",
    admin: "Admin",
    
    // Home page
    heroTitle: "Electrical Technology Company",
    heroSubtitle: "Professional solutions for industry",
    heroDescription: "More than 15 years in the electrical equipment market. We supply quality products for industrial enterprises.",
    viewCatalog: "View catalog",
    getConsultation: "Get consultation",
    
    // Categories
    categoriesTitle: "Product categories",
    categoriesSubtitle: "Wide range of electrical equipment",
    viewProducts: "View products",
    
    // Company info
    aboutCompany: "About company",
    experience: "years of experience",
    clients: "clients",
    projects: "projects",
    products: "products",
    
    // News
    news: "News",
    articles: "Articles",
    
    // Contact
    contactTitle: "Contact us",
    contactSubtitle: "Get consultation on equipment selection",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    message: "Message",
    send: "Send",
    
    // Catalog
    catalogTitle: "Product catalog",
    catalogSubtitle: "High quality industrial equipment",
    allProducts: "All products",
    filters: "Filters",
    search: "Search",
    searchProducts: "Search products...",
    subcategory: "Subcategory",
    allSubcategories: "All subcategories",
    foundProducts: "Products found",
    productsNotFound: "Products not found",
    changeFilters: "Try changing filters or search query",
    showAll: "Show all products",
    previous: "Previous",
    next: "Next",
    order: "Order",
    recommended: "Recommended",
    model: "Model",
    
    // Footer
    footerDescription: "Professional solutions in electrical equipment",
    quickLinks: "Quick links",
    contactInfo: "Contact information",
    followUs: "Follow us",
    allRights: "All rights reserved",
  }
};

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.ru): string => {
    return translations[language][key] || key;
  };
  
  return { t, language };
}