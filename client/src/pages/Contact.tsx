import ContactForm from "@/components/ContactForm";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Users } from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Адрес",
      content: ["Россия, г. Великие Луки", "ул. Строителей, д. 34"]
    },
    {
      icon: Phone,
      title: "Телефон",
      content: ["+7 (812) 123-45-67", "8 800 200 60 10"]
    },
    {
      icon: Mail,
      title: "Email",
      content: ["info@etk-kurs.ru", "sales@etk-kurs.ru"]
    },
    {
      icon: Clock,
      title: "Режим работы",
      content: ["Пн-Пт: 8:30 - 17:30", "Сб-Вс: выходные"]
    }
  ];

  const departments = [
    {
      name: "Отдел продаж",
      phone: "+7 (812) 123-45-67",
      email: "sales@etk-kurs.ru",
      description: "Консультации по продукции и коммерческие предложения"
    },
    {
      name: "Техническая поддержка",
      phone: "+7 (812) 123-45-68",
      email: "support@etk-kurs.ru", 
      description: "Техническое консультирование и сервисное обслуживание"
    },
    {
      name: "Отдел логистики",
      phone: "+7 (812) 123-45-69",
      email: "logistics@etk-kurs.ru",
      description: "Вопросы доставки и отгрузки оборудования"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Контакты</h1>
        <p className="text-xl text-etk-gray max-w-3xl mx-auto">
          Свяжитесь с нами удобным для вас способом. Наши специалисты готовы ответить 
          на любые вопросы и предоставить профессиональную консультацию.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <div>
          <ContactForm />
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Контактная информация</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-etk-red/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="w-5 h-5 text-etk-red" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">{info.title}</h3>
                        {info.content.map((line, idx) => (
                          <p key={idx} className="text-etk-gray text-sm">{line}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Departments */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Отделы компании</h3>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-etk-red/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="w-4 h-4 text-etk-red" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{dept.name}</h4>
                        <p className="text-xs text-etk-gray mb-2">{dept.description}</p>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 text-xs">
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3 h-3" />
                            <span>{dept.phone}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Mail className="w-3 h-3" />
                            <span>{dept.email}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-etk-light-gray rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-8">Как нас найти</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map placeholder */}
          <div className="bg-gray-300 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-600">Карта с местоположением офиса</p>
          </div>
          
          {/* Directions */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Схема проезда</h3>
            <div className="space-y-3 text-etk-gray">
              <p>
                <strong>На автомобиле:</strong> Двигаясь по ул. Ленина, поверните направо на ул. Строителей. 
                Наш офис находится в доме 34, рядом с торговым центром.
              </p>
              <p>
                <strong>На общественном транспорте:</strong> Автобусы №12, 15, 23 до остановки "Строителей". 
                От остановки 2 минуты пешком.
              </p>
              <p>
                <strong>Парковка:</strong> Бесплатная парковка для клиентов рядом с офисом.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
