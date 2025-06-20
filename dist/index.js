var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  admins: () => admins,
  articles: () => articles,
  categories: () => categories,
  homepageContent: () => homepageContent,
  inquiries: () => inquiries,
  insertAdminSchema: () => insertAdminSchema,
  insertArticleSchema: () => insertArticleSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertHomepageContentSchema: () => insertHomepageContentSchema,
  insertInquirySchema: () => insertInquirySchema,
  insertMenuItemSchema: () => insertMenuItemSchema,
  insertNewsSchema: () => insertNewsSchema,
  insertPartnerSchema: () => insertPartnerSchema,
  insertProductSchema: () => insertProductSchema,
  insertSessionSchema: () => insertSessionSchema,
  insertSiteSettingsSchema: () => insertSiteSettingsSchema,
  insertSliderItemSchema: () => insertSliderItemSchema,
  insertStaticPageSchema: () => insertStaticPageSchema,
  insertSubcategorySchema: () => insertSubcategorySchema,
  insertUserSchema: () => insertUserSchema,
  menuItems: () => menuItems,
  news: () => news,
  partners: () => partners,
  products: () => products,
  sessions: () => sessions,
  siteSettings: () => siteSettings,
  sliderItems: () => sliderItems,
  staticPages: () => staticPages,
  subcategories: () => subcategories,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").notNull(),
  subcategoryId: integer("subcategory_id"),
  price: text("price"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  specifications: text("specifications"),
  model: text("model"),
  brand: text("brand"),
  images: text("images").array(),
  files: text("files").array(),
  detailedDescription: text("detailed_description"),
  warranty: text("warranty"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: integer("category_id").notNull(),
  description: text("description")
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon")
});
var news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").defaultNow()
});
var articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").defaultNow()
});
var inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var staticPages = pgTable("static_pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titleRu: text("title_ru").notNull(),
  titleEn: text("title_en").notNull(),
  contentRu: text("content_ru").notNull(),
  contentEn: text("content_en").notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  adminId: integer("admin_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  websiteUrl: text("website_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var homepageContent = pgTable("homepage_content", {
  id: serial("id").primaryKey(),
  sectionKey: text("section_key").notNull().unique(),
  title: text("title").notNull(),
  content: text("content"),
  imageUrl: text("image_url"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  type: text("type").notNull().default("text"),
  // text, image, json, boolean
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  order: integer("order").notNull().default(0),
  parentId: integer("parent_id"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var sliderItems = pgTable("slider_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  imageUrl: text("image_url"),
  buttonText: text("button_text"),
  buttonUrl: text("button_url"),
  order: integer("order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSubcategorySchema = createInsertSchema(subcategories).omit({
  id: true
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true
});
var insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  publishedAt: true
});
var insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  publishedAt: true
});
var insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true
});
var insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true
});
var insertStaticPageSchema = createInsertSchema(staticPages).omit({
  id: true,
  updatedAt: true
});
var insertSessionSchema = createInsertSchema(sessions).omit({
  createdAt: true
});
var insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertHomepageContentSchema = createInsertSchema(homepageContent).omit({
  id: true,
  updatedAt: true
});
var insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true
});
var insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSliderItemSchema = createInsertSchema(sliderItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  // Users
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Products
  async getProducts() {
    return await db.select().from(products);
  }
  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  async getProductsByCategory(categoryId) {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }
  async getProductsBySubcategory(subcategoryId) {
    return await db.select().from(products).where(eq(products.subcategoryId, subcategoryId));
  }
  async createProduct(insertProduct) {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  async updateProduct(id, updateData) {
    const [product] = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    return product;
  }
  async deleteProduct(id) {
    await db.delete(products).where(eq(products.id, id));
  }
  // Categories
  async getCategories() {
    return await db.select().from(categories);
  }
  async getCategory(id) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }
  async createCategory(insertCategory) {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }
  async updateCategory(id, updateData) {
    const [category] = await db.update(categories).set(updateData).where(eq(categories.id, id)).returning();
    return category;
  }
  async deleteCategory(id) {
    await db.delete(categories).where(eq(categories.id, id));
  }
  // Subcategories
  async getSubcategories() {
    return await db.select().from(subcategories);
  }
  async getSubcategoriesByCategory(categoryId) {
    return await db.select().from(subcategories).where(eq(subcategories.categoryId, categoryId));
  }
  async getSubcategory(id) {
    const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id, id));
    return subcategory;
  }
  async createSubcategory(insertSubcategory) {
    const [subcategory] = await db.insert(subcategories).values(insertSubcategory).returning();
    return subcategory;
  }
  async updateSubcategory(id, updateData) {
    const [subcategory] = await db.update(subcategories).set(updateData).where(eq(subcategories.id, id)).returning();
    return subcategory;
  }
  async deleteSubcategory(id) {
    await db.delete(subcategories).where(eq(subcategories.id, id));
  }
  // News
  async getNews() {
    return await db.select().from(news);
  }
  async getNewsItem(id) {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }
  async createNews(insertNews) {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }
  async updateNews(id, updateData) {
    const [newsItem] = await db.update(news).set(updateData).where(eq(news.id, id)).returning();
    return newsItem;
  }
  async deleteNews(id) {
    await db.delete(news).where(eq(news.id, id));
  }
  // Articles
  async getArticles() {
    return await db.select().from(articles);
  }
  async getArticle(id) {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article;
  }
  async createArticle(insertArticle) {
    const [article] = await db.insert(articles).values(insertArticle).returning();
    return article;
  }
  async updateArticle(id, updateData) {
    const [article] = await db.update(articles).set(updateData).where(eq(articles.id, id)).returning();
    return article;
  }
  async deleteArticle(id) {
    await db.delete(articles).where(eq(articles.id, id));
  }
  // Inquiries
  async getInquiries() {
    return await db.select().from(inquiries);
  }
  async createInquiry(insertInquiry) {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }
  // Admins
  async getAdmin(id) {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }
  async getAdminByUsername(username) {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }
  async createAdmin(insertAdmin) {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }
  // Static Pages
  async getStaticPages() {
    return await db.select().from(staticPages);
  }
  async getStaticPage(slug) {
    const [page] = await db.select().from(staticPages).where(eq(staticPages.slug, slug));
    return page;
  }
  async createStaticPage(insertPage) {
    const [page] = await db.insert(staticPages).values(insertPage).returning();
    return page;
  }
  async updateStaticPage(slug, updateData) {
    const [page] = await db.update(staticPages).set({
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(staticPages.slug, slug)).returning();
    return page;
  }
  // Sessions
  async createSession(insertSession) {
    const [session] = await db.insert(sessions).values(insertSession).returning();
    return session;
  }
  async getSession(id) {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session;
  }
  async deleteSession(id) {
    await db.delete(sessions).where(eq(sessions.id, id));
  }
  // Partners
  async getPartners() {
    return await db.select().from(partners);
  }
  async getPartner(id) {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner;
  }
  async createPartner(insertPartner) {
    const [partner] = await db.insert(partners).values(insertPartner).returning();
    return partner;
  }
  async updatePartner(id, updateData) {
    const [partner] = await db.update(partners).set({
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(partners.id, id)).returning();
    return partner;
  }
  async deletePartner(id) {
    await db.delete(partners).where(eq(partners.id, id));
  }
  // Homepage Content
  async getHomepageContent() {
    return await db.select().from(homepageContent);
  }
  async getHomepageContentByKey(key) {
    const [content] = await db.select().from(homepageContent).where(eq(homepageContent.sectionKey, key));
    return content;
  }
  async createHomepageContent(insertContent) {
    const [content] = await db.insert(homepageContent).values(insertContent).returning();
    return content;
  }
  async updateHomepageContent(key, updateData) {
    const [content] = await db.update(homepageContent).set({
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(homepageContent.sectionKey, key)).returning();
    return content;
  }
  // Site Settings
  async getSiteSettings() {
    return await db.select().from(siteSettings);
  }
  async getSiteSetting(key) {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }
  async updateSiteSetting(key, value) {
    const [setting] = await db.update(siteSettings).set({
      value,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(siteSettings.key, key)).returning();
    return setting;
  }
  async createSiteSetting(insertSetting) {
    const [setting] = await db.insert(siteSettings).values(insertSetting).returning();
    return setting;
  }
  // Menu Items
  async getMenuItems() {
    return await db.select().from(menuItems).orderBy(menuItems.order);
  }
  async getMenuItem(id) {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }
  async createMenuItem(insertItem) {
    const [item] = await db.insert(menuItems).values(insertItem).returning();
    return item;
  }
  async updateMenuItem(id, updateData) {
    const [item] = await db.update(menuItems).set({
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(menuItems.id, id)).returning();
    return item;
  }
  async deleteMenuItem(id) {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }
  // Slider Items
  async getSliderItems() {
    return await db.select().from(sliderItems).where(eq(sliderItems.isActive, true)).orderBy(sliderItems.order);
  }
  async getSliderItem(id) {
    const [item] = await db.select().from(sliderItems).where(eq(sliderItems.id, id));
    return item;
  }
  async createSliderItem(insertItem) {
    const [item] = await db.insert(sliderItems).values(insertItem).returning();
    return item;
  }
  async updateSliderItem(id, updateData) {
    const [item] = await db.update(sliderItems).set({
      ...updateData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(sliderItems.id, id)).returning();
    return item;
  }
  async deleteSliderItem(id) {
    await db.delete(sliderItems).where(eq(sliderItems.id, id));
  }
};
var storage = new DatabaseStorage();

// server/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";
function transliterate(text2) {
  const translitMap = {
    "\u0430": "a",
    "\u0431": "b",
    "\u0432": "v",
    "\u0433": "g",
    "\u0434": "d",
    "\u0435": "e",
    "\u0451": "yo",
    "\u0436": "zh",
    "\u0437": "z",
    "\u0438": "i",
    "\u0439": "y",
    "\u043A": "k",
    "\u043B": "l",
    "\u043C": "m",
    "\u043D": "n",
    "\u043E": "o",
    "\u043F": "p",
    "\u0440": "r",
    "\u0441": "s",
    "\u0442": "t",
    "\u0443": "u",
    "\u0444": "f",
    "\u0445": "h",
    "\u0446": "ts",
    "\u0447": "ch",
    "\u0448": "sh",
    "\u0449": "sch",
    "\u044A": "",
    "\u044B": "y",
    "\u044C": "",
    "\u044D": "e",
    "\u044E": "yu",
    "\u044F": "ya",
    "\u0410": "A",
    "\u0411": "B",
    "\u0412": "V",
    "\u0413": "G",
    "\u0414": "D",
    "\u0415": "E",
    "\u0401": "Yo",
    "\u0416": "Zh",
    "\u0417": "Z",
    "\u0418": "I",
    "\u0419": "Y",
    "\u041A": "K",
    "\u041B": "L",
    "\u041C": "M",
    "\u041D": "N",
    "\u041E": "O",
    "\u041F": "P",
    "\u0420": "R",
    "\u0421": "S",
    "\u0422": "T",
    "\u0423": "U",
    "\u0424": "F",
    "\u0425": "H",
    "\u0426": "Ts",
    "\u0427": "Ch",
    "\u0428": "Sh",
    "\u0429": "Sch",
    "\u042A": "",
    "\u042B": "Y",
    "\u042C": "",
    "\u042D": "E",
    "\u042E": "Yu",
    "\u042F": "Ya"
  };
  return text2.split("").map((char) => translitMap[char] || char).join("").replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
var storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    const productName = req.body.productName || "default";
    const type = req.body.type || "files";
    const transliteratedName = transliterate(productName);
    const uploadDir = path.join(process.cwd(), "uploads", transliteratedName, type);
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp2 = Date.now();
    const randomNum = Math.round(Math.random() * 1e3);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const transliteratedBaseName = transliterate(baseName);
    const filename = `${transliteratedBaseName}-${timestamp2}-${randomNum}${ext}`;
    cb(null, filename);
  }
});
var fileFilter = (req, file, cb) => {
  const type = req.body.type || "files";
  if (type === "images") {
    const allowedImageMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff"
    ];
    if (file.mimetype.startsWith("image/") || allowedImageMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0442\u0438\u043F \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F: ${file.mimetype}`));
    }
  } else {
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "application/zip",
      "application/x-rar-compressed"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("\u041D\u0435\u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u043C\u044B\u0439 \u0442\u0438\u043F \u0444\u0430\u0439\u043B\u0430"));
    }
  }
};
var upload = multer({
  storage: storage2,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB максимум
  }
});

// server/routes.ts
import { z } from "zod";

// server/auth.ts
import crypto from "crypto";
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}
function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}
async function createAdminSession(adminId) {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
  await storage.createSession({
    id: sessionId,
    adminId,
    expiresAt
  });
  return sessionId;
}
async function validateSession(sessionId) {
  if (!sessionId) return null;
  const session = await storage.getSession(sessionId);
  if (!session) return null;
  if (/* @__PURE__ */ new Date() > session.expiresAt) {
    await storage.deleteSession(sessionId);
    return null;
  }
  return session.adminId;
}
async function deleteSession(sessionId) {
  await storage.deleteSession(sessionId);
}

// server/routes.ts
import cookieParser from "cookie-parser";
import path2 from "path";
import express from "express";
async function requireAdmin(req, res, next) {
  const sessionId = req.cookies.admin_session;
  const adminId = await validateSession(sessionId);
  if (!adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.adminId = adminId;
  next();
}
async function registerRoutes(app2) {
  app2.use(cookieParser());
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const products2 = await storage.getProductsByCategory(categoryId);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });
  app2.get("/api/products/subcategory/:subcategoryId", async (req, res) => {
    try {
      const subcategoryId = parseInt(req.params.subcategoryId);
      if (isNaN(subcategoryId)) {
        return res.status(400).json({ error: "Invalid subcategory ID" });
      }
      const products2 = await storage.getProductsBySubcategory(subcategoryId);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by subcategory" });
    }
  });
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
  app2.get("/api/categories/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const category = await storage.getCategory(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });
  app2.get("/api/subcategories", async (req, res) => {
    try {
      const subcategories2 = await storage.getSubcategories();
      res.json(subcategories2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });
  app2.get("/api/subcategories/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const subcategories2 = await storage.getSubcategoriesByCategory(categoryId);
      res.json(subcategories2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategories by category" });
    }
  });
  app2.get("/api/news", async (req, res) => {
    try {
      const news2 = await storage.getNews();
      res.json(news2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });
  app2.get("/api/articles", async (req, res) => {
    try {
      const articles2 = await storage.getArticles();
      res.json(articles2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });
  app2.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid inquiry data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });
  app2.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });
  app2.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  app2.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });
  app2.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  app2.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });
  app2.post("/api/admin/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });
  app2.post("/api/admin/subcategories", async (req, res) => {
    try {
      const validatedData = insertSubcategorySchema.parse(req.body);
      const subcategory = await storage.createSubcategory(validatedData);
      res.status(201).json(subcategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid subcategory data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create subcategory" });
    }
  });
  app2.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const productName = req.body.productName || "default";
      const type = req.body.type || "files";
      const transliteratedName = req.file.destination.split(path2.sep).slice(-2).join("/");
      const relativePath = `/uploads/${transliteratedName}/${req.file.filename}`;
      res.json({
        filePath: relativePath,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      res.status(500).json({ error: "Upload failed" });
    }
  });
  app2.use("/uploads", express.static(path2.join(process.cwd(), "uploads")));
  app2.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });
  app2.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  app2.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });
  app2.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create category" });
    }
  });
  app2.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update category" });
    }
  });
  app2.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });
  app2.post("/api/admin/news", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news2 = await storage.createNews(validatedData);
      res.status(201).json(news2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid news data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create news" });
    }
  });
  app2.put("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news2 = await storage.updateNews(id, validatedData);
      res.json(news2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid news data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update news" });
    }
  });
  app2.delete("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }
      await storage.deleteNews(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete news" });
    }
  });
  app2.post("/api/admin/articles", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid article data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create article" });
    }
  });
  app2.put("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid article data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update article" });
    }
  });
  app2.delete("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }
      await storage.deleteArticle(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  });
  app2.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
    try {
      const inquiries2 = await storage.getInquiries();
      res.json(inquiries2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const hashedPassword = hashPassword(password);
      if (admin.password !== hashedPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const sessionId = await createAdminSession(admin.id);
      res.cookie("admin_session", sessionId, {
        httpOnly: true,
        secure: false,
        // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1e3
        // 24 hours
      });
      res.json({ success: true, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/admin/logout", requireAdmin, async (req, res) => {
    try {
      const sessionId = req.cookies.admin_session;
      if (sessionId) {
        await deleteSession(sessionId);
      }
      res.clearCookie("admin_session");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  });
  app2.get("/api/admin/me", requireAdmin, async (req, res) => {
    try {
      const admin = await storage.getAdmin(req.adminId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }
      res.json({ id: admin.id, username: admin.username });
    } catch (error) {
      res.status(500).json({ error: "Failed to get admin info" });
    }
  });
  app2.post("/api/admin/create", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      const existingAdmin = await storage.getAdminByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ error: "Admin already exists" });
      }
      const hashedPassword = hashPassword(password);
      const admin = await storage.createAdmin({ username, password: hashedPassword });
      res.status(201).json({ success: true, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      res.status(500).json({ error: "Failed to create admin" });
    }
  });
  app2.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  app2.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });
  app2.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update category" });
    }
  });
  app2.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  });
  app2.put("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news2 = await storage.updateNews(id, validatedData);
      res.json(news2);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid news data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update news" });
    }
  });
  app2.delete("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }
      await storage.deleteNews(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete news" });
    }
  });
  app2.get("/api/static-pages", async (req, res) => {
    try {
      const pages = await storage.getStaticPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch static pages" });
    }
  });
  app2.get("/api/static-pages/:slug", async (req, res) => {
    try {
      const page = await storage.getStaticPage(req.params.slug);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });
  app2.post("/api/admin/static-pages", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertStaticPageSchema.parse(req.body);
      const page = await storage.createStaticPage(validatedData);
      res.status(201).json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid page data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create page" });
    }
  });
  app2.put("/api/admin/static-pages/:slug", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertStaticPageSchema.partial().parse(req.body);
      const page = await storage.updateStaticPage(req.params.slug, validatedData);
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid page data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update page" });
    }
  });
  app2.get("/api/partners", async (req, res) => {
    try {
      const partners2 = await storage.getPartners();
      res.json(partners2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });
  app2.post("/api/admin/partners", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertPartnerSchema.parse(req.body);
      const partner = await storage.createPartner(validatedData);
      res.status(201).json(partner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid partner data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create partner" });
    }
  });
  app2.put("/api/admin/partners/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid partner ID" });
      }
      const validatedData = insertPartnerSchema.partial().parse(req.body);
      const partner = await storage.updatePartner(id, validatedData);
      res.json(partner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid partner data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update partner" });
    }
  });
  app2.delete("/api/admin/partners/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid partner ID" });
      }
      await storage.deletePartner(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete partner" });
    }
  });
  app2.get("/api/homepage-content", async (req, res) => {
    try {
      const content = await storage.getHomepageContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch homepage content" });
    }
  });
  app2.get("/api/homepage-content/:key", async (req, res) => {
    try {
      const content = await storage.getHomepageContentByKey(req.params.key);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });
  app2.put("/api/admin/homepage-content/:key", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertHomepageContentSchema.partial().parse(req.body);
      const content = await storage.updateHomepageContent(req.params.key, validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid content data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update content" });
    }
  });
  app2.post("/api/admin/homepage-content", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertHomepageContentSchema.parse(req.body);
      const content = await storage.createHomepageContent(validatedData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid content data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create content" });
    }
  });
  app2.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });
  app2.get("/api/site-settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSiteSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch setting" });
    }
  });
  app2.put("/api/admin/site-settings/:key", requireAdmin, async (req, res) => {
    try {
      const { value } = req.body;
      if (typeof value !== "string") {
        return res.status(400).json({ error: "Value must be a string" });
      }
      const setting = await storage.updateSiteSetting(req.params.key, value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update setting" });
    }
  });
  app2.get("/api/menu-items", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });
  app2.post("/api/admin/menu-items", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid menu item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });
  app2.put("/api/admin/menu-items/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid menu item ID" });
      }
      const validatedData = insertMenuItemSchema.partial().parse(req.body);
      const item = await storage.updateMenuItem(id, validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid menu item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });
  app2.delete("/api/admin/menu-items/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid menu item ID" });
      }
      await storage.deleteMenuItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });
  app2.get("/api/slider-items", async (req, res) => {
    try {
      const items = await storage.getSliderItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch slider items" });
    }
  });
  app2.post("/api/admin/slider-items", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertSliderItemSchema.parse(req.body);
      const item = await storage.createSliderItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid slider item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create slider item" });
    }
  });
  app2.put("/api/admin/slider-items/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid slider item ID" });
      }
      const validatedData = insertSliderItemSchema.partial().parse(req.body);
      const item = await storage.updateSliderItem(id, validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid slider item data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update slider item" });
    }
  });
  app2.delete("/api/admin/slider-items/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid slider item ID" });
      }
      await storage.deleteSliderItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete slider item" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path4 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path3.resolve(import.meta.dirname, "client", "src"),
      "@shared": path3.resolve(import.meta.dirname, "shared"),
      "@assets": path3.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path3.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path3.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import { defineConfig as defineConfig2 } from "vite";
var vite_default = defineConfig2({
  base: "/",
  build: {
    outDir: "../server/public"
  }
});
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
function serveStatic(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use("/assets", express2.static(path4.join(distPath, "assets")));
  app2.use(express2.static(distPath, { index: false }));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import "dotenv/config";
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  serveStatic(app);
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
