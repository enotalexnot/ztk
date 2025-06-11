import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Upload, FileText } from 'lucide-react'
import { insertProductSchema, type InsertProduct, type Product, type Category } from '@shared/schema'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'

const productFormSchema = insertProductSchema.extend({
  specifications: z.string().optional(),
  images: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
})

type ProductFormData = z.infer<typeof productFormSchema>

interface AdminProductFormProps {
  product?: Product
  onSuccess?: () => void
  onCancel?: () => void
}

export default function AdminProductForm({ product, onSuccess, onCancel }: AdminProductFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    product?.specifications ? JSON.parse(product.specifications) : {}
  )
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [files, setFiles] = useState<string[]>(product?.files || [])
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newFileName, setNewFileName] = useState('')
  const [detailedDescription, setDetailedDescription] = useState(product?.detailedDescription || '')
  const [warranty, setWarranty] = useState(product?.warranty || '')

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  })

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      categoryId: product?.categoryId || undefined,
      subcategoryId: product?.subcategoryId || undefined,
      price: product?.price || '',
      imageUrl: product?.imageUrl || '',
      brand: product?.brand || '',
      model: product?.model || '',
      featured: product?.featured || false,
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return await apiRequest('POST', '/api/admin/products', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] })
      toast({ title: 'Продукт создан успешно' })
      onSuccess?.()
    },
    onError: () => {
      toast({ title: 'Ошибка при создании продукта', variant: 'destructive' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return await apiRequest('PUT', `/api/admin/products/${product?.id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] })
      queryClient.invalidateQueries({ queryKey: [`/api/products/${product?.id}`] })
      toast({ title: 'Продукт обновлен успешно' })
      onSuccess?.()
    },
    onError: () => {
      toast({ title: 'Ошибка при обновлении продукта', variant: 'destructive' })
    },
  })

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      setSpecifications(prev => ({ ...prev, [newSpecKey]: newSpecValue }))
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpecification = (key: string) => {
    setSpecifications(prev => {
      const newSpecs = { ...prev }
      delete newSpecs[key]
      return newSpecs
    })
  }

  const addImage = () => {
    if (newImageUrl && !images.includes(newImageUrl)) {
      setImages(prev => [...prev, newImageUrl])
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addFile = () => {
    if (newFileName && !files.includes(newFileName)) {
      setFiles(prev => [...prev, newFileName])
      setNewFileName('')
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (data: ProductFormData) => {
    const productData: InsertProduct = {
      ...data,
      specifications: Object.keys(specifications).length > 0 ? JSON.stringify(specifications) : null,
      images: images.length > 0 ? images : null,
      files: files.length > 0 ? files : null,
      detailedDescription: detailedDescription || null,
      warranty: warranty || null,
    }

    if (product) {
      updateMutation.mutate(productData)
    } else {
      createMutation.mutate(productData)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Редактировать продукт' : 'Создать новый продукт'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Основная информация</TabsTrigger>
              <TabsTrigger value="specs">Характеристики</TabsTrigger>
              <TabsTrigger value="media">Изображения</TabsTrigger>
              <TabsTrigger value="files">Файлы</TabsTrigger>
              <TabsTrigger value="content">Контент</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название товара *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Введите название товара"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Категория *</Label>
                  <Select
                    value={form.watch('categoryId')?.toString()}
                    onValueChange={(value) => form.setValue('categoryId', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-sm text-red-500">{form.formState.errors.categoryId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Бренд</Label>
                  <Input
                    id="brand"
                    {...form.register('brand')}
                    placeholder="Введите бренд"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Модель</Label>
                  <Input
                    id="model"
                    {...form.register('model')}
                    placeholder="Введите модель"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Цена</Label>
                  <Input
                    id="price"
                    {...form.register('price')}
                    placeholder="Введите цену"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Основное изображение</Label>
                  <Input
                    id="imageUrl"
                    {...form.register('imageUrl')}
                    placeholder="URL изображения"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Краткое описание</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Введите краткое описание товара"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  {...form.register('featured')}
                  className="w-4 h-4"
                />
                <Label htmlFor="featured">Рекомендуемый товар</Label>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Технические характеристики</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Название характеристики"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                  />
                  <Input
                    placeholder="Значение"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                  />
                  <Button type="button" onClick={addSpecification}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>

                <div className="space-y-2">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{key}:</span>
                        <span className="ml-2 text-gray-600">{value}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Дополнительные изображения</h3>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="URL изображения"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addImage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.jpg'
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Прикрепленные файлы</h3>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Название файла или URL"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addFile}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium">{file}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Подробное описание</Label>
                  <RichTextEditor
                    content={detailedDescription}
                    onChange={setDetailedDescription}
                    placeholder="Введите подробное описание товара..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Гарантии и возврат</Label>
                  <RichTextEditor
                    content={warranty}
                    onChange={setWarranty}
                    placeholder="Введите информацию о гарантиях и возврате..."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Сохранение...'
                : product
                ? 'Обновить продукт'
                : 'Создать продукт'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}