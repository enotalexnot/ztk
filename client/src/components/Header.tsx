import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, Phone, Mail, Clock } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Каталог", path: "/catalog" },
    { name: "Услуги", path: "/services" },
    { name: "О компании", path: "/about" },
    { name: "Контакты", path: "/contact" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header className="bg-etk-dark-gray text-white">
      {/* Top Bar */}
      <div className="bg-gray-800 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`hover:text-red-500 transition-colors ${
                    location === item.path ? "text-red-500" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 h-8 text-black text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-etk-red hover:bg-etk-red px-3 py-1 h-8"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-etk-red p-2 rounded font-bold text-xl">ЭТК</div>
              <div>
                <div className="font-bold text-lg">ПРОМЫШЛЕННОЕ</div>
                <div className="text-sm">ОБОРУДОВАНИЕ</div>
              </div>
            </Link>

            {/* Contact Info */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-sm">info@etk-kurs.ru</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="text-sm">Пн-пт 08:30 - 17:30</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-red-500" />
                  8 800 200 60 10
                </div>
                <div className="text-sm text-gray-300">Звонок бесплатный</div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="space-y-4 mt-8">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">Меню</h3>
                    <nav className="space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className="block py-2 text-lg hover:text-red-500 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-red-500" />
                      <span className="text-sm">info@etk-kurs.ru</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-red-500" />
                      <span className="text-sm">8 800 200 60 10</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Пн-пт 08:30 - 17:30</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
