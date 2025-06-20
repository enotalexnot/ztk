import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Pencil, Trash2, Package, FileText, MessageSquare, Settings, FolderOpen, Newspaper } from "lucide-react";
import AdminProductForm from "@/components/AdminProductForm";
import AdminContentManagement from "@/components/AdminContentManagement";
import type { InsertProduct, InsertCategory, InsertNews, InsertArticle, InsertStaticPage, Product, Category, News, Article, StaticPage, Inquiry } from "@shared/schema";

function LoginForm({ onLogin }: { onLogin: (admin: any) => void }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        onLogin(data.admin);
        toast({ title: "Успешный вход", description: "Добро пожаловать в админ-панель" });
      } else {
        toast({ 
          title: "Ошибка входа", 
          description: "Неверные учетные данные",
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Ошибка", 
        description: "Не удалось войти в систему",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Management components
function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products", { credentials: "include" }),
        fetch("/api/categories", { credentials: "include" })
      ]);
      
      if (productsRes.ok && categoriesRes.ok) {
        setProducts(await productsRes.json());
        setCategories(await categoriesRes.json());
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось загрузить данные", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadData();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast({ title: "Успех", description: "Товар удален" });
        loadData();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось удалить товар", variant: "destructive" });
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  if (showForm) {
    return (
      <AdminProductForm 
        product={editingProduct ?? undefined}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление товарами</h2>
        <Button onClick={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
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
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{categories.find(c => c.id === product.categoryId)?.name}</TableCell>
                  <TableCell>{product.price || "—"}</TableCell>
                  <TableCell>{product.brand || "—"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(product);
                          setShowForm(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<InsertCategory>>({
    name: "",
    description: "",
    icon: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/categories", { credentials: "include" });
      if (response.ok) {
        setCategories(await response.json());
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось загрузить категории", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({ title: "Успех", description: editingCategory ? "Категория обновлена" : "Категория создана" });
        setIsDialogOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", icon: "" });
        loadCategories();
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось сохранить категорию", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast({ title: "Успех", description: "Категория удалена" });
        loadCategories();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось удалить категорию", variant: "destructive" });
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление категориями</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", description: "", icon: "" });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить категорию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Редактировать категорию" : "Добавить категорию"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="icon">Иконка</Label>
                <Input
                  id="icon"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="Название иконки (например: Zap)"
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
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || "—"}</TableCell>
                  <TableCell>{category.icon || "—"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(category);
                          setFormData(category);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(category.id)}
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
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState<Partial<InsertNews>>({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const response = await fetch("/api/news", { credentials: "include" });
      if (response.ok) {
        setNews(await response.json());
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось загрузить новости", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingNews ? `/api/admin/news/${editingNews.id}` : "/api/admin/news";
      const method = editingNews ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({ title: "Успех", description: editingNews ? "Новость обновлена" : "Новость создана" });
        setIsDialogOpen(false);
        setEditingNews(null);
        setFormData({ title: "", content: "", excerpt: "", imageUrl: "" });
        loadNews();
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось сохранить новость", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast({ title: "Успех", description: "Новость удалена" });
        loadNews();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось удалить новость", variant: "destructive" });
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление новостями</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingNews(null);
              setFormData({ title: "", content: "", excerpt: "", imageUrl: "" });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить новость
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNews ? "Редактировать новость" : "Добавить новость"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Краткое описание</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="content">Содержание</Label>
                <Textarea
                  id="content"
                  value={formData.content || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL изображения</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
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
              {news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {item.publishedAt && typeof item.publishedAt === 'string' ? new Date(item.publishedAt).toLocaleDateString('ru-RU') : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingNews(item);
                          setFormData(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
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

function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<Partial<InsertArticle>>({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch("/api/articles", { credentials: "include" });
      if (response.ok) {
        setArticles(await response.json());
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось загрузить статьи", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingArticle ? `/api/admin/articles/${editingArticle.id}` : "/api/admin/articles";
      const method = editingArticle ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({ title: "Успех", description: editingArticle ? "Статья обновлена" : "Статья создана" });
        setIsDialogOpen(false);
        setEditingArticle(null);
        setFormData({ title: "", content: "", excerpt: "", imageUrl: "" });
        loadArticles();
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось сохранить статью", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast({ title: "Успех", description: "Статья удалена" });
        loadArticles();
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось удалить статью", variant: "destructive" });
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление статьями</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingArticle(null);
              setFormData({ title: "", content: "", excerpt: "", imageUrl: "" });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить статью
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingArticle ? "Редактировать статью" : "Добавить статью"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Краткое описание</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="content">Содержание</Label>
                <Textarea
                  id="content"
                  value={formData.content || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  required
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">URL изображения</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingArticle ? "Обновить" : "Создать"}
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
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>
                    {article.publishedAt && typeof article.publishedAt === 'string' ? new Date(article.publishedAt).toLocaleDateString('ru-RU') : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingArticle(article);
                          setFormData(article);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(article.id)}
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

function InquiriesManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const response = await fetch("/api/admin/inquiries", { credentials: "include" });
      if (response.ok) {
        setInquiries(await response.json());
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось загрузить обращения", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Обращения клиентов</h2>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Компания</TableHead>
                <TableHead>Сообщение</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>{inquiry.name}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell>{inquiry.phone || "—"}</TableCell>
                  <TableCell>{inquiry.company || "—"}</TableCell>
                  <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                  <TableCell>
                    {inquiry.createdAt && typeof inquiry.createdAt === 'string' ? new Date(inquiry.createdAt).toLocaleDateString('ru-RU') : '—'}
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
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [formData, setFormData] = useState<Partial<InsertStaticPage>>({
    slug: "",
    titleRu: "",
    titleEn: "",
    contentRu: "",
    contentEn: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const response = await fetch("/api/static-pages", { credentials: "include" });
      if (response.ok) {
        setPages(await response.json());
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось загрузить страницы", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPage ? `/api/admin/static-pages/${editingPage.slug}` : "/api/admin/static-pages";
      const method = editingPage ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({ title: "Успех", description: editingPage ? "Страница обновлена" : "Страница создана" });
        setIsDialogOpen(false);
        setEditingPage(null);
        setFormData({ slug: "", titleRu: "", titleEn: "", contentRu: "", contentEn: "" });
        loadPages();
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      toast({ title: "Ошибка", description: "Не удалось сохранить страницу", variant: "destructive" });
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление статическими страницами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingPage(null);
              setFormData({ slug: "", titleRu: "", titleEn: "", contentRu: "", contentEn: "" });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить страницу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{editingPage ? "Редактировать страницу" : "Добавить страницу"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  disabled={!!editingPage}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="titleRu">Заголовок (русский)</Label>
                  <Input
                    id="titleRu"
                    value={formData.titleRu || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleRu: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">Заголовок (английский)</Label>
                  <Input
                    id="titleEn"
                    value={formData.titleEn || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contentRu">Содержание (русский)</Label>
                  <Textarea
                    id="contentRu"
                    value={formData.contentRu || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, contentRu: e.target.value }))}
                    rows={8}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contentEn">Содержание (английский)</Label>
                  <Textarea
                    id="contentEn"
                    value={formData.contentEn || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
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
                <TableHead>Slug</TableHead>
                <TableHead>Заголовок (РУ)</TableHead>
                <TableHead>Заголовок (EN)</TableHead>
                <TableHead>Обновлено</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>{page.titleRu}</TableCell>
                  <TableCell>{page.titleEn}</TableCell>
                  <TableCell>
                    {page.updatedAt && typeof page.updatedAt === 'string' ? new Date(page.updatedAt).toLocaleDateString('ru-RU') : '—'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingPage(page);
                        setFormData(page);
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

function AdminDashboard({ admin, onLogout }: { admin: any; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("content");
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        onLogout();
        toast({ title: "Выход выполнен", description: "До свидания!" });
      } else {
        throw new Error("Logout failed");
      }
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

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="content">
              <Settings className="mr-2 h-4 w-4" />
              Контент
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="mr-2 h-4 w-4" />
              Товары
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FolderOpen className="mr-2 h-4 w-4" />
              Категории
            </TabsTrigger>
            <TabsTrigger value="news">
              <Newspaper className="mr-2 h-4 w-4" />
              Новости
            </TabsTrigger>
            <TabsTrigger value="articles">
              <FileText className="mr-2 h-4 w-4" />
              Статьи
            </TabsTrigger>
            <TabsTrigger value="inquiries">
              <MessageSquare className="mr-2 h-4 w-4" />
              Обращения
            </TabsTrigger>
            <TabsTrigger value="pages">
              <Settings className="mr-2 h-4 w-4" />
              Страницы
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="content">
              <AdminContentManagement />
            </TabsContent>

            <TabsContent value="products">
              <ProductsManagement />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesManagement />
            </TabsContent>

            <TabsContent value="news">
              <NewsManagement />
            </TabsContent>

            <TabsContent value="articles">
              <ArticlesManagement />
            </TabsContent>

            <TabsContent value="inquiries">
              <InquiriesManagement />
            </TabsContent>

            <TabsContent value="pages">
              <StaticPagesManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/me", {
          credentials: "include",
        });
        
        if (response.ok) {
          const adminData = await response.json();
          setAdmin(adminData);
        }
      } catch (error) {
        console.log("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (!admin) {
    return <LoginForm onLogin={setAdmin} />;
  }

  return <AdminDashboard admin={admin} onLogout={() => setAdmin(null)} />;
}