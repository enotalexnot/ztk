import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type Product, type Category } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Grid } from "lucide-react";

export default function Catalog() {
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/product/${product.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="font-bold text-lg mb-2">{product.name}</h3>
          <p className="text-etk-gray text-sm mb-3">{product.description}</p>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-etk-red border-etk-red">
              {product.price}
            </Badge>
            {product.featured && (
              <Badge className="bg-etk-red">Рекомендуем</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const ProductSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="w-full h-48 rounded-lg mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  );

  if (categoriesLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Каталог продукции</h1>
        <p className="text-xl text-etk-gray">
          Промышленное оборудование высокого качества
        </p>
      </div>

      {/* Categories Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Категории продукции</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Grid className="h-8 w-8 text-etk-red" />
                  <Badge variant="outline">
                    {products?.filter(p => p.categoryId === category.id).length} товаров
                  </Badge>
                </div>
                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-etk-gray text-sm mb-4">{category.description}</p>
                <Link href={`/catalog/category/${category.id}`}>
                  <Button className="w-full bg-etk-red hover:bg-etk-red/90 group-hover:bg-etk-red/80 transition-colors">
                    Просмотреть товары
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all">Все товары</TabsTrigger>
          {categories?.slice(0, 3).map((category) => (
            <TabsTrigger key={category.id} value={category.id.toString()}>
              {category.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        {categories?.slice(0, 3).map((category) => (
          <TabsContent key={category.id} value={category.id.toString()}>
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
                <p className="text-etk-gray">{category.description}</p>
              </div>
              <Link href={`/catalog/category/${category.id}`}>
                <Button variant="outline">
                  Все товары категории
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products
                ?.filter((product) => product.categoryId === category.id)
                .slice(0, 6)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {products?.filter((product) => product.categoryId === category.id).length > 6 && (
              <div className="text-center mt-8">
                <Link href={`/catalog/category/${category.id}`}>
                  <Button variant="outline" size="lg">
                    Показать все товары ({products?.filter((product) => product.categoryId === category.id).length})
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
