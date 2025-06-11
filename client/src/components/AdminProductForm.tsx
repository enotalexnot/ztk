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
import { Checkbox } from '@/components/ui/checkbox'
import { RichTextEditor } from '@/components/ui/rich-text-editor'
import { FileUpload } from '@/components/ui/file-upload'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Upload, FileText, Image, Save, ArrowLeft } from 'lucide-react'
import { insertProductSchema, type InsertProduct, type Product, type Category } from '@shared/schema'
import { apiRequest } from '@/lib/queryClient'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'

const productFormSchema = insertProductSchema.extend({
  specifications: z.string().optional(),
  images: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  detailedDescription: z.string().optional(),
  warranty: z.string().optional(),
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
      categoryId: product?.categoryId || 0,
      subcategoryId: product?.subcategoryId || undefined,
      price: product?.price || '',
      imageUrl: product?.imageUrl || '',
      featured: product?.featured || false,
      model: product?.model || '',
      brand: product?.brand || '',
      specifications: product?.specifications || '',
      images: product?.images || [],
      files: product?.files || [],
      detailedDescription: product?.detailedDescription || '',
      warranty: product?.warranty || '',
    },
  })

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create product')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] })
      toast({ title: 'Успех', description: 'Товар успешно создан' })
      onSuccess?.()
    },
    onError: () => {
      toast({ title: 'Ошибка', description: 'Не удалось создать товар', variant: 'destructive' })
    },
  })

  const updateProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await fetch(`/api/products/${product?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update product')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] })
      toast({ title: 'Успех', description: 'Товар успешно обновлен' })
      onSuccess?.()
    },
    onError: () => {
      toast({ title: 'Ошибка', description: 'Не удалось обновить товар', variant: 'destructive' })
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
      const { [key]: _, ...rest } = prev
      return rest
    })
  }

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleFilesChange = (newFiles: string[]) => {
    setFiles(newFiles)
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
      updateProductMutation.mutate(productData)
    } else {
      createProductMutation.mutate(productData)
    }
  }

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-2xl font-bold">
          {product ? 'Редактировать товар' : 'Добавить товар'}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="media">Медиа</TabsTrigger>
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specs">Характеристики</TabsTrigger>
            <TabsTrigger value="warranty">Гарантия</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Label htmlFor="model">Модель</Label>
                    <Input
                      id="model"
                      {...form.register('model')}
                      placeholder="Введите модель"
                    />
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
                    <Label htmlFor="price">Цена</Label>
                    <Input
                      id="price"
                      {...form.register('price')}
                      placeholder="Введите цену или 'По запросу'"
                    />
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
                    <Label htmlFor="imageUrl">Основное изображение (URL)</Label>
                    <Input
                      id="imageUrl"
                      {...form.register('imageUrl')}
                      placeholder="https://example.com/image.jpg"
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
                  <Checkbox
                    id="featured"
                    checked={Boolean(form.watch('featured'))}
                    onCheckedChange={(checked) => form.setValue('featured', !!checked)}
                  />
                  <Label htmlFor="featured">Рекомендуемый товар</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Дополнительные изображения (до 10)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  files={images}
                  onChange={handleImagesChange}
                  acceptedTypes={['image/*']}
                  maxFiles={10}
                  type="images"
                  productName={form.watch('name') || 'default'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Файлы для скачивания (до 10)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload
                  files={files}
                  onChange={handleFilesChange}
                  acceptedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'text/plain']}
                  maxFiles={10}
                  type="files"
                  productName={form.watch('name') || 'default'}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Подробное описание с форматированием</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  content={detailedDescription}
                  onChange={setDetailedDescription}
                  placeholder="Введите подробное описание товара с возможностью форматирования..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Технические характеристики</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    placeholder="Название характеристики"
                  />
                  <Input
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    placeholder="Значение"
                  />
                  <Button type="button" onClick={addSpecification} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>
                <div className="space-y-2">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSpecification(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="warranty" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Гарантия и условия возврата</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor
                  content={warranty}
                  onChange={setWarranty}
                  placeholder="Введите информацию о гарантии и условиях возврата..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Сохранение...' : product ? 'Обновить товар' : 'Создать товар'}
          </Button>
        </div>
      </form>
    </div>
  )
}