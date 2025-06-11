import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertPartnerSchema, type Partner, type InsertPartner } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { z } from "zod";

const partnerFormSchema = insertPartnerSchema.extend({
  imageFile: z.any().optional(),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

interface AdminPartnerFormProps {
  partner?: Partner;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AdminPartnerForm({ partner, onSuccess, onCancel }: AdminPartnerFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(partner?.imageUrl || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: partner?.name || "",
      description: partner?.description || "",
      websiteUrl: partner?.websiteUrl || "",
      imageUrl: partner?.imageUrl || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPartner) => {
      const response = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create partner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({ title: "Партнер создан успешно" });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Ошибка создания партнера", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertPartner) => {
      const response = await fetch(`/api/admin/partners/${partner!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update partner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/partners"] });
      toast({ title: "Партнер обновлен успешно" });
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Ошибка обновления партнера", variant: "destructive" });
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    
    const response = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    
    if (!response.ok) throw new Error("Failed to upload image");
    const data = await response.json();
    return data.url;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("imageFile", file);
    }
  };

  const onSubmit = async (data: PartnerFormData) => {
    try {
      let imageUrl = data.imageUrl;
      
      if (data.imageFile) {
        imageUrl = await uploadImage(data.imageFile);
      }

      const partnerData: InsertPartner = {
        name: data.name,
        description: data.description || null,
        websiteUrl: data.websiteUrl || null,
        imageUrl: imageUrl || null,
      };

      if (partner) {
        updateMutation.mutate(partnerData);
      } else {
        createMutation.mutate(partnerData);
      }
    } catch (error) {
      toast({ title: "Ошибка загрузки изображения", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{partner ? "Редактировать партнера" : "Добавить партнера"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Название</Label>
            <Input
              {...form.register("name")}
              placeholder="Название партнера"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              {...form.register("description")}
              placeholder="Описание партнера"
            />
          </div>

          <div>
            <Label htmlFor="websiteUrl">Сайт</Label>
            <Input
              {...form.register("websiteUrl")}
              placeholder="https://example.com"
              type="url"
            />
          </div>

          <div>
            <Label htmlFor="image">Изображение</Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={() => {
                      setImagePreview("");
                      form.setValue("imageFile", undefined);
                      form.setValue("imageUrl", "");
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending 
                ? "Сохранение..." 
                : partner ? "Обновить" : "Создать"
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