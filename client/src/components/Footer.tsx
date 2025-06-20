import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      console.log("Subscribing email:", email);
      setEmail("");
    }
  };

  return (
    <footer className="bg-etk-dark-gray text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Контакты</h3>
            <div className="space-y-3 text-gray-300">
              <p>Россия г. Великие Луки</p>
              <p>ул. Строителей, д. 34</p>
              <p>Телефон: +7 (812) 123-45-67</p>
              <p>Email: info@etk-kurs.ru</p>
              <p>Время работы: 8:30 - 17:30 пн-пт</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-red-500 transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-red-500 transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-red-500 transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-500 transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Подписка на новости</h3>
            <p className="text-gray-300 mb-4">
              Получайте последние новости о наших продуктах
            </p>
            <form onSubmit={handleSubscribe} className="flex mb-6">
              <Input
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-r-none text-black"
                required
              />
              <Button
                type="submit"
                className="bg-etk-red hover:bg-etk-red rounded-l-none"
              >
                Подписаться
              </Button>
            </form>
            
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 ЭТК. Все права защищены.
            </p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-red-500 transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="hover:text-red-500 transition-colors">
                Пользовательское соглашение
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
