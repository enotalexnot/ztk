import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import CompanyInfoSection from "@/components/CompanyInfoSection";
import NewsSection from "@/components/NewsSection";
import PartnersSection from "@/components/PartnersSection";
import { useLanguage } from "@/hooks/useLanguage";

export default function Home() {
  const { language } = useLanguage();
  
  const title = language === "ru" 
    ? "ЭТК - Электротехническое оборудование и комплексные решения"
    : "ETC - Electrical Equipment and Comprehensive Solutions";
    
  const description = language === "ru"
    ? "Поставка качественного электротехнического оборудования, аккумуляторов и зарядных устройств. Комплексные решения для промышленности."
    : "Supply of quality electrical equipment, batteries and chargers. Comprehensive solutions for industry.";

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={language === "ru" 
          ? "электротехническое оборудование, аккумуляторы, зарядные устройства, промышленное оборудование, ЭТК"
          : "electrical equipment, batteries, chargers, industrial equipment, ETC"
        } />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
      </Helmet>
      
      <HeroSection />
      <CategorySection />
      <CompanyInfoSection />
      <NewsSection />
      <PartnersSection />
    </div>
  );
}
