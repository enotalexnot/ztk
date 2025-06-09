import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const partners = [
  { name: "ПАРТНЕР 1", color: "text-blue-600" },
  { name: "ПАРТНЕР 2", color: "text-red-600" },
  { name: "ПАРТНЕР 3", color: "text-green-600" },
  { name: "ПАРТНЕР 4", color: "text-purple-600" },
];

export default function PartnersSection() {
  return (
    <section className="py-12 bg-etk-light-gray">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">ПАРТНЕРЫ</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="h-4 w-4 text-etk-gray" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="h-4 w-4 text-etk-gray" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl flex items-center justify-center h-24 hover:shadow-md transition-shadow"
            >
              <span className={`font-bold ${partner.color}`}>
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
