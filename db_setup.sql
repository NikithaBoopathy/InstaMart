-- ============================================================
--  INSTAMART - PostgreSQL Database Setup
--  Run this file against your PostgreSQL instance
--  psql -U postgres -f db_setup.sql
-- ============================================================

-- Create database
CREATE DATABASE instamart;
\c instamart;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    phone         VARCHAR(15) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',  -- CUSTOMER | ADMIN
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. ADDRESSES
-- ============================================================
CREATE TABLE addresses (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label       VARCHAR(50),            -- Home, Work, Other
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    pincode     VARCHAR(10) NOT NULL,
    is_default  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) UNIQUE NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    image_url   TEXT,
    description TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. PRODUCTS
-- ============================================================
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES categories(id),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) UNIQUE NOT NULL,
    description     TEXT,
    brand           VARCHAR(100),
    image_url       TEXT,
    price           NUMERIC(10,2) NOT NULL,
    mrp             NUMERIC(10,2) NOT NULL,
    unit            VARCHAR(50),              -- 500g, 1L, 6 pcs etc.
    stock_quantity  INT NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name_search ON products USING gin(to_tsvector('english', name));

-- ============================================================
-- 5. CART
-- ============================================================
CREATE TABLE carts (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id     UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id  UUID NOT NULL REFERENCES products(id),
    quantity    INT NOT NULL DEFAULT 1,
    added_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(cart_id, product_id)
);

-- ============================================================
-- 6. ORDERS
-- ============================================================
CREATE TABLE orders (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id),
    address_id          UUID REFERENCES addresses(id),

    -- Pricing snapshot
    subtotal            NUMERIC(10,2) NOT NULL,
    delivery_fee        NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount            NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount        NUMERIC(10,2) NOT NULL,

    -- Status
    status              VARCHAR(30) NOT NULL DEFAULT 'PLACED',
    -- PLACED | CONFIRMED | PACKED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED

    -- Payment
    payment_method      VARCHAR(30) DEFAULT 'MOCK',
    payment_status      VARCHAR(20) DEFAULT 'PENDING',  -- PENDING | PAID | FAILED
    payment_ref         VARCHAR(100),

    -- Delivery
    estimated_delivery  TIMESTAMP,
    delivered_at        TIMESTAMP,
    notes               TEXT,

    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- ============================================================
-- 7. ORDER ITEMS (snapshot of product at order time)
-- ============================================================
CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      UUID NOT NULL REFERENCES products(id),
    product_name    VARCHAR(255) NOT NULL,   -- snapshot
    product_image   TEXT,                    -- snapshot
    unit            VARCHAR(50),             -- snapshot
    unit_price      NUMERIC(10,2) NOT NULL,  -- snapshot
    quantity        INT NOT NULL,
    total_price     NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- 8. ORDER STATUS HISTORY (for tracking timeline)
-- ============================================================
CREATE TABLE order_status_history (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status      VARCHAR(30) NOT NULL,
    message     TEXT,
    changed_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, image_url, sort_order) VALUES
('Fruits & Vegetables',  'fruits-vegetables',  'https://cdn-icons-png.flaticon.com/512/2153/2153788.png', 1),
('Dairy & Eggs',          'dairy-eggs',          'https://cdn-icons-png.flaticon.com/512/3050/3050158.png', 2),
('Snacks & Beverages',    'snacks-beverages',    'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', 3),
('Bakery',                'bakery',              'https://cdn-icons-png.flaticon.com/512/3009/3009368.png', 4),
('Cleaning & Household',  'cleaning-household',  'https://cdn-icons-png.flaticon.com/512/2271/2271099.png', 5),
('Personal Care',         'personal-care',       'https://cdn-icons-png.flaticon.com/512/2553/2553651.png', 6);

-- Products
INSERT INTO products (category_id, name, slug, brand, price, mrp, unit, stock_quantity, is_featured, image_url) VALUES
-- Fruits & Vegetables
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Tomatoes', 'tomatoes', 'Fresh Farm', 29.00, 35.00, '500g', 100, true,  'https://cdn-icons-png.flaticon.com/512/1135/1135513.png'),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Onions',   'onions',   'Fresh Farm', 25.00, 30.00, '1kg',  150, false, 'https://cdn-icons-png.flaticon.com/512/2286/2286007.png'),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Bananas',  'bananas',  'Fresh Farm', 49.00, 55.00, '6 pcs',80,  true,  'https://cdn-icons-png.flaticon.com/512/1135/1135510.png'),
-- Dairy & Eggs
((SELECT id FROM categories WHERE slug='dairy-eggs'), 'Amul Milk',      'amul-milk',      'Amul',    60.00, 60.00, '1L',   200, true,  'https://cdn-icons-png.flaticon.com/512/3050/3050158.png'),
((SELECT id FROM categories WHERE slug='dairy-eggs'), 'Eggs (White)',   'eggs-white',     'Suguna',  90.00, 95.00, '12 pcs',120,true,  'https://cdn-icons-png.flaticon.com/512/2674/2674478.png'),
((SELECT id FROM categories WHERE slug='dairy-eggs'), 'Paneer',         'paneer',         'Amul',   100.00,110.00, '200g', 60,  false, 'https://cdn-icons-png.flaticon.com/512/3050/3050163.png'),
-- Snacks & Beverages
((SELECT id FROM categories WHERE slug='snacks-beverages'), 'Lay''s Classic',  'lays-classic',  'Lay''s', 20.00, 20.00, '52g',  300, true,  'https://cdn-icons-png.flaticon.com/512/3081/3081559.png'),
((SELECT id FROM categories WHERE slug='snacks-beverages'), 'Coca-Cola',       'coca-cola',     'Coca-Cola',40.00,45.00,'750ml', 250, true,  'https://cdn-icons-png.flaticon.com/512/2738/2738731.png'),
-- Bakery
((SELECT id FROM categories WHERE slug='bakery'), 'Britannia Bread',  'britannia-bread',  'Britannia', 45.00, 48.00, '400g', 80, true, 'https://cdn-icons-png.flaticon.com/512/3009/3009368.png'),
-- Cleaning
((SELECT id FROM categories WHERE slug='cleaning-household'), 'Surf Excel',  'surf-excel',  'HUL',  180.00, 190.00, '1kg', 90, false, 'https://cdn-icons-png.flaticon.com/512/2271/2271099.png'),
-- Personal Care
((SELECT id FROM categories WHERE slug='personal-care'), 'Dove Soap',  'dove-soap',  'Dove',  55.00, 60.00, '100g', 200, true, 'https://cdn-icons-png.flaticon.com/512/2553/2553651.png');

-- Admin user (password: Admin@123  → bcrypt hash)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Admin', 'admin@instamart.com', '9999999999',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
 'ADMIN');

-- ============================================================
-- HELPER VIEWS
-- ============================================================
CREATE OR REPLACE VIEW order_summary AS
SELECT
    o.id,
    o.created_at,
    u.name  AS customer_name,
    u.email AS customer_email,
    o.total_amount,
    o.status,
    o.payment_status,
    COUNT(oi.id) AS item_count
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, u.name, u.email;

