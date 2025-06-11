import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload } from "./upload";
import { insertInquirySchema, insertProductSchema, insertCategorySchema, insertSubcategorySchema, insertNewsSchema, insertArticleSchema, insertAdminSchema, insertStaticPageSchema, insertPartnerSchema, insertHomepageContentSchema } from "@shared/schema";
import { z } from "zod";
import { hashPassword, createAdminSession, validateSession, deleteSession } from "./auth";
import cookieParser from "cookie-parser";
import path from "path";
import express from "express";

// Middleware for admin authentication
async function requireAdmin(req: any, res: any, next: any) {
  const sessionId = req.cookies.admin_session;
  const adminId = await validateSession(sessionId);
  
  if (!adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  req.adminId = adminId;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const products = await storage.getProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
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

  // Get products by subcategory
  app.get("/api/products/subcategory/:subcategoryId", async (req, res) => {
    try {
      const subcategoryId = parseInt(req.params.subcategoryId);
      if (isNaN(subcategoryId)) {
        return res.status(400).json({ error: "Invalid subcategory ID" });
      }
      const products = await storage.getProductsBySubcategory(subcategoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by subcategory" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get category by ID
  app.get("/api/categories/:categoryId", async (req, res) => {
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

  // Get all subcategories
  app.get("/api/subcategories", async (req, res) => {
    try {
      const subcategories = await storage.getSubcategories();
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategories" });
    }
  });

  // Get subcategories by category
  app.get("/api/subcategories/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      const subcategories = await storage.getSubcategoriesByCategory(categoryId);
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subcategories by category" });
    }
  });

  // Get all news
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // Get all articles
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Create inquiry
  app.post("/api/inquiries", async (req, res) => {
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

  // Create product (for regular users/admin)
  app.post("/api/products", async (req, res) => {
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

  // Update product (for regular users/admin)
  app.patch("/api/products/:id", async (req, res) => {
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

  // Admin routes - Products
  app.post("/api/admin/products", requireAdmin, async (req, res) => {
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

  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
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

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
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

  // Admin routes - Categories
  app.post("/api/admin/categories", async (req, res) => {
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

  // Admin routes - Subcategories
  app.post("/api/admin/subcategories", async (req, res) => {
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

  // File upload route
  app.post("/api/upload", upload.single('file'), (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const productName = req.body.productName || 'default';
      const type = req.body.type || 'files';
      
      // Создаем полный путь включая папку товара
      const transliteratedName = req.file.destination.split(path.sep).slice(-2).join('/');
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

  // Статические файлы для загрузок
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Admin routes - Products
  app.post("/api/admin/products", requireAdmin, async (req: any, res) => {
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

  app.put("/api/admin/products/:id", requireAdmin, async (req: any, res) => {
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

  app.delete("/api/admin/products/:id", requireAdmin, async (req: any, res) => {
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

  // Admin routes - Categories
  app.post("/api/admin/categories", requireAdmin, async (req: any, res) => {
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

  app.put("/api/admin/categories/:id", requireAdmin, async (req: any, res) => {
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

  app.delete("/api/admin/categories/:id", requireAdmin, async (req: any, res) => {
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

  // Admin routes - News
  app.post("/api/admin/news", requireAdmin, async (req: any, res) => {
    try {
      const validatedData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(validatedData);
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid news data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create news" });
    }
  });

  app.put("/api/admin/news/:id", requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(id, validatedData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid news data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update news" });
    }
  });

  app.delete("/api/admin/news/:id", requireAdmin, async (req: any, res) => {
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

  // Admin routes - Articles
  app.post("/api/admin/articles", requireAdmin, async (req: any, res) => {
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

  app.put("/api/admin/articles/:id", requireAdmin, async (req: any, res) => {
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

  app.delete("/api/admin/articles/:id", requireAdmin, async (req: any, res) => {
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

  // Get all inquiries (admin)
  app.get("/api/admin/inquiries", requireAdmin, async (req: any, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
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
      res.cookie('admin_session', sessionId, { 
        httpOnly: true, 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
      
      res.json({ success: true, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", requireAdmin, async (req: any, res) => {
    try {
      const sessionId = req.cookies.admin_session;
      if (sessionId) {
        await deleteSession(sessionId);
      }
      res.clearCookie('admin_session');
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  });

  app.get("/api/admin/me", requireAdmin, async (req: any, res) => {
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

  // Create admin (for setup only - remove in production)
  app.post("/api/admin/create", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }
      
      // Check if admin already exists
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

  // CRUD operations for products (protected)
  app.put("/api/admin/products/:id", requireAdmin, async (req: any, res) => {
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

  app.delete("/api/admin/products/:id", requireAdmin, async (req: any, res) => {
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

  // CRUD operations for categories (protected)
  app.put("/api/admin/categories/:id", requireAdmin, async (req: any, res) => {
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

  app.delete("/api/admin/categories/:id", requireAdmin, async (req: any, res) => {
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

  // CRUD operations for news (protected)
  app.put("/api/admin/news/:id", requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid news ID" });
      }
      
      const validatedData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(id, validatedData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid news data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update news" });
    }
  });

  app.delete("/api/admin/news/:id", requireAdmin, async (req: any, res) => {
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

  // Static pages management
  app.get("/api/static-pages", async (req, res) => {
    try {
      const pages = await storage.getStaticPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch static pages" });
    }
  });

  app.get("/api/static-pages/:slug", async (req, res) => {
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

  app.post("/api/admin/static-pages", requireAdmin, async (req: any, res) => {
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

  app.put("/api/admin/static-pages/:slug", requireAdmin, async (req: any, res) => {
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

  // Partners API routes
  app.get("/api/partners", async (req, res) => {
    try {
      const partners = await storage.getPartners();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  app.post("/api/admin/partners", requireAdmin, async (req: any, res) => {
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

  app.put("/api/admin/partners/:id", requireAdmin, async (req: any, res) => {
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

  app.delete("/api/admin/partners/:id", requireAdmin, async (req: any, res) => {
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

  // Homepage content API routes
  app.get("/api/homepage-content", async (req, res) => {
    try {
      const content = await storage.getHomepageContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch homepage content" });
    }
  });

  app.get("/api/homepage-content/:key", async (req, res) => {
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

  app.put("/api/admin/homepage-content/:key", requireAdmin, async (req: any, res) => {
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

  app.post("/api/admin/homepage-content", requireAdmin, async (req: any, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
