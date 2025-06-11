import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import type { Product, Category } from "@shared/schema";

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || product.categoryId.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const ProductCard = ({ product }: { product: Product }) => {
    const category = categories.find(c => c.id === product.categoryId);
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : product.imageUrl;

    if (viewMode === "list") {
      return (
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Eye className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                    <Link href={`/product/${product.id}`}>
                      {product.name}
                    </Link>
                  </h3>
                  <div className="flex items-center space-x-2">
                    {product.featured && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Рекомендуем
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {category && <span>Категория: {category.name}</span>}
                  {product.brand && <span>Бренд: {product.brand}</span>}
                  {product.model && <span>Модель: {product.model}</span>}
                </div>
                
                {product.description && (
                  <p className="text-gray-600 line-clamp-2">{product.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  {product.price && (
                    <div className="text-lg font-bold text-blue-600">{product.price}</div>
                  )}
                  <Link href={`/product/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Подробнее
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="p-0">
          <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Eye className="w-12 h-12" />
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                <Link href={`/product/${product.id}`}>
                  {product.name}
                </Link>
              </h3>
              {product.featured && (
                <Badge className="bg-yellow-100 text-yellow-800 flex-shrink-0">
                  <Star className="w-3 h-3" />
                </Badge>
              )}
            </div>
            
            {category && (
              <p className="text-sm text-gray-600">{category.name}</p>
            )}
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {product.brand && <span>Бренд: {product.brand}</span>}
              {product.model && <span>Модель: {product.model}</span>}
            </div>
          </div>
          
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          )}
          
          <div className="flex items-center justify-between">
            {product.price && (
              <div className="font-bold text-blue-600">{product.price}</div>
            )}
            <Link href={`/product/${product.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Подробнее
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title="Каталог продукции | ЗАО Курс - Электротехническое оборудование"
        description="Полный каталог электротехнического оборудования ЗАО Курс. Широкий ассортимент качественной продукции с подробными характеристиками."
        keywords="каталог, электротехническое оборудование, продукция, ЗАО Курс"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Каталог продукции</h1>
          <p className="text-gray-600">Найдите нужное электротехническое оборудование из нашего ассортимента</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Поиск по названию, описанию или бренду..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Найдено товаров: <span className="font-semibold">{filteredProducts.length}</span>
          </p>
        </div>

        {/* Products */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
            <p className="text-gray-600 mb-4">
              Попробуйте изменить критерии поиска или выбрать другую категорию
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              variant="outline"
            >
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}