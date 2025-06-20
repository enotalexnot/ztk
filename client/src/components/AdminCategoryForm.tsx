import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCategorySchema, type Category, type InsertCategory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { z } from "zod";

const categoryFormSchema = insertCategorySchema.extend({
  iconFile: z.any().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface AdminCategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const iconOptions = [
  { value: "Zap", label: "Электричество" },
  { value: "Battery", label: "Батарея" },
  { value: "Settings", label: "Настройки" },
  { value: "Car", label: "Автомобиль" },
  { value: "Wrench", label: "Инструменты" },
  { value: "Cpu", label: "Процессор" },
  { value: "Gauge", label: "Датчик" },
  { value: "Power", label: "Питание" },
];

export default function AdminCategoryForm({ category, onSuccess, onCancel }: AdminCategoryFormProps) {
  const [iconPreview, setIconPreview] = useState<string>(category?.icon || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      icon: category?.icon || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Категория создана успешно" });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Ошибка создания категории", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const response = await fetch(`/api/admin/categories/${category!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Категория обновлена успешно" });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Ошибка обновления категории", variant: "destructive" });
    },
  });

  const uploadIcon = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    
    if (!response.ok) throw new Error("Failed to upload icon");
    const data = await response.json();
    return data.url;
  };

  const handleIconFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("iconFile", file);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      let icon = data.icon;
      
      if (data.iconFile) {
        icon = await uploadIcon(data.iconFile);
      }

      const categoryData: InsertCategory = {
        name: data.name,
        description: data.description || null,
        icon: icon || null,
      };

      if (category) {
        updateMutation.mutate(categoryData);
      } else {
        createMutation.mutate(categoryData);
      }
    } catch (error) {
      toast({ title: "Ошибка загрузки иконки", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Редактировать категорию" : "Добавить категорию"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Название</Label>
            <Input
              {...form.register("name")}
              placeholder="Название категории"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              {...form.register("description")}
              placeholder="Описание категории"
            />
          </div>

          <div>
            <Label htmlFor="icon">Иконка</Label>
            <div className="space-y-2">
              <Select
                value={form.watch("icon")}
                onValueChange={(value) => {
                  form.setValue("icon", value);
                  setIconPreview(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите иконку" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="text-sm text-muted-foreground">или загрузите файл:</div>
              
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleIconFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
                {iconPreview && !iconOptions.find(opt => opt.value === iconPreview) && (
                  <div className="relative">
                    <img
                      src={iconPreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => {
                        setIconPreview("");
                        form.setValue("iconFile", undefined);
                        form.setValue("icon", "");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending 
                ? "Сохранение..." 
                : category ? "Обновить" : "Создать"
              }
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}