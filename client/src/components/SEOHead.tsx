import { useLanguage } from "@/hooks/useLanguage";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  canonical,
  ogImage = "/og-image.jpg" 
}: SEOHeadProps) {
  const { language } = useLanguage();
  
  const defaultTitle = language === "ru" 
    ? "ЭТК - Электротехническое оборудование и комплексные решения"
    : "ETC - Electrical Equipment and Comprehensive Solutions";
    
  const defaultDescription = language === "ru"
    ? "Поставка качественного электротехнического оборудования, аккумуляторов и зарядных устройств. Комплексные решения для промышленности."
    : "Supply of quality electrical equipment, batteries and chargers. Comprehensive solutions for industry.";
    
  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const defaultKeywords = language === "ru"
    ? "электротехническое оборудование, аккумуляторы, зарядные устройства, промышленное оборудование, ЭТК"
    : "electrical equipment, batteries, chargers, industrial equipment, ETC";
  const finalKeywords = keywords || defaultKeywords;

  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={language === "ru" ? "ru_RU" : "en_US"} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Language alternates */}
      <link rel="alternate" hrefLang="ru" href="?lang=ru" />
      <link rel="alternate" hrefLang="en" href="?lang=en" />
      <link rel="alternate" hrefLang="x-default" href="?lang=ru" />
    </>
  );
}