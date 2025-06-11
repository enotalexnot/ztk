import { useQuery } from "@tanstack/react-query";
import { type Partner } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PartnersSection() {
  const { data: partners, isLoading } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-etk-light-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">ПАРТНЕРЫ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 h-24">
                <CardContent className="p-0 flex items-center justify-center h-full">
                  <Skeleton className="w-full h-8" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-etk-light-gray">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">ПАРТНЕРЫ</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              className="bg-white p-6 h-24 hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-0 flex items-center justify-center h-full">
                {partner.imageUrl ? (
                  <img
                    src={partner.imageUrl}
                    alt={partner.name}
                    title={partner.name}
                    className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all"
                  />
                ) : (
                  <span className="font-bold text-etk-red text-sm text-center">
                    {partner.name}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
