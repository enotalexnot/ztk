import { 
  users, products, categories, subcategories, news, articles, inquiries,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Subcategory, type InsertSubcategory,
  type News, type InsertNews,
  type Article, type InsertArticle,
  type Inquiry, type InsertInquiry
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsBySubcategory(subcategoryId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Subcategories
  getSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]>;
  getSubcategory(id: number): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;

  // News
  getNews(): Promise<News[]>;
  getNewsItem(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;

  // Articles
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;

  // Inquiries
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private subcategories: Map<number, Subcategory>;
  private news: Map<number, News>;
  private articles: Map<number, Article>;
  private inquiries: Map<number, Inquiry>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCategoryId: number;
  private currentSubcategoryId: number;
  private currentNewsId: number;
  private currentArticleId: number;
  private currentInquiryId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.subcategories = new Map();
    this.news = new Map();
    this.articles = new Map();
    this.inquiries = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCategoryId = 1;
    this.currentSubcategoryId = 1;
    this.currentNewsId = 1;
    this.currentArticleId = 1;
    this.currentInquiryId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categories = [
      { id: 1, name: "Электротехническое оборудование", description: "Промышленное электротехническое оборудование", icon: "bolt" },
      { id: 2, name: "Пескоструйное и компрессорное оборудование", description: "Оборудование для пескоструйных работ и компрессоры", icon: "tools" },
      { id: 3, name: "Аккумуляторные батареи и зарядные устройства", description: "Промышленные аккумуляторы и системы зарядки", icon: "battery-full" },
    ];

    categories.forEach(cat => {
      this.categories.set(cat.id, cat);
      this.currentCategoryId = Math.max(this.currentCategoryId, cat.id + 1);
    });

    // Seed subcategories
    const subcategoriesData = [
      { id: 1, name: "Высоковольтное оборудование", categoryId: 1, description: "Высоковольтные разъединители, выключатели" },
      { id: 2, name: "Низковольтное оборудование", categoryId: 1, description: "Автоматические выключатели, контакторы" },
      { id: 3, name: "Трансформаторы", categoryId: 1, description: "Силовые и измерительные трансформаторы" },
      { id: 4, name: "Компрессоры", categoryId: 2, description: "Винтовые и поршневые компрессоры" },
      { id: 5, name: "Пескоструйное оборудование", categoryId: 2, description: "Пескоструйные аппараты и камеры" },
      { id: 6, name: "Тяговые аккумуляторы", categoryId: 3, description: "Для складской техники" },
      { id: 7, name: "Стационарные аккумуляторы", categoryId: 3, description: "Для ИБП и электростанций" },
      { id: 8, name: "Зарядные устройства", categoryId: 3, description: "Для всех типов аккумуляторов" },
    ];

    subcategoriesData.forEach(sub => {
      this.subcategories.set(sub.id, sub);
      this.currentSubcategoryId = Math.max(this.currentSubcategoryId, sub.id + 1);
    });

    // Seed products with extended fields
    const products = [
      { id: 1, name: "Зарядные устройства для АКБ", description: "Для кислотных, щелочных и литиевых АКБ", categoryId: 3, subcategoryId: 8, price: "По запросу", imageUrl: "https://images.unsplash.com/photo-1609770231080-e321deccc34c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", featured: true, model: "ЗУ-24-50", brand: "ЭТК", specifications: "24В, 50А, автоматический режим" },
      { id: 2, name: "АКБ для складской техники", description: "Погрузчики, штабелеры, электрокары", categoryId: 3, subcategoryId: 6, price: "По запросу", imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", featured: true, model: "ТНЖ-300", brand: "Тюмень", specifications: "24В, 300Ач, никель-железный" },
      { id: 3, name: "Стационарные аккумуляторы", description: "Для электростанций и ИБП", categoryId: 3, subcategoryId: 7, price: "По запросу", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", featured: true, model: "СК-12-100", brand: "Курск", specifications: "12В, 100Ач, свинцово-кислотный" },
      { id: 4, name: "Высоковольтный разъединитель", description: "Наружной установки 35кВ", categoryId: 1, subcategoryId: 1, price: "По запросу", imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", featured: false, model: "РНД-35", brand: "Электроаппарат", specifications: "35кВ, 630А, наружная установка" },
      { id: 5, name: "Автоматический выключатель", description: "Низковольтный промышленный", categoryId: 1, subcategoryId: 2, price: "По запросу", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", featured: false, model: "ВА55-43", brand: "Контактор", specifications: "380В, 1000А, электромагнитный расцепитель" },
      { id: 6, name: "Винтовой компрессор", description: "Промышленный маслозаполненный", categoryId: 2, subcategoryId: 4, price: "По запросу", imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", featured: false, model: "ВК-22", brand: "Компрессор", specifications: "22кВт, 3.8м³/мин, 8бар" },
    ];

    products.forEach(prod => {
      this.products.set(prod.id, { ...prod, description: prod.description || null, price: prod.price || null, imageUrl: prod.imageUrl || null, featured: prod.featured || null, model: prod.model || null, brand: prod.brand || null, specifications: prod.specifications || null, subcategoryId: prod.subcategoryId || null });
      this.currentProductId = Math.max(this.currentProductId, prod.id + 1);
    });

    // Seed news
    const newsItems = [
      { id: 1, title: "«ЭТК» получил свидетельство на товарный знак", content: "Рады сообщить, что компания «ЭТК» зарегистрирована как товарный знак...", excerpt: "Рады сообщить, что компания «ЭТК» зарегистрирована...", imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200", publishedAt: new Date("2024-12-15") },
      { id: 2, title: "Наши аккумуляторы покоряют Казахстан", content: "Мы приняли участие в международной бизнес-миссии в Казахстане...", excerpt: "Мы приняли участие в международной бизнес-миссии в...", imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200", publishedAt: new Date("2024-12-10") },
      { id: 3, title: "ЭТК на инновации: Наше участие в СеМАТ Russia 2024", content: "Компания ЭТК в очередной раз приняла участие в ведущем промышленном форуме СеМАТ Russia 2024...", excerpt: "Компания ЭТК в очередной раз приняла участие в ведущем...", imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200", publishedAt: new Date("2024-12-05") },
    ];

    newsItems.forEach(item => {
      this.news.set(item.id, { ...item, imageUrl: item.imageUrl || null, excerpt: item.excerpt || null, publishedAt: item.publishedAt || null });
      this.currentNewsId = Math.max(this.currentNewsId, item.id + 1);
    });

    // Seed articles
    const articlesItems = [
      { id: 1, title: "Неувядающая классика в мире аккумуляторных батарей", content: "Анализируя просторы Интернета, заметили такую тенденцию...", excerpt: "Анализируя просторы Интернета, заметили такую тенденцию...", imageUrl: "https://images.unsplash.com/photo-1609770231080-e321deccc34c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200", publishedAt: new Date("2024-12-08") },
      { id: 2, title: "Самый востребованный электропогрузчик", content: "Какой электропогрузчик является одним из самых востребованных на рынке...", excerpt: "Какой электропогрузчик является одним из самых востребованных...", imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200", publishedAt: new Date("2024-12-05") },
    ];

    articlesItems.forEach(item => {
      this.articles.set(item.id, { ...item, imageUrl: item.imageUrl || null, excerpt: item.excerpt || null, publishedAt: item.publishedAt || null });
      this.currentArticleId = Math.max(this.currentArticleId, item.id + 1);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // News methods
  async getNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );
  }

  async getNewsItem(id: number): Promise<News | undefined> {
    return this.news.get(id);
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.currentNewsId++;
    const newsItem: News = { ...insertNews, id, publishedAt: new Date() };
    this.news.set(id, newsItem);
    return newsItem;
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).sort((a, b) => 
      new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    );
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = { ...insertArticle, id, publishedAt: new Date() };
    this.articles.set(id, article);
    return article;
  }

  // Inquiry methods
  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { ...insertInquiry, id, createdAt: new Date() };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
}

export const storage = new MemStorage();
