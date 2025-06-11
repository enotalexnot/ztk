import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Share2, Heart, ShoppingCart, Star, Download, FileText, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import SEOHead from "@/components/SEOHead";
import type { Product, Category } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['/api/products', id],
    enabled: !!id,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Товар не найден</h1>
          <p className="text-gray-600 mb-4">Запрашиваемый товар не существует или был удален</p>
          <Link href="/catalog">
            <Button>Вернуться в каталог</Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = categories?.find(c => c.id === product.categoryId);
  const images = product.images && product.images.length > 0 ? product.images.filter(Boolean) : [product.imageUrl].filter(Boolean);
  const specifications = product.specifications ? JSON.parse(product.specifications) : {};

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead 
        title={`${product.name} - ${category?.name || 'Товары'} | ЗАО Курс`}
        description={product.description || `${product.name} от ${product.brand || 'ЗАО Курс'}. Модель: ${product.model || 'N/A'}`}
        keywords={`${product.name}, ${product.brand}, ${category?.name}, электротехническое оборудование`}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-blue-600">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-blue-600">Каталог</Link>
          <span>/</span>
          {category && (
            <>
              <span className="hover:text-blue-600">{category.name}</span>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back button */}
        <Link href="/catalog">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к каталогу
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FileText className="w-16 h-16" />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-blue-600' : ''
                    }`}
                  >
                    <img
                      src={image || ''}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                {product.brand && (
                  <Badge variant="secondary">Бренд: {product.brand}</Badge>
                )}
                {product.model && (
                  <Badge variant="outline">Модель: {product.model}</Badge>
                )}
                {product.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Рекомендуем
                  </Badge>
                )}
              </div>

              {product.description && (
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              )}
            </div>

            {product.price && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Цена</div>
                <div className="text-2xl font-bold text-blue-600">{product.price}</div>
              </div>
            )}

            {/* Contact buttons */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Запросить коммерческое предложение
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Позвонить
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Написать
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="description" className="mb-8">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specifications">Характеристики</TabsTrigger>
            <TabsTrigger value="warranty">Гарантия</TabsTrigger>
            <TabsTrigger value="files">Файлы</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Подробное описание</h3>
              {product.detailedDescription ? (
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.detailedDescription || '' }}
                />
              ) : (
                <p className="text-gray-600">Подробное описание не предоставлено.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Технические характеристики</h3>
              {Object.keys(specifications).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-900">{value as string}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Технические характеристики не указаны.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="warranty" className="mt-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Гарантия и возврат</h3>
              {product.warranty ? (
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.warranty || '' }}
                />
              ) : (
                <p className="text-gray-600">Информация о гарантии не предоставлена.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Документы и файлы</h3>
              {product.files && product.files.length > 0 ? (
                <div className="space-y-3">
                  {product.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{file.split('/').pop() || `Файл ${index + 1}`}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Скачать
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Файлы не предоставлены.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related products section could go here */}
      </div>
    </div>
  );
}