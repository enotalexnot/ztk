import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Award, Users, Clock, Globe } from "lucide-react";

export default function About() {
  const advantages = [
    {
      icon: Award,
      title: "30+ лет опыта",
      description: "Более 30 лет успешной работы на рынке промышленного оборудования"
    },
    {
      icon: Users,
      title: "Квалифицированная команда",
      description: "Высококвалифицированные специалисты с многолетним опытом"
    },
    {
      icon: Clock,
      title: "Быстрая доставка",
      description: "Оперативная доставка по всей России и странам СНГ"
    },
    {
      icon: Globe,
      title: "Широкая география",
      description: "Работаем с клиентами по всей России и зарубежом"
    }
  ];

  const services = [
    "Поставка промышленного оборудования",
    "Техническое консультирование",
    "Гарантийное и постгарантийное обслуживание",
    "Подбор оборудования под конкретные задачи",
    "Логистические услуги",
    "Сервисное обслуживание"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">О компании ЭТК</h1>
        <p className="text-xl text-etk-gray max-w-3xl mx-auto">
          Компания ООО «ЭТК» — лидер в области дистрибуции и поставки промышленного оборудования. 
          Более 30 лет мы работаем с ведущими российскими и зарубежными производителями.
        </p>
      </div>

      {/* Company Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <img
            src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
            alt="Компания ЭТК"
            className="w-full h-80 object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="bg-etk-red text-white p-4 rounded-lg inline-block mb-6 w-fit">
            <span className="font-bold">Доставим по всей России и СНГ</span>
          </div>
          
          <div className="space-y-4 text-etk-gray">
            <p>
              Компания ООО «ЭТК» — лидер в области дистрибуции и поставки промышленного оборудования. 
              Более 30 лет мы работаем с ведущими российскими и зарубежными производителями оборудования и комплектующих.
            </p>
            
            <p>
              ООО «ЭТК» по праву входит в первую десятку поставщиков промышленного оборудования 
              в Северо-Западном федеральном округе по версии журнала «Промышленные страницы».
            </p>
            
            <p>
              За прошедшие годы мы накопили огромный опыт, освоили современные технологии продаж 
              и обслуживания, построили развитую дилерскую сеть.
            </p>
            
            <p>
              Мы используем современные складские управляющие системы, обеспечиваем логистическую 
              поддержку клиентов.
            </p>
          </div>
        </div>
      </div>

      {/* Advantages */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Наши преимущества</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => {
            const IconComponent = advantage.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-etk-red/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-etk-red" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{advantage.title}</h3>
                  <p className="text-etk-gray text-sm">{advantage.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Services */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Наши услуги</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                <Check className="h-5 w-5 text-etk-red flex-shrink-0" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Stats */}
      <div className="bg-etk-light-gray rounded-xl p-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-etk-red mb-2">30+</div>
            <p className="text-etk-gray">лет на рынке</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-etk-red mb-2">1000+</div>
            <p className="text-etk-gray">довольных клиентов</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-etk-red mb-2">50+</div>
            <p className="text-etk-gray">регионов поставки</p>
          </div>
        </div>
      </div>
    </div>
  );
}
