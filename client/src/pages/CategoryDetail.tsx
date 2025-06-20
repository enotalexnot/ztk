import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { type Product, type Category, type Subcategory } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid, List } from "lucide-react";

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${categoryId}`],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: [`/api/products/category/${categoryId}`],
  });

  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery<Subcategory[]>({
    queryKey: [`/api/subcategories/category/${categoryId}`],
  });

  // Filter products based on search and subcategory
  const filteredProducts = products?.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubcategory = selectedSubcategory === "all" || 
      product.subcategoryId?.toString() === selectedSubcategory;
    
    return matchesSearch && matchesSubcategory;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-etk-gray text-sm mb-3">{product.description}</p>
        
        {product.brand && (
          <Badge variant="outline" className="mb-2">
            {product.brand}
          </Badge>
        )}
        
        {product.model && (
          <p className="text-xs text-etk-gray mb-2">Модель: {product.model}</p>
        )}
        
        {product.specifications && (
          <p className="text-xs text-etk-gray mb-3">{product.specifications}</p>
        )}
        
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-etk-red border-etk-red">
            {product.price}
          </Badge>
          {product.featured && (
            <Badge className="bg-etk-red">Рекомендуем</Badge>
          )}
        </div>
        
        <Button className="w-full mt-4 bg-etk-red hover:bg-etk-red text-white">
          Заказать
        </Button>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
            alt={product.name}
            className="w-full h-32 object-cover rounded-lg"
          />
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <p className="text-etk-gray text-sm mb-3">{product.description}</p>
            
            {product.specifications && (
              <p className="text-xs text-etk-gray mb-2">{product.specifications}</p>
            )}
            
            <div className="flex gap-2 mb-2">
              {product.brand && (
                <Badge variant="outline">{product.brand}</Badge>
              )}
              {product.model && (
                <Badge variant="outline">Модель: {product.model}</Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <Badge variant="outline" className="text-etk-red border-etk-red mb-2">
                {product.price}
              </Badge>
              {product.featured && (
                <Badge className="bg-etk-red block w-fit">Рекомендуем</Badge>
              )}
            </div>
            <Button className="bg-etk-red hover:bg-etk-red text-white">
              Заказать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
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

  if (categoryLoading || productsLoading || subcategoriesLoading) {
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
        <h1 className="text-4xl font-bold mb-4">{category?.name}</h1>
        <p className="text-xl text-etk-gray">
          {category?.description}
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="lg:w-1/4">
          <Card className="p-6 mb-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Фильтры
            </h3>
            
            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Поиск</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Subcategory filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Подкатегория</label>
              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Все подкатегории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все подкатегории</SelectItem>
                  {subcategories?.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategories list */}
            <div>
              <h4 className="font-medium mb-3">Подкатегории</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedSubcategory("all")}
                    className={`text-sm hover:text-etk-red transition-colors w-full text-left ${
                      selectedSubcategory === "all" ? "text-etk-red font-medium" : ""
                    }`}
                  >
                    Все товары
                  </button>
                </li>
                {subcategories?.map((sub) => (
                  <li key={sub.id}>
                    <button
                      onClick={() => setSelectedSubcategory(sub.id.toString())}
                      className={`text-sm hover:text-etk-red transition-colors w-full text-left ${
                        selectedSubcategory === sub.id.toString() ? "text-etk-red font-medium" : ""
                      }`}
                    >
                      {sub.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:w-3/4">
          {/* View controls */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-etk-gray">
              Найдено товаров: {filteredProducts.length}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Products */}
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-etk-gray text-lg">Товары не найдены</p>
              <p className="text-etk-gray text-sm">Попробуйте изменить фильтры или поисковый запрос</p>
            </div>
          ) : (
            <>
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
              }>
                {paginatedProducts.map((product) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <ProductListItem key={product.id} product={product} />
                  )
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Предыдущая
                  </Button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Следующая
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}