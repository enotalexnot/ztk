import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Category, type SliderItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Zap, Settings, Battery, Car, Wrench, Cpu, Gauge, Power } from "lucide-react";

const iconMap = {
  "Zap": Zap,
  "Battery": Battery,
  "Settings": Settings,
  "Car": Car,
  "Wrench": Wrench,
  "Cpu": Cpu,
  "Gauge": Gauge,
  "Power": Power,
};

// Fallback slides for when no slider items are available
const fallbackSlides = [
  {
    title: "ЗАРЯДНЫЕ УСТРОЙСТВА",
    subtitle: "для кислотных, щелочных и литиевых АКБ",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    slideNumber: "01"
  },
  {
    title: "АКБ ДЛЯ СКЛАДСКОЙ ТЕХНИКИ",
    subtitle: "погрузчики, штабелеры, электрокары",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    slideNumber: "02"
  },
  {
    title: "СТАЦИОНАРНЫЕ АККУМУЛЯТОРЫ",
    subtitle: "для электростанций и ИБП",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    slideNumber: "03"
  }
];

function CategoriesSidebar() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse p-6 rounded-xl h-20"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories?.slice(0, 3).map((category) => {
        const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Zap;
        
        return (
          <div
            key={category.id}
            className="bg-etk-red text-white p-6 rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-3">
              <IconComponent className="h-8 w-8" />
              <div>
                <h3 className="font-bold text-sm uppercase">{category.name}</h3>
                {category.description && (
                  <p className="text-xs opacity-90">{category.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: sliderItems } = useQuery<SliderItem[]>({
    queryKey: ["/api/slider-items"],
  });

  // Use slider items from admin panel or fallback slides
  const activeSlides = sliderItems?.filter(item => item.isActive).sort((a, b) => a.order - b.order) || [];
  const slides = activeSlides.length > 0 ? activeSlides : fallbackSlides;

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide] || fallbackSlides[0];

  if (!currentSlideData) {
    return <div>Загрузка...</div>;
  }

  const getImageUrl = (slide: any) => {
    if ('imageUrl' in slide && slide.imageUrl) return slide.imageUrl;
    if ('image' in slide && slide.image) return slide.image;
    return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600";
  };

  const getSubtitle = (slide: any) => {
    if ('subtitle' in slide && slide.subtitle) return slide.subtitle;
    if ('description' in slide && slide.description) return slide.description;
    return "";
  };

  return (
    <section className="relative">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Slider */}
          <div className="lg:col-span-2 relative">
            <div className="bg-gradient-to-r from-black/70 to-transparent absolute inset-0 z-10 rounded-xl"></div>
            <img
              src={getImageUrl(currentSlideData)}
              alt={currentSlideData.title}
              className="w-full h-96 object-cover rounded-xl transition-all duration-500"
            />
            <div className="absolute inset-0 z-20 flex items-center px-8">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-4">{currentSlideData.title}</h1>
                <p className="text-xl mb-6">{getSubtitle(currentSlideData)}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-6xl font-light">{(currentSlide + 1).toString().padStart(2, '0')}</span>
                  <div className="w-12 h-px bg-white"></div>
                  <span className="text-6xl font-light">
                    {slides.length.toString().padStart(2, '0')}
                  </span>
                </div>
                {('buttonText' in currentSlideData && currentSlideData.buttonText && currentSlideData.buttonUrl) && (
                  <div className="mt-6">
                    <Button 
                      variant="secondary" 
                      className="bg-etk-red hover:bg-red-700 text-white"
                      onClick={() => window.location.href = currentSlideData.buttonUrl!}
                    >
                      {currentSlideData.buttonText}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
              <Button
                variant="secondary"
                size="icon"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full text-white border-0"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full text-white border-0"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories Sidebar */}
          <div className="space-y-4">
            {categories?.slice(0, 3).map((category: Category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Zap;
              
              return (
                <div
                  key={category.id}
                  className="bg-etk-red text-white p-6 rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <IconComponent className="h-8 w-8" />
                    <div>
                      <h3 className="font-bold text-sm uppercase">{category.name}</h3>
                      {category.description && (
                        <p className="text-xs opacity-90">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
