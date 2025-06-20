import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Settings, 
  HeadphonesIcon, 
  FileText, 
  Shield, 
  Clock,
  CheckCircle,
  Phone
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Truck,
      title: "Поставка оборудования",
      description: "Комплексная поставка промышленного оборудования от ведущих производителей",
      features: [
        "Поиск и подбор оборудования",
        "Прямые поставки от производителей",
        "Конкурентные цены",
        "Контроль качества"
      ]
    },
    {
      icon: Settings,
      title: "Техническое консультирование",
      description: "Профессиональная помощь в выборе оптимального решения для ваших задач",
      features: [
        "Анализ технических требований",
        "Подбор оборудования",
        "Техническая экспертиза",
        "Рекомендации по эксплуатации"
      ]
    },
    {
      icon: HeadphonesIcon,
      title: "Сервисное обслуживание",
      description: "Полный цикл сервисного обслуживания поставленного оборудования",
      features: [
        "Гарантийное обслуживание",
        "Постгарантийный сервис",
        "Техническая поддержка",
        "Обучение персонала"
      ]
    },
    {
      icon: FileText,
      title: "Проектирование решений",
      description: "Разработка комплексных решений для промышленных предприятий",
      features: [
        "Техническое проектирование",
        "Расчеты и схемы",
        "Подбор комплектующих",
        "Документооборот"
      ]
    },
    {
      icon: Shield,
      title: "Гарантийное обслуживание",
      description: "Полная гарантия на все поставляемое оборудование",
      features: [
        "Официальная гарантия",
        "Быстрое устранение неисправностей",
        "Замена оборудования",
        "Техническая поддержка"
      ]
    },
    {
      icon: Clock,
      title: "Логистические услуги",
      description: "Оперативная доставка по всей России и странам СНГ",
      features: [
        "Доставка по России",
        "Международная доставка",
        "Складское хранение",
        "Таможенное оформление"
      ]
    }
  ];

  const workingProcess = [
    {
      step: "01",
      title: "Заявка",
      description: "Получение и обработка вашей заявки на оборудование"
    },
    {
      step: "02",
      title: "Консультация",
      description: "Техническое консультирование и подбор решений"
    },
    {
      step: "03",
      title: "Коммерческое предложение",
      description: "Подготовка детального предложения с ценами"
    },
    {
      step: "04",
      title: "Поставка",
      description: "Изготовление/закупка и доставка оборудования"
    },
    {
      step: "05",
      title: "Ввод в эксплуатацию",
      description: "Монтаж, наладка и запуск оборудования"
    },
    {
      step: "06",
      title: "Сервисное обслуживание",
      description: "Постоянная техническая поддержка и обслуживание"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Наши услуги</h1>
        <p className="text-xl text-etk-gray max-w-3xl mx-auto">
          Комплексное обслуживание в области поставки и обслуживания промышленного оборудования
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-etk-red/10 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-etk-red" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-etk-gray mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-etk-red flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Working Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Как мы работаем</h2>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workingProcess.map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-etk-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{process.title}</h3>
                <p className="text-etk-gray text-sm">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-etk-light-gray rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Нужна консультация?</h2>
        <p className="text-etk-gray mb-6 max-w-2xl mx-auto">
          Наши специалисты готовы помочь вам подобрать оптимальное решение для ваших задач. 
          Свяжитесь с нами для получения персональной консультации.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-etk-red" />
            <span className="font-bold text-lg">8 800 200 60 10</span>
          </div>
          <Badge variant="outline" className="text-etk-red border-etk-red">
            Звонок бесплатный
          </Badge>
        </div>
      </div>
    </div>
  );
}
