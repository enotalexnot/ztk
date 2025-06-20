import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Save, Settings, Menu, Image, Sliders, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SiteSettings {
  id: number;
  key: string;
  value: string;
  type: string;
  description: string;
}

interface MenuItem {
  id: number;
  title: string;
  url: string;
  order: number;
  parentId?: number;
  isActive: boolean;
}

interface SliderItem {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  order: number;
  isActive: boolean;
}

interface HomepageContent {
  id: number;
  sectionKey: string;
  title: string;
  content?: string;
  imageUrl?: string;
}

export default function AdminContentManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Site Settings
  const { data: siteSettings, isLoading: settingsLoading } = useQuery<SiteSettings[]>({
    queryKey: ["/api/site-settings"],
  });

  // Menu Items
  const { data: menuItems, isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Slider Items  
  const { data: sliderItems, isLoading: sliderLoading } = useQuery<SliderItem[]>({
    queryKey: ["/api/slider-items"],
  });

  // Homepage Content
  const { data: homepageContent, isLoading: contentLoading } = useQuery<HomepageContent[]>({
    queryKey: ["/api/homepage-content"],
  });

  // Mutations for site settings
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch(`/api/admin/site-settings/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ value }),
      });
      if (!response.ok) throw new Error('Failed to update setting');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({ title: "Настройки обновлены", description: "Изменения сохранены успешно" });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось сохранить настройки", variant: "destructive" });
    },
  });

  // Mutations for menu items
  const createMenuMutation = useMutation({
    mutationFn: async (data: Partial<MenuItem>) => {
      const response = await fetch("/api/admin/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create menu item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Пункт меню создан", description: "Новый пункт меню добавлен" });
      setNewMenuItem({ title: "", url: "", order: 0, isActive: true });
    },
  });

  const updateMenuMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<MenuItem> & { id: number }) => {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update menu item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Пункт меню обновлен", description: "Изменения сохранены" });
    },
  });

  const deleteMenuMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error('Failed to delete menu item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({ title: "Пункт меню удален", description: "Элемент удален из меню" });
    },
  });

  // Mutations for slider items
  const createSliderMutation = useMutation({
    mutationFn: async (data: Partial<SliderItem>) => {
      const response = await fetch("/api/admin/slider-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create slider item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider-items"] });
      toast({ title: "Слайд создан", description: "Новый слайд добавлен" });
      setNewSliderItem({ title: "", order: 0, isActive: true });
    },
  });

  const updateSliderMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<SliderItem> & { id: number }) => {
      const response = await fetch(`/api/admin/slider-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update slider item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider-items"] });
      toast({ title: "Слайд обновлен", description: "Изменения сохранены" });
    },
  });

  const deleteSliderMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/slider-items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error('Failed to delete slider item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/slider-items"] });
      toast({ title: "Слайд удален", description: "Слайд удален из карусели" });
    },
  });

  // Mutations for homepage content
  const updateHomepageContentMutation = useMutation({
    mutationFn: async ({ sectionKey, data }: { sectionKey: string; data: Partial<HomepageContent> }) => {
      const response = await fetch(`/api/admin/homepage-content/${sectionKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update homepage content');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homepage-content"] });
      toast({ title: "Контент обновлен", description: "Изменения сохранены успешно" });
    },
    onError: () => {
      toast({ title: "Ошибка", description: "Не удалось сохранить контент", variant: "destructive" });
    },
  });

  // State for forms
  const [editingSettings, setEditingSettings] = useState<Record<string, string>>({});
  const [editingContent, setEditingContent] = useState<Record<string, Partial<HomepageContent>>>({});
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({ title: "", url: "", order: 0, isActive: true });
  const [editingMenu, setEditingMenu] = useState<number | null>(null);
  const [newSliderItem, setNewSliderItem] = useState<Partial<SliderItem>>({ title: "", order: 0, isActive: true });
  const [editingSlider, setEditingSlider] = useState<number | null>(null);

  const handleUpdateSetting = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value });
  };

  if (settingsLoading || menuLoading || sliderLoading || contentLoading) {
    return <div className="p-6">Загрузка...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Управление контентом сайта</h1>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Настройки
          </TabsTrigger>
          <TabsTrigger value="homepage" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Главная
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Menu className="h-4 w-4" />
            Меню
          </TabsTrigger>
          <TabsTrigger value="slider" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Слайдер
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Логотип
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки сайта</CardTitle>
              <CardDescription>
                Управляйте основными настройками сайта, контактной информацией и социальными сетями
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {siteSettings?.map((setting: SiteSettings) => (
                <div key={setting.key} className="grid grid-cols-3 gap-4 items-center">
                  <Label className="font-medium">{setting.description}</Label>
                  <div className="col-span-2 flex gap-2">
                    {setting.type === 'text' ? (
                      <Input
                        value={editingSettings[setting.key] ?? setting.value ?? ''}
                        onChange={(e) => setEditingSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
                        placeholder={setting.description}
                      />
                    ) : (
                      <Input
                        type="url"
                        value={editingSettings[setting.key] ?? setting.value ?? ''}
                        onChange={(e) => setEditingSettings(prev => ({ ...prev, [setting.key]: e.target.value }))}
                        placeholder={setting.description}
                      />
                    )}
                    <Button
                      size="sm"
                      onClick={() => {
                        const value = editingSettings[setting.key] ?? setting.value ?? '';
                        handleUpdateSetting(setting.key, value);
                        setEditingSettings(prev => {
                          const newState = { ...prev };
                          delete newState[setting.key];
                          return newState;
                        });
                      }}
                      disabled={updateSettingMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homepage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление контентом главной страницы</CardTitle>
              <CardDescription>
                Редактируйте заголовки, описания и контент секций главной страницы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {homepageContent?.map((content: HomepageContent) => (
                <div key={content.sectionKey} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="font-medium text-sm text-muted-foreground">
                        Раздел: {content.sectionKey}
                      </Label>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label>Заголовок</Label>
                        <Input
                          value={editingContent[content.sectionKey]?.title ?? content.title}
                          onChange={(e) => setEditingContent(prev => ({
                            ...prev,
                            [content.sectionKey]: {
                              ...prev[content.sectionKey],
                              title: e.target.value
                            }
                          }))}
                          placeholder="Заголовок раздела"
                        />
                      </div>
                      <div>
                        <Label>Описание/Контент</Label>
                        <Textarea
                          value={editingContent[content.sectionKey]?.content ?? content.content ?? ''}
                          onChange={(e) => setEditingContent(prev => ({
                            ...prev,
                            [content.sectionKey]: {
                              ...prev[content.sectionKey],
                              content: e.target.value
                            }
                          }))}
                          placeholder="Содержимое раздела"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>URL изображения (опционально)</Label>
                        <Input
                          value={editingContent[content.sectionKey]?.imageUrl ?? content.imageUrl ?? ''}
                          onChange={(e) => setEditingContent(prev => ({
                            ...prev,
                            [content.sectionKey]: {
                              ...prev[content.sectionKey],
                              imageUrl: e.target.value
                            }
                          }))}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          const data = editingContent[content.sectionKey] || {};
                          updateHomepageContentMutation.mutate({
                            sectionKey: content.sectionKey,
                            data: {
                              title: data.title ?? content.title,
                              content: data.content ?? content.content,
                              imageUrl: data.imageUrl ?? content.imageUrl
                            }
                          });
                          setEditingContent(prev => {
                            const newState = { ...prev };
                            delete newState[content.sectionKey];
                            return newState;
                          });
                        }}
                        disabled={updateHomepageContentMutation.isPending}
                        className="w-fit"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить изменения
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление меню</CardTitle>
              <CardDescription>
                Добавляйте, редактируйте и удаляйте пункты главного меню сайта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Menu Item Form */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить новый пункт меню
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Название"
                    value={newMenuItem.title || ''}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="URL (например, /about)"
                    value={newMenuItem.url || ''}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, url: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Порядок"
                    value={newMenuItem.order || 0}
                    onChange={(e) => setNewMenuItem(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                  <Button
                    onClick={() => createMenuMutation.mutate(newMenuItem)}
                    disabled={!newMenuItem.title || !newMenuItem.url || createMenuMutation.isPending}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </div>

              {/* Menu Items List */}
              <div className="space-y-2">
                {menuItems?.map((item: MenuItem) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    {editingMenu === item.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <Input
                          value={item.title}
                          onChange={(e) => updateMenuMutation.mutate({ id: item.id, title: e.target.value })}
                        />
                        <Input
                          value={item.url}
                          onChange={(e) => updateMenuMutation.mutate({ id: item.id, url: e.target.value })}
                        />
                        <Input
                          type="number"
                          value={item.order}
                          onChange={(e) => updateMenuMutation.mutate({ id: item.id, order: parseInt(e.target.value) })}
                        />
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item.isActive}
                            onCheckedChange={(checked) => updateMenuMutation.mutate({ id: item.id, isActive: checked })}
                          />
                          <Label>Активен</Label>
                        </div>
                        <Button size="sm" onClick={() => setEditingMenu(null)}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-muted-foreground">{item.url}</span>
                          <span className="text-sm bg-muted px-2 py-1 rounded">Порядок: {item.order}</span>
                          <span className={`text-sm px-2 py-1 rounded ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isActive ? 'Активен' : 'Неактивен'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingMenu(item.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMenuMutation.mutate(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slider" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление слайдером</CardTitle>
              <CardDescription>
                Создавайте и редактируйте слайды для главной страницы сайта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Slider Item Form */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Добавить новый слайд
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    placeholder="Заголовок слайда"
                    value={newSliderItem.title || ''}
                    onChange={(e) => setNewSliderItem(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Подзаголовок"
                    value={newSliderItem.subtitle || ''}
                    onChange={(e) => setNewSliderItem(prev => ({ ...prev, subtitle: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Описание"
                    value={newSliderItem.description || ''}
                    onChange={(e) => setNewSliderItem(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="URL изображения"
                      value={newSliderItem.imageUrl || ''}
                      onChange={(e) => setNewSliderItem(prev => ({ ...prev, imageUrl: e.target.value }))}
                    />
                    <Input
                      placeholder="Текст кнопки"
                      value={newSliderItem.buttonText || ''}
                      onChange={(e) => setNewSliderItem(prev => ({ ...prev, buttonText: e.target.value }))}
                    />
                    <Input
                      placeholder="URL кнопки"
                      value={newSliderItem.buttonUrl || ''}
                      onChange={(e) => setNewSliderItem(prev => ({ ...prev, buttonUrl: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Порядок"
                      value={newSliderItem.order || 0}
                      onChange={(e) => setNewSliderItem(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-32"
                    />
                    <Button
                      onClick={() => createSliderMutation.mutate(newSliderItem)}
                      disabled={!newSliderItem.title || createSliderMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить слайд
                    </Button>
                  </div>
                </div>
              </div>

              {/* Slider Items List */}
              <div className="space-y-4">
                {sliderItems?.map((item: SliderItem) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="font-medium">{item.title}</h3>
                          {item.subtitle && <span className="text-muted-foreground">— {item.subtitle}</span>}
                          <span className="text-sm bg-muted px-2 py-1 rounded">Порядок: {item.order}</span>
                          <span className={`text-sm px-2 py-1 rounded ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {item.isActive ? 'Активен' : 'Неактивен'}
                          </span>
                        </div>
                        {item.description && <p className="text-muted-foreground">{item.description}</p>}
                        {(item.buttonText || item.buttonUrl) && (
                          <div className="text-sm">
                            Кнопка: {item.buttonText} → {item.buttonUrl}
                          </div>
                        )}
                        {item.imageUrl && (
                          <div className="text-sm text-muted-foreground">
                            Изображение: {item.imageUrl}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setEditingSlider(item.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSliderMutation.mutate(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление логотипом</CardTitle>
              <CardDescription>
                Загрузите и настройте логотип компании
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Перетащите логотип сюда или нажмите для выбора файла</p>
                <Button variant="outline">
                  <Image className="h-4 w-4 mr-2" />
                  Выбрать файл
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}