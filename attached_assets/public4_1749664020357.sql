/*
 Navicat PostgreSQL Dump SQL

 Source Server         : 4444
 Source Server Type    : PostgreSQL
 Source Server Version : 160009 (160009)
 Source Host           : ep-proud-feather-a5rhwo4r.us-east-2.aws.neon.tech:5432
 Source Catalog        : neondb
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 160009 (160009)
 File Encoding         : 65001

 Date: 11/06/2025 20:35:48
*/


-- ----------------------------
-- Sequence structure for admins_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."admins_id_seq";
CREATE SEQUENCE "public"."admins_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for articles_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."articles_id_seq";
CREATE SEQUENCE "public"."articles_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for categories_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."categories_id_seq";
CREATE SEQUENCE "public"."categories_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for inquiries_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."inquiries_id_seq";
CREATE SEQUENCE "public"."inquiries_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for news_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."news_id_seq";
CREATE SEQUENCE "public"."news_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for products_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."products_id_seq";
CREATE SEQUENCE "public"."products_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for static_pages_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."static_pages_id_seq";
CREATE SEQUENCE "public"."static_pages_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for subcategories_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."subcategories_id_seq";
CREATE SEQUENCE "public"."subcategories_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS "public"."admins";
CREATE TABLE "public"."admins" (
  "id" int4 NOT NULL DEFAULT nextval('admins_id_seq'::regclass),
  "username" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of admins
-- ----------------------------
INSERT INTO "public"."admins" VALUES (1, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', '2025-06-11 15:13:32.659024');

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS "public"."articles";
CREATE TABLE "public"."articles" (
  "id" int4 NOT NULL DEFAULT nextval('articles_id_seq'::regclass),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "excerpt" text COLLATE "pg_catalog"."default",
  "image_url" text COLLATE "pg_catalog"."default",
  "published_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of articles
-- ----------------------------

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS "public"."categories";
CREATE TABLE "public"."categories" (
  "id" int4 NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "icon" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO "public"."categories" VALUES (1, 'Электротехническое оборудование', 'Широкий ассортимент электротехнического оборудования', 'Zap');
INSERT INTO "public"."categories" VALUES (2, 'Аккумуляторные батареи', 'Аккумуляторы и зарядные устройства', 'Battery');

-- ----------------------------
-- Table structure for inquiries
-- ----------------------------
DROP TABLE IF EXISTS "public"."inquiries";
CREATE TABLE "public"."inquiries" (
  "id" int4 NOT NULL DEFAULT nextval('inquiries_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" text COLLATE "pg_catalog"."default" NOT NULL,
  "phone" text COLLATE "pg_catalog"."default",
  "company" text COLLATE "pg_catalog"."default",
  "message" text COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of inquiries
-- ----------------------------

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS "public"."news";
CREATE TABLE "public"."news" (
  "id" int4 NOT NULL DEFAULT nextval('news_id_seq'::regclass),
  "title" text COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "excerpt" text COLLATE "pg_catalog"."default",
  "image_url" text COLLATE "pg_catalog"."default",
  "published_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of news
-- ----------------------------

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS "public"."products";
CREATE TABLE "public"."products" (
  "id" int4 NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "category_id" int4 NOT NULL,
  "subcategory_id" int4,
  "price" text COLLATE "pg_catalog"."default",
  "image_url" text COLLATE "pg_catalog"."default",
  "featured" bool DEFAULT false,
  "specifications" text COLLATE "pg_catalog"."default",
  "model" text COLLATE "pg_catalog"."default",
  "brand" text COLLATE "pg_catalog"."default",
  "images" text[] COLLATE "pg_catalog"."default",
  "files" text[] COLLATE "pg_catalog"."default",
  "detailed_description" text COLLATE "pg_catalog"."default",
  "warranty" text COLLATE "pg_catalog"."default",
  "created_at" timestamp(6) DEFAULT now(),
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of products
-- ----------------------------
INSERT INTO "public"."products" VALUES (1, '12312', '11111', 2, NULL, '111', '', 'f', '', '11111', '12312', NULL, NULL, NULL, NULL, '2025-06-11 16:48:51.808579', '2025-06-11 16:48:51.808579');
INSERT INTO "public"."products" VALUES (2, 'Изолятор линейный подвесной 500 кВ', 'Высоковольтный полимерный изолятор для линий электропередачи 500 кВ', 1, NULL, 'По запросу', NULL, 't', '{"Номинальное напряжение": "500 кВ", "Номинальная нагрузка": "300 кН", "Длина изолятора": "4500 мм", "Диаметр большого ребра": "380 мм", "Материал стержня": "Стеклопластик", "Материал оболочки": "Силиконовая резина", "Класс защиты": "IP65", "Температурный диапазон": "-60°C до +50°C"}', 'ИП-500-3/7500', 'ЗАО Курс', '{https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800,https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800,https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800}', '{"Паспорт изделия ИП-500.pdf","Сертификат соответствия.pdf","Инструкция по монтажу.pdf"}', '<h2>Подробное описание</h2><p>Изолятор линейный подвесной ИП-500-3/7500 предназначен для изоляции токоведущих частей воздушных линий электропередачи от заземленных опор при номинальном напряжении 500 кВ.</p><h3>Особенности конструкции:</h3><ul><li>Композитный стержень из стеклопластика обеспечивает высокую механическую прочность</li><li>Силиконовая оболочка с увеличенной длиной пути утечки</li><li>Арматура из горячеоцинкованной стали</li><li>Устойчивость к воздействию ультрафиолета и озона</li></ul><h3>Применение:</h3><p>Изоляторы устанавливаются на воздушных линиях электропередачи напряжением 500 кВ в различных климатических условиях, включая районы с повышенной загрязненностью атмосферы.</p>', '<h2>Гарантия и обслуживание</h2><p><strong>Гарантийный срок:</strong> 25 лет с момента изготовления</p><h3>Гарантийные обязательства:</h3><ul><li>Замена изделия при обнаружении производственных дефектов</li><li>Техническая поддержка в течение всего срока эксплуатации</li><li>Консультации по монтажу и обслуживанию</li></ul><h3>Условия возврата:</h3><p>Возврат товара возможен в течение 30 дней с момента поставки при условии:</p><ol><li>Сохранение товарного вида и упаковки</li><li>Отсутствие следов монтажа или эксплуатации</li><li>Наличие сопроводительных документов</li></ol><p><strong>Внимание:</strong> Изделия, изготовленные по индивидуальным техническим требованиям, возврату не подлежат.</p>', '2025-06-11 17:31:53.495255', '2025-06-11 17:31:53.495255');

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."sessions";
CREATE TABLE "public"."sessions" (
  "id" text COLLATE "pg_catalog"."default" NOT NULL,
  "admin_id" int4 NOT NULL,
  "expires_at" timestamp(6) NOT NULL,
  "created_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO "public"."sessions" VALUES ('de6412fa04f794859139405d0e573689d71f07e23ed727df273ccbc2789ad5db', 1, '2025-06-12 16:14:11.281', '2025-06-11 16:14:11.293198');
INSERT INTO "public"."sessions" VALUES ('c4c604609bc81138888690ea538adada97d0763a67dc369432bc59dc42486959', 1, '2025-06-12 16:21:46.542', '2025-06-11 16:21:46.556083');
INSERT INTO "public"."sessions" VALUES ('da61a02201af8f1dbaf49061df615a023f73413de0cce502576bf1f6a94ff4c7', 1, '2025-06-12 17:00:21.048', '2025-06-11 17:00:21.107248');
INSERT INTO "public"."sessions" VALUES ('185e59dafde75fb830fc183c9c48efc160d2555deb60d3d39d07f51c5dc68708', 1, '2025-06-12 17:30:41.13', '2025-06-11 17:30:41.144532');

-- ----------------------------
-- Table structure for static_pages
-- ----------------------------
DROP TABLE IF EXISTS "public"."static_pages";
CREATE TABLE "public"."static_pages" (
  "id" int4 NOT NULL DEFAULT nextval('static_pages_id_seq'::regclass),
  "slug" text COLLATE "pg_catalog"."default" NOT NULL,
  "title_ru" text COLLATE "pg_catalog"."default" NOT NULL,
  "title_en" text COLLATE "pg_catalog"."default" NOT NULL,
  "content_ru" text COLLATE "pg_catalog"."default" NOT NULL,
  "content_en" text COLLATE "pg_catalog"."default" NOT NULL,
  "updated_at" timestamp(6) DEFAULT now()
)
;

-- ----------------------------
-- Records of static_pages
-- ----------------------------

-- ----------------------------
-- Table structure for subcategories
-- ----------------------------
DROP TABLE IF EXISTS "public"."subcategories";
CREATE TABLE "public"."subcategories" (
  "id" int4 NOT NULL DEFAULT nextval('subcategories_id_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "category_id" int4 NOT NULL,
  "description" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Records of subcategories
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "username" text COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Records of users
-- ----------------------------

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."admins_id_seq"
OWNED BY "public"."admins"."id";
SELECT setval('"public"."admins_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."articles_id_seq"
OWNED BY "public"."articles"."id";
SELECT setval('"public"."articles_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."categories_id_seq"
OWNED BY "public"."categories"."id";
SELECT setval('"public"."categories_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."inquiries_id_seq"
OWNED BY "public"."inquiries"."id";
SELECT setval('"public"."inquiries_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."news_id_seq"
OWNED BY "public"."news"."id";
SELECT setval('"public"."news_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."products_id_seq"
OWNED BY "public"."products"."id";
SELECT setval('"public"."products_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."static_pages_id_seq"
OWNED BY "public"."static_pages"."id";
SELECT setval('"public"."static_pages_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."subcategories_id_seq"
OWNED BY "public"."subcategories"."id";
SELECT setval('"public"."subcategories_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 1, false);

-- ----------------------------
-- Uniques structure for table admins
-- ----------------------------
ALTER TABLE "public"."admins" ADD CONSTRAINT "admins_username_unique" UNIQUE ("username");

-- ----------------------------
-- Primary Key structure for table admins
-- ----------------------------
ALTER TABLE "public"."admins" ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table articles
-- ----------------------------
ALTER TABLE "public"."articles" ADD CONSTRAINT "articles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table categories
-- ----------------------------
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table inquiries
-- ----------------------------
ALTER TABLE "public"."inquiries" ADD CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table news
-- ----------------------------
ALTER TABLE "public"."news" ADD CONSTRAINT "news_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table products
-- ----------------------------
ALTER TABLE "public"."products" ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table static_pages
-- ----------------------------
ALTER TABLE "public"."static_pages" ADD CONSTRAINT "static_pages_slug_unique" UNIQUE ("slug");

-- ----------------------------
-- Primary Key structure for table static_pages
-- ----------------------------
ALTER TABLE "public"."static_pages" ADD CONSTRAINT "static_pages_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table subcategories
-- ----------------------------
ALTER TABLE "public"."subcategories" ADD CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_username_unique" UNIQUE ("username");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
