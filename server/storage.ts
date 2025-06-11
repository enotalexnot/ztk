import { 
  users, products, categories, subcategories, news, articles, inquiries, admins, staticPages, sessions, partners, homepageContent, siteSettings, menuItems, sliderItems,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Category, type InsertCategory,
  type Subcategory, type InsertSubcategory,
  type News, type InsertNews,
  type Article, type InsertArticle,
  type Inquiry, type InsertInquiry,
  type Admin, type InsertAdmin,
  type StaticPage, type InsertStaticPage,
  type Session, type InsertSession,
  type Partner, type InsertPartner,
  type HomepageContent, type InsertHomepageContent,
  type SiteSettings, type InsertSiteSettings,
  type MenuItem, type InsertMenuItem,
  type SliderItem, type InsertSliderItem
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Subcategories
  getSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]>;
  getSubcategory(id: number): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(id: number, subcategory: Partial<InsertSubcategory>): Promise<Subcategory>;
  deleteSubcategory(id: number): Promise<void>;

  // News
  getNews(): Promise<News[]>;
  getNewsItem(id: number): Promise<News | undefined>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News>;
  deleteNews(id: number): Promise<void>;

  // Articles
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;

  // Inquiries
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;

  // Admins
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Static Pages
  getStaticPages(): Promise<StaticPage[]>;
  getStaticPage(slug: string): Promise<StaticPage | undefined>;
  createStaticPage(page: InsertStaticPage): Promise<StaticPage>;
  updateStaticPage(slug: string, page: Partial<InsertStaticPage>): Promise<StaticPage>;

  // Sessions
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  deleteSession(id: string): Promise<void>;

  // Partners
  getPartners(): Promise<Partner[]>;
  getPartner(id: number): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: number, partner: Partial<InsertPartner>): Promise<Partner>;
  deletePartner(id: number): Promise<void>;

  // Homepage Content
  getHomepageContent(): Promise<HomepageContent[]>;
  getHomepageContentByKey(key: string): Promise<HomepageContent | undefined>;
  createHomepageContent(content: InsertHomepageContent): Promise<HomepageContent>;
  updateHomepageContent(key: string, content: Partial<InsertHomepageContent>): Promise<HomepageContent>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings[]>;
  getSiteSetting(key: string): Promise<SiteSettings | undefined>;
  updateSiteSetting(key: string, value: string): Promise<SiteSettings>;
  createSiteSetting(setting: InsertSiteSettings): Promise<SiteSettings>;

  // Menu Items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuItem(id: number): Promise<void>;

  // Slider Items
  getSliderItems(): Promise<SliderItem[]>;
  getSliderItem(id: number): Promise<SliderItem | undefined>;
  createSliderItem(item: InsertSliderItem): Promise<SliderItem>;
  updateSliderItem(id: number, item: Partial<InsertSliderItem>): Promise<SliderItem>;
  deleteSliderItem(id: number): Promise<void>;
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

  async getProductsBySubcategory(subcategoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.subcategoryId === subcategoryId);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id, brand: insertProduct.brand || null, description: insertProduct.description || null, subcategoryId: insertProduct.subcategoryId || null, price: insertProduct.price || null, imageUrl: insertProduct.imageUrl || null, featured: insertProduct.featured || null, specifications: insertProduct.specifications || null, model: insertProduct.model || null };
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
    const category: Category = { ...insertCategory, id, description: insertCategory.description || null, icon: insertCategory.icon || null };
    this.categories.set(id, category);
    return category;
  }

  // Subcategory methods
  async getSubcategories(): Promise<Subcategory[]> {
    return Array.from(this.subcategories.values());
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return Array.from(this.subcategories.values()).filter(sub => sub.categoryId === categoryId);
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    return this.subcategories.get(id);
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    const id = this.currentSubcategoryId++;
    const subcategory: Subcategory = { ...insertSubcategory, id, description: insertSubcategory.description || null };
    this.subcategories.set(id, subcategory);
    return subcategory;
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
    const newsItem: News = { ...insertNews, id, publishedAt: new Date(), imageUrl: insertNews.imageUrl || null, excerpt: insertNews.excerpt || null };
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
    const article: Article = { ...insertArticle, id, publishedAt: new Date(), imageUrl: insertArticle.imageUrl || null, excerpt: insertArticle.excerpt || null };
    this.articles.set(id, article);
    return article;
  }

  // Inquiry methods
  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { ...insertInquiry, id, createdAt: new Date(), phone: insertInquiry.phone || null, company: insertInquiry.company || null };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getProductsBySubcategory(subcategoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.subcategoryId, subcategoryId));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, updateData: Partial<InsertCategory>): Promise<Category> {
    const [category] = await db.update(categories).set(updateData).where(eq(categories.id, id)).returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Subcategories
  async getSubcategories(): Promise<Subcategory[]> {
    return await db.select().from(subcategories);
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return await db.select().from(subcategories).where(eq(subcategories.categoryId, categoryId));
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id, id));
    return subcategory;
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    const [subcategory] = await db.insert(subcategories).values(insertSubcategory).returning();
    return subcategory;
  }

  async updateSubcategory(id: number, updateData: Partial<InsertSubcategory>): Promise<Subcategory> {
    const [subcategory] = await db.update(subcategories).set(updateData).where(eq(subcategories.id, id)).returning();
    return subcategory;
  }

  async deleteSubcategory(id: number): Promise<void> {
    await db.delete(subcategories).where(eq(subcategories.id, id));
  }

  // News
  async getNews(): Promise<News[]> {
    return await db.select().from(news);
  }

  async getNewsItem(id: number): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }

  async updateNews(id: number, updateData: Partial<InsertNews>): Promise<News> {
    const [newsItem] = await db.update(news).set(updateData).where(eq(news.id, id)).returning();
    return newsItem;
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }

  async updateArticle(id: number, updateData: Partial<InsertArticle>): Promise<Article> {
    const [article] = await db.update(articles).set(updateData).where(eq(articles.id, id)).returning();
    return article;
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  // Inquiries
  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  // Admins
  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  // Static Pages
  async getStaticPages(): Promise<StaticPage[]> {
    return await db.select().from(staticPages);
  }

  async getStaticPage(slug: string): Promise<StaticPage | undefined> {
    const [page] = await db.select().from(staticPages).where(eq(staticPages.slug, slug));
    return page;
  }

  async createStaticPage(insertPage: InsertStaticPage): Promise<StaticPage> {
    const [page] = await db.insert(staticPages).values(insertPage).returning();
    return page;
  }

  async updateStaticPage(slug: string, updateData: Partial<InsertStaticPage>): Promise<StaticPage> {
    const [page] = await db.update(staticPages).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(staticPages.slug, slug)).returning();
    return page;
  }

  // Sessions
  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db.insert(sessions).values(insertSession).returning();
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session;
  }

  async deleteSession(id: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  }

  // Partners
  async getPartners(): Promise<Partner[]> {
    return await db.select().from(partners);
  }

  async getPartner(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner;
  }

  async createPartner(insertPartner: InsertPartner): Promise<Partner> {
    const [partner] = await db.insert(partners).values(insertPartner).returning();
    return partner;
  }

  async updatePartner(id: number, updateData: Partial<InsertPartner>): Promise<Partner> {
    const [partner] = await db.update(partners).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(partners.id, id)).returning();
    return partner;
  }

  async deletePartner(id: number): Promise<void> {
    await db.delete(partners).where(eq(partners.id, id));
  }

  // Homepage Content
  async getHomepageContent(): Promise<HomepageContent[]> {
    return await db.select().from(homepageContent);
  }

  async getHomepageContentByKey(key: string): Promise<HomepageContent | undefined> {
    const [content] = await db.select().from(homepageContent).where(eq(homepageContent.sectionKey, key));
    return content;
  }

  async createHomepageContent(insertContent: InsertHomepageContent): Promise<HomepageContent> {
    const [content] = await db.insert(homepageContent).values(insertContent).returning();
    return content;
  }

  async updateHomepageContent(key: string, updateData: Partial<InsertHomepageContent>): Promise<HomepageContent> {
    const [content] = await db.update(homepageContent).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(homepageContent.sectionKey, key)).returning();
    return content;
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSettings | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async updateSiteSetting(key: string, value: string): Promise<SiteSettings> {
    const [setting] = await db.update(siteSettings).set({
      value,
      updatedAt: new Date()
    }).where(eq(siteSettings.key, key)).returning();
    return setting;
  }

  async createSiteSetting(insertSetting: InsertSiteSettings): Promise<SiteSettings> {
    const [setting] = await db.insert(siteSettings).values(insertSetting).returning();
    return setting;
  }

  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems).orderBy(menuItems.order);
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db.insert(menuItems).values(insertItem).returning();
    return item;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [item] = await db.update(menuItems).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(menuItems.id, id)).returning();
    return item;
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  // Slider Items
  async getSliderItems(): Promise<SliderItem[]> {
    return await db.select().from(sliderItems).where(eq(sliderItems.isActive, true)).orderBy(sliderItems.order);
  }

  async getSliderItem(id: number): Promise<SliderItem | undefined> {
    const [item] = await db.select().from(sliderItems).where(eq(sliderItems.id, id));
    return item;
  }

  async createSliderItem(insertItem: InsertSliderItem): Promise<SliderItem> {
    const [item] = await db.insert(sliderItems).values(insertItem).returning();
    return item;
  }

  async updateSliderItem(id: number, updateData: Partial<InsertSliderItem>): Promise<SliderItem> {
    const [item] = await db.update(sliderItems).set({
      ...updateData,
      updatedAt: new Date()
    }).where(eq(sliderItems.id, id)).returning();
    return item;
  }

  async deleteSliderItem(id: number): Promise<void> {
    await db.delete(sliderItems).where(eq(sliderItems.id, id));
  }
}

export const storage = new DatabaseStorage();
