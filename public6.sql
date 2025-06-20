/*
 Navicat PostgreSQL Dump SQL

 Source Server         : ep-winter-sunset-a29vyigh.eu-central-1.aws.neon.tech_5432
 Source Server Type    : PostgreSQL
 Source Server Version : 160009 (160009)
 Source Host           : ep-winter-sunset-a29vyigh.eu-central-1.aws.neon.tech:5432
 Source Catalog        : neondb
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 160009 (160009)
 File Encoding         : 65001

 Date: 11/06/2025 22:18:13
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
INSERT INTO "public"."admins" VALUES (1, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', '2025-06-11 17:57:46.514551');

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
INSERT INTO "public"."articles" VALUES (1, 'Статья1', 'фывфывфыв
фывфывфыа
ыва
ыпапаывпавпыварапврап
врапвравправпр
авправпраравправпр
варпврпарварпавправравравпр', 'Краткое описание', '', '2025-06-11 19:03:43.628238');

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
INSERT INTO "public"."categories" VALUES (3, 'Тестовая категория', 'Тестовое описание категории', 'Zap');

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
INSERT INTO "public"."news" VALUES (1, 'новость1', ' фывф ывфы фвфы
вфывфывфыв
фывфывфыв

фывфывфывфывфыв
фывфывфывфывфыв', 'фывфывфыв', 'https://images.squarespace-cdn.com/content/v1/5893b891725e2570d8cbf215/1638035549651-9JEESM6P8MHMA3EIGWCR/SHORPY_crazyradio.jpg', '2025-06-11 19:01:04.236446');

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
INSERT INTO "public"."products" VALUES (3, 'Тестовый товар', 'Описание тестового товара', 1, NULL, '1000 руб', NULL, 'f', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-11 18:54:54.678323', '2025-06-11 18:54:54.678323');
INSERT INTO "public"."products" VALUES (4, 'Тестовый товар2', 'Короткое описание этого товара
Блаблабал', 1, NULL, 'По запросу', '', 't', '{"111":"222","123":"321","321":"123"}', '', 'ТестовойБренд', NULL, NULL, '<p><strong>Подробное описание с форматированием</strong><br><br>вфывфыв</p><p>фывфыфвафыаывпвпыв</p><p>пвпваыпывапывпывп</p>', '<p>фывфывфывавфыаыа</p><p>фафывафывафываыва</p>', '2025-06-11 19:12:42.096469', '2025-06-11 19:12:42.096469');

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
INSERT INTO "public"."sessions" VALUES ('bbacdb9898ca5ce0f3b898ec1aefdbf6c70920b82658e4d417ad96cca7f83ee5', 1, '2025-06-12 17:59:36.938', '2025-06-11 17:59:36.971716');
INSERT INTO "public"."sessions" VALUES ('e4b7c60b89ac598017133cf53e2d7187b59c868b96ec43047e10ef69673f66d1', 1, '2025-06-12 18:37:52.234', '2025-06-11 18:37:52.28944');

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
INSERT INTO "public"."static_pages" VALUES (1, 'ываываыв', 'фывфыв', 'фывфыв', 'фывфывфв', 'фывфывфы', '2025-06-11 19:03:57.852735');

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
INSERT INTO "public"."users" VALUES (1, 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');

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
SELECT setval('"public"."articles_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."categories_id_seq"
OWNED BY "public"."categories"."id";
SELECT setval('"public"."categories_id_seq"', 3, true);

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
SELECT setval('"public"."news_id_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."products_id_seq"
OWNED BY "public"."products"."id";
SELECT setval('"public"."products_id_seq"', 4, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."static_pages_id_seq"
OWNED BY "public"."static_pages"."id";
SELECT setval('"public"."static_pages_id_seq"', 1, true);

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
SELECT setval('"public"."users_id_seq"', 1, true);

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
