import { useQuery } from "@tanstack/react-query";
import { type News, type Article } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export default function NewsSection() {
  const { data: news, isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const NewsCard = ({ item, isLoading }: { item?: News; isLoading: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-40 rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
          </>
        ) : item ? (
          <>
            <img
              src={item.imageUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
              alt={item.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-etk-gray text-sm mb-3">{item.excerpt}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-etk-gray">
                {formatDate(item.publishedAt || new Date())}
              </span>
              <ArrowRight className="h-4 w-4 text-etk-red" />
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );

  const ArticleCard = ({ item, isLoading }: { item?: Article; isLoading: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-40 rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-4" />
            </div>
          </>
        ) : item ? (
          <>
            <img
              src={item.imageUrl || "https://images.unsplash.com/photo-1609770231080-e321deccc34c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
              alt={item.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-etk-gray text-sm mb-3">{item.excerpt}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-etk-gray">
                {formatDate(item.publishedAt || new Date())}
              </span>
              <ArrowRight className="h-4 w-4 text-etk-red" />
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 bg-etk-light-gray">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* News */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">НОВОСТИ</h2>
              <a href="#" className="text-etk-red hover:text-red-700 transition-colors">
                Все новости
              </a>
            </div>
            
            <div className="space-y-6">
              {newsLoading
                ? [1, 2].map((i) => (
                    <NewsCard key={i} isLoading={true} />
                  ))
                : news?.slice(0, 2).map((item) => (
                    <NewsCard key={item.id} item={item} isLoading={false} />
                  ))}
            </div>
          </div>

          {/* Articles */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">СТАТЬИ</h2>
              <a href="#" className="text-etk-red hover:text-red-700 transition-colors">
                Все статьи
              </a>
            </div>
            
            <div className="space-y-6">
              {articlesLoading
                ? [1, 2].map((i) => (
                    <ArticleCard key={i} isLoading={true} />
                  ))
                : articles?.slice(0, 2).map((item) => (
                    <ArticleCard key={item.id} item={item} isLoading={false} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
