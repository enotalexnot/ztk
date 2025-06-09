import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Zap, Settings, Battery } from "lucide-react";

const slides = [
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

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Slider */}
          <div className="lg:col-span-2 relative">
            <div className="bg-gradient-to-r from-black/70 to-transparent absolute inset-0 z-10 rounded-xl"></div>
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="w-full h-96 object-cover rounded-xl transition-all duration-500"
            />
            <div className="absolute inset-0 z-20 flex items-center px-8">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-4">{currentSlideData.title}</h1>
                <p className="text-xl mb-6">{currentSlideData.subtitle}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-6xl font-light">{currentSlideData.slideNumber}</span>
                  <div className="w-12 h-px bg-white"></div>
                  <span className="text-6xl font-light">
                    {slides.length.toString().padStart(2, '0')}
                  </span>
                </div>
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

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-etk-red text-white p-6 rounded-xl hover:bg-red-700 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <Zap className="h-8 w-8" />
                <div>
                  <h3 className="font-bold">ЭЛЕКТРОТЕХНИЧЕСКОЕ</h3>
                  <p className="text-sm">ОБОРУДОВАНИЕ</p>
                </div>
              </div>
            </div>
            
            <div className="bg-etk-red text-white p-6 rounded-xl hover:bg-red-700 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <Settings className="h-8 w-8" />
                <div>
                  <h3 className="font-bold">ПЕСКОСТРУЙНОЕ И</h3>
                  <p className="text-sm">КОМПРЕССОРНОЕ</p>
                  <p className="text-sm">ОБОРУДОВАНИЕ</p>
                </div>
              </div>
            </div>
            
            <div className="bg-etk-red text-white p-6 rounded-xl hover:bg-red-700 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <Battery className="h-8 w-8" />
                <div>
                  <h3 className="font-bold">АККУМУЛЯТОРНЫЕ</h3>
                  <p className="text-sm">БАТАРЕИ И ЗАРЯДНЫЕ</p>
                  <p className="text-sm">УСТРОЙСТВА</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
