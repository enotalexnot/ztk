import { Check } from "lucide-react";

export default function CompanyInfoSection() {
  const advantages = [
    "Электротехническое оборудование",
    "Аккумуляторные батареи и зарядные устройства",
    "Компрессорное и пескоструйное оборудование",
    "Комплектующие и запасные части",
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-6xl font-bold text-etk-red mb-4">30+</div>
            <h2 className="text-3xl font-bold mb-4">
              Компания "ЭТК" - более 30 лет на рынке!
            </h2>
            <p className="text-etk-gray mb-6">
              Надёжность и квалифицированный подход, проверенные временем.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">
              Поставим для Вас промышленное оборудование:
            </h3>
            <ul className="space-y-3">
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-etk-red flex-shrink-0" />
                  <span>{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
