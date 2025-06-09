import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import CompanyInfoSection from "@/components/CompanyInfoSection";
import NewsSection from "@/components/NewsSection";
import PartnersSection from "@/components/PartnersSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategorySection />
      <CompanyInfoSection />
      <NewsSection />
      <PartnersSection />
    </div>
  );
}
