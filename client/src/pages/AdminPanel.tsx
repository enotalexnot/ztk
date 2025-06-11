import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAdmin } from "@/hooks/useAdmin";
import { useLanguage } from "@/hooks/useLanguage";
import { Pencil, Trash2, Plus, LogOut, Package, FileText, MessageSquare, Settings } from "lucide-react";
import type { InsertProduct, InsertCategory, InsertNews, InsertStaticPage, Product, Category, News, StaticPage } from "@shared/schema";

function LoginForm() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login, isLoggingIn } = useAdmin();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      toast({ title: "Успешный вход", description: "Добро пожаловать в админ-панель" });
    } catch (error) {
      toast({ 
        title: "Ошибка входа", 
        description: "Неверные учетные данные",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Вход в админ-панель</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? "Вход..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      return await apiRequest("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Успех", description: "Товар создан" });
      setIsDialogOpen(false);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProduct> }) => {
      return await apiRequest(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Успех", description: "Товар обновлен" });
      setEditingProduct(null);
      setIsDialogOpen(false);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Успех", description: "Товар удален" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      categoryId: parseInt(formData.get("categoryId") as string),
      price: formData.get("price") as string,
      imageUrl: formData.get("imageUrl") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      specifications: formData.get("specifications") as string,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление товарами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Редактировать товар" : "Добавить товар"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name || ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoryId">Категория</Label>
                  <Select name="categoryId" defaultValue={editingProduct?.categoryId?.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category: Category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingProduct?.description || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Цена</Label>
                  <Input
                    id="price"
                    name="price"
                    defaultValue={editingProduct?.price || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Бренд</Label>
                  <Input
                    id="brand"
                    name="brand"
                    defaultValue={editingProduct?.brand || ""}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="model">Модель</Label>
                  <Input
                    id="model"
                    name="model"
                    defaultValue={editingProduct?.model || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">URL изображения</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue={editingProduct?.imageUrl || ""}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="specifications">Характеристики</Label>
                <Textarea
                  id="specifications"
                  name="specifications"
                  defaultValue={editingProduct?.specifications || ""}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingProduct ? "Обновить" : "Создать"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Бренд</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {categories.find((c: Category) => c.id === product.categoryId)?.name}
                  </TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(product);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoriesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      return await apiRequest("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Успех", description: "Категория создана" });
      setIsDialogOpen(false);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertCategory> }) => {
      return await apiRequest(`/api/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Успех", description: "Категория обновлена" });
      setEditingCategory(null);
      setIsDialogOpen(false);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Успех", description: "Категория удалена" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление категориями</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить категорию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Редактировать категорию" : "Добавить категорию"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingCategory?.description || ""}
                />
              </div>
              <div>
                <Label htmlFor="icon">Иконка</Label>
                <Input
                  id="icon"
                  name="icon"
                  defaultValue={editingCategory?.icon || ""}
                  placeholder="Название иконки Lucide"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingCategory ? "Обновить" : "Создать"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Иконка</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.icon}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(category);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function NewsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: news = [] } = useQuery({
    queryKey: ["/api/news"],
  });

  const createNewsMutation = useMutation({
    mutationFn: async (data: InsertNews) => {
      return await apiRequest("/api/admin/news", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Успех", description: "Новость создана" });
      setIsDialogOpen(false);
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertNews> }) => {
      return await apiRequest(`/api/admin/news/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Успех", description: "Новость обновлена" });
      setEditingNews(null);
      setIsDialogOpen(false);
    },
  });

  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/news/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      toast({ title: "Успех", description: "Новость удалена" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      excerpt: formData.get("excerpt") as string,
      imageUrl: formData.get("imageUrl") as string,
    };

    if (editingNews) {
      updateNewsMutation.mutate({ id: editingNews.id, data });
    } else {
      createNewsMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление новостями</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingNews(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить новость
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingNews ? "Редактировать новость" : "Добавить новость"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingNews?.title || ""}
                  required
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Краткое описание</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={editingNews?.excerpt || ""}
                />
              </div>
              <div>
                <Label htmlFor="content">Содержание</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={editingNews?.content || ""}
                  rows={6}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL изображения</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingNews?.imageUrl || ""}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingNews ? "Обновить" : "Создать"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead>Дата публикации</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news.map((item: News) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {new Date(item.publishedAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingNews(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNewsMutation.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StaticPagesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: pages = [] } = useQuery({
    queryKey: ["/api/static-pages"],
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: InsertStaticPage) => {
      return await apiRequest("/api/admin/static-pages", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/static-pages"] });
      toast({ title: "Успех", description: "Страница создана" });
      setIsDialogOpen(false);
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: Partial<InsertStaticPage> }) => {
      return await apiRequest(`/api/admin/static-pages/${slug}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/static-pages"] });
      toast({ title: "Успех", description: "Страница обновлена" });
      setEditingPage(null);
      setIsDialogOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      slug: formData.get("slug") as string,
      titleRu: formData.get("titleRu") as string,
      titleEn: formData.get("titleEn") as string,
      contentRu: formData.get("contentRu") as string,
      contentEn: formData.get("contentEn") as string,
    };

    if (editingPage) {
      updatePageMutation.mutate({ slug: editingPage.slug, data });
    } else {
      createPageMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление статическими страницами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPage(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить страницу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? "Редактировать страницу" : "Добавить страницу"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="slug">URL-адрес (slug)</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editingPage?.slug || ""}
                  placeholder="about-us"
                  required
                  disabled={!!editingPage}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titleRu">Заголовок (RU)</Label>
                  <Input
                    id="titleRu"
                    name="titleRu"
                    defaultValue={editingPage?.titleRu || ""}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">Заголовок (EN)</Label>
                  <Input
                    id="titleEn"
                    name="titleEn"
                    defaultValue={editingPage?.titleEn || ""}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contentRu">Содержание (RU)</Label>
                  <Textarea
                    id="contentRu"
                    name="contentRu"
                    defaultValue={editingPage?.contentRu || ""}
                    rows={8}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contentEn">Содержание (EN)</Label>
                  <Textarea
                    id="contentEn"
                    name="contentEn"
                    defaultValue={editingPage?.contentEn || ""}
                    rows={8}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingPage ? "Обновить" : "Создать"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Заголовок (RU)</TableHead>
                <TableHead>Заголовок (EN)</TableHead>
                <TableHead>Обновлено</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page: StaticPage) => (
                <TableRow key={page.id}>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>{page.titleRu}</TableCell>
                  <TableCell>{page.titleEn}</TableCell>
                  <TableCell>
                    {new Date(page.updatedAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingPage(page);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPanel() {
  const { admin, isAuthenticated, isLoading, logout } = useAdmin();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Выход выполнен", description: "До свидания!" });
    } catch (error) {
      toast({ 
        title: "Ошибка", 
        description: "Не удалось выйти",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Админ-панель ЭТК</h1>
            <div className="flex items-center space-x-4">
              <span>Добро пожаловать, {admin?.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Товары</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Категории</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Новости</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Страницы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManagement />
          </TabsContent>

          <TabsContent value="news">
            <NewsManagement />
          </TabsContent>

          <TabsContent value="pages">
            <StaticPagesManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}