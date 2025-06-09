import { useQuery } from "@tanstack/react-query";
import { type Category } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Settings, Battery } from "lucide-react";

const iconMap = {
  "bolt": Zap,
  "tools": Settings,
  "battery-full": Battery,
};

export default function CategorySection() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-etk-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <CardContent className="text-center p-0">
                  <Skeleton className="w-20 h-20 mx-auto mb-4 rounded-lg" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-etk-light-gray">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories?.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Zap;
            
            return (
              <Card
                key={category.id}
                className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="w-20 h-20 mx-auto mb-4 bg-etk-red/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-10 h-10 text-etk-red" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-etk-gray text-sm">{category.description}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
