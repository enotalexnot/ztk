import { useParams } from 'wouter'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Heart, Share2, Download, FileText, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Product } from '@shared/schema'
import { useLanguage, useTranslation } from '@/hooks/useLanguage'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { language } = useLanguage()
  const { t } = useTranslation()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Товар не найден
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Запрашиваемый товар не существует или был удален
          </p>
        </div>
      </div>
    )
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.imageUrl 
      ? [product.imageUrl] 
      : ['/placeholder-product.jpg']

  const files = product.files || []

  const specifications = product.specifications 
    ? JSON.parse(product.specifications)
    : {}

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm text-gray-600 dark:text-gray-400">
        <span>Главная</span>
        <span className="mx-2">/</span>
        <span>Каталог</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-product.jpg'
              }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index 
                      ? 'border-blue-500' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.jpg'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            {product.brand && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Бренд: {product.brand}
              </p>
            )}
            {product.model && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Модель: {product.model}
              </p>
            )}
          </div>

          {product.price && (
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {product.price}
            </div>
          )}

          {product.description && (
            <div className="prose prose-sm dark:prose-invert">
              <p>{product.description}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="flex-1 min-w-[200px]">
              <ShoppingCart className="mr-2 h-5 w-5" />
              В корзину
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Specs */}
          {Object.keys(specifications).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Основные характеристики</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(specifications).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Описание</TabsTrigger>
          <TabsTrigger value="specifications">Характеристики</TabsTrigger>
          <TabsTrigger value="files">Файлы</TabsTrigger>
          <TabsTrigger value="warranty">Гарантии и возврат</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {product.detailedDescription ? (
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
                />
              ) : (
                <div className="prose prose-sm dark:prose-invert">
                  <p>{product.description || "Подробное описание не указано"}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {Object.keys(specifications).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <span className="font-medium text-gray-900 dark:text-white">{key}</span>
                      <span className="text-gray-600 dark:text-gray-400">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Технические характеристики не указаны</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {files.length > 0 ? (
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium">{file}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Скачать
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Файлы не прикреплены</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {product.warranty ? (
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.warranty }}
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Информация о гарантии не указана</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact Section */}
      <Card className="mt-12">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Не нашли что искали?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Наши сотрудники всегда Вам помогут!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button>
                Запросить коммерческое предложение
              </Button>
              <Button variant="outline">
                Связаться с нами
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}