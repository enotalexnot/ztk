import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { insertHomepageContentSchema, type HomepageContent } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";

const contentFormSchema = insertHomepageContentSchema;
type ContentFormData = z.infer<typeof contentFormSchema>;

export default function AdminHomepageContentForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery<HomepageContent[]>({
    queryKey: ["/api/homepage-content"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, data }: { key: string; data: Partial<ContentFormData> }) => {
      const response = await fetch(`/api/admin/homepage-content/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homepage-content"] });
      toast({ title: "Контент обновлен успешно" });
    },
    onError: () => {
      toast({ title: "Ошибка обновления контента", variant: "destructive" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const response = await fetch("/api/admin/homepage-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create content");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homepage-content"] });
      toast({ title: "Контент создан успешно" });
    },
    onError: () => {
      toast({ title: "Ошибка создания контента", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const contentSections = content || [];

  const ContentForm = ({ item }: { item?: HomepageContent }) => {
    const form = useForm<ContentFormData>({
      resolver: zodResolver(contentFormSchema),
      defaultValues: {
        sectionKey: item?.sectionKey || "",
        title: item?.title || "",
        content: item?.content || "",
        imageUrl: item?.imageUrl || "",
      },
    });

    const onSubmit = (data: ContentFormData) => {
      if (item) {
        updateMutation.mutate({ key: item.sectionKey, data });
      } else {
        createMutation.mutate(data);
      }
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {item ? `Редактировать: ${item.sectionKey}` : "Добавить новый раздел"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="sectionKey">Ключ раздела</Label>
              <Input
                {...form.register("sectionKey")}
                placeholder="hero_title"
                disabled={!!item}
              />
              {form.formState.errors.sectionKey && (
                <p className="text-sm text-red-500">{form.formState.errors.sectionKey.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="title">Заголовок</Label>
              <Input
                {...form.register("title")}
                placeholder="Заголовок раздела"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">Содержимое</Label>
              <Textarea
                {...form.register("content")}
                placeholder="Текст раздела"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">URL изображения</Label>
              <Input
                {...form.register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>

            <Button
              type="submit"
              disabled={updateMutation.isPending || createMutation.isPending}
            >
              {updateMutation.isPending || createMutation.isPending 
                ? "Сохранение..." 
                : item ? "Обновить" : "Создать"
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Управление контентом главной страницы</h2>
      
      <div className="space-y-4">
        {contentSections.map((item) => (
          <ContentForm key={item.sectionKey} item={item} />
        ))}
        
        <ContentForm />
      </div>
    </div>
  );
}