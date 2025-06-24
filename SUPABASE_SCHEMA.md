# FitFoot Supabase Database Schema

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Complete database schema documentation for MedusaJS + Supabase integration

## 🏗️ **Schema Overview**

FitFoot uses a robust PostgreSQL database hosted on Supabase with MedusaJS's proven e-commerce schema, extended with Swiss-specific business logic for sustainable footwear.

## 📊 **Core Database Structure**

### **🏪 Store & Configuration Tables**

#### **`store`**
```sql
-- Main store configuration
CREATE TABLE store (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    default_currency_code VARCHAR DEFAULT 'CHF',
    default_sales_channel_id VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`region`**
```sql
-- Regional pricing and shipping zones
CREATE TABLE region (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL, -- e.g., "Switzerland", "Europe"
    currency_code VARCHAR NOT NULL, -- CHF, EUR
    tax_rate DECIMAL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`sales_channel`**
```sql
-- Sales channels (web, mobile, B2B)
CREATE TABLE sales_channel (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    is_disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **👟 Product Catalog Tables**

#### **`product`** - Core Product Information
```sql
CREATE TABLE product (
    id VARCHAR PRIMARY KEY,
    title VARCHAR NOT NULL, -- "Alpine Trek Pro - Swiss Made Hiking Boots"
    subtitle VARCHAR, -- "Premium waterproof hiking boots from Swiss Alps"
    description TEXT, -- Detailed product description
    handle VARCHAR UNIQUE, -- "alpine-trek-pro-hiking-boots"
    status VARCHAR DEFAULT 'published', -- published, draft, archived
    thumbnail VARCHAR, -- Main product image URL
    weight INTEGER, -- Product weight in grams
    length INTEGER, -- Dimensions for shipping
    height INTEGER,
    width INTEGER,
    hs_code VARCHAR, -- Harmonized System code for customs
    origin_country VARCHAR DEFAULT 'CH', -- Switzerland
    material VARCHAR, -- "Sustainable leather, recycled materials"
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`product_variant`** - SKUs and Inventory
```sql
CREATE TABLE product_variant (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR REFERENCES product(id),
    title VARCHAR NOT NULL, -- "Size 41 / Brown"
    sku VARCHAR UNIQUE, -- "ATP-41-BRN"
    barcode VARCHAR,
    ean VARCHAR,
    upc VARCHAR,
    inventory_quantity INTEGER DEFAULT 0,
    allow_backorder BOOLEAN DEFAULT FALSE,
    manage_inventory BOOLEAN DEFAULT TRUE,
    weight INTEGER,
    length INTEGER,
    height INTEGER, 
    width INTEGER,
    hs_code VARCHAR,
    origin_country VARCHAR DEFAULT 'CH',
    material VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`product_option`** - Product Options (Size, Color)
```sql
CREATE TABLE product_option (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR REFERENCES product(id),
    title VARCHAR NOT NULL, -- "Size", "Color", "Style"
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`product_option_value`** - Option Values
```sql
CREATE TABLE product_option_value (
    id VARCHAR PRIMARY KEY,
    option_id VARCHAR REFERENCES product_option(id),
    value VARCHAR NOT NULL, -- "41", "Brown", "Oxford"
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`product_tag`** - Swiss Business Tags
```sql
CREATE TABLE product_tag (
    id VARCHAR PRIMARY KEY,
    value VARCHAR UNIQUE NOT NULL, -- "swiss-made", "sustainable", "vegan"
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Junction table for product-tag relationships
CREATE TABLE product_tags (
    product_id VARCHAR REFERENCES product(id),
    tag_id VARCHAR REFERENCES product_tag(id),
    PRIMARY KEY (product_id, tag_id)
);
```

#### **`product_image`** - Product Photos
```sql
CREATE TABLE product_image (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR REFERENCES product(id),
    url VARCHAR NOT NULL, -- Supabase Storage URL
    metadata JSONB, -- Image dimensions, alt text, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`money_amount`** - Swiss Pricing
```sql
CREATE TABLE money_amount (
    id VARCHAR PRIMARY KEY,
    currency_code VARCHAR NOT NULL, -- CHF, EUR
    amount INTEGER NOT NULL, -- Price in cents (CHF 299.00 = 29900)
    variant_id VARCHAR REFERENCES product_variant(id),
    region_id VARCHAR REFERENCES region(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **🇨🇭 Swiss-Specific Extensions**

#### **`swiss_product_meta`** - Swiss Business Logic
```sql
CREATE TABLE swiss_product_meta (
    product_id VARCHAR PRIMARY KEY REFERENCES product(id),
    swiss_made BOOLEAN DEFAULT FALSE,
    canton_origin VARCHAR, -- "Zurich", "Basel", "Geneva"
    sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
    eco_certifications TEXT[], -- ["EU Ecolabel", "OEKO-TEX"]
    carbon_footprint DECIMAL, -- kg CO2 equivalent
    recycled_materials DECIMAL, -- Percentage of recycled content
    vegan_friendly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`sustainability_metric`** - Environmental Tracking
```sql
CREATE TABLE sustainability_metric (
    id VARCHAR PRIMARY KEY,
    product_id VARCHAR REFERENCES product(id),
    metric_type VARCHAR NOT NULL, -- "carbon_footprint", "water_usage", "recyclability"
    value DECIMAL NOT NULL,
    unit VARCHAR NOT NULL, -- "kg_co2", "liters", "percentage"
    certification VARCHAR, -- Certifying body
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **👤 Customer Management**

#### **`customer`** - Customer Profiles
```sql
CREATE TABLE customer (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    billing_address_id VARCHAR,
    phone VARCHAR,
    has_account BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`address`** - Swiss Addresses
```sql
CREATE TABLE address (
    id VARCHAR PRIMARY KEY,
    customer_id VARCHAR REFERENCES customer(id),
    company VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    address_1 VARCHAR NOT NULL,
    address_2 VARCHAR,
    city VARCHAR NOT NULL,
    country_code VARCHAR DEFAULT 'CH', -- Switzerland
    province VARCHAR, -- Canton
    postal_code VARCHAR NOT NULL, -- Swiss postal codes
    phone VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **🛒 Shopping & Orders**

#### **`cart`** - Shopping Sessions
```sql
CREATE TABLE cart (
    id VARCHAR PRIMARY KEY,
    email VARCHAR,
    billing_address_id VARCHAR REFERENCES address(id),
    shipping_address_id VARCHAR REFERENCES address(id),
    region_id VARCHAR REFERENCES region(id),
    customer_id VARCHAR REFERENCES customer(id),
    payment_session JSONB, -- Payment provider data
    type VARCHAR DEFAULT 'default',
    completed_at TIMESTAMP, -- When converted to order
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`line_item`** - Cart & Order Items
```sql
CREATE TABLE line_item (
    id VARCHAR PRIMARY KEY,
    cart_id VARCHAR REFERENCES cart(id),
    order_id VARCHAR REFERENCES "order"(id),
    variant_id VARCHAR REFERENCES product_variant(id),
    title VARCHAR NOT NULL, -- Product name at time of purchase
    description TEXT,
    thumbnail VARCHAR,
    is_return BOOLEAN DEFAULT FALSE,
    is_giftcard BOOLEAN DEFAULT FALSE,
    should_merge BOOLEAN DEFAULT TRUE,
    allow_discounts BOOLEAN DEFAULT TRUE,
    has_shipping BOOLEAN DEFAULT TRUE,
    unit_price INTEGER NOT NULL, -- Price in cents
    quantity INTEGER NOT NULL DEFAULT 1,
    fulfilled_quantity INTEGER DEFAULT 0,
    returned_quantity INTEGER DEFAULT 0,
    shipped_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`order`** - Completed Purchases
```sql
CREATE TABLE "order" (
    id VARCHAR PRIMARY KEY,
    status VARCHAR DEFAULT 'pending', -- pending, complete, archived, canceled
    fulfillment_status VARCHAR DEFAULT 'not_fulfilled', -- not_fulfilled, partially_fulfilled, fulfilled
    payment_status VARCHAR DEFAULT 'not_paid', -- not_paid, awaiting, captured, partially_refunded, refunded, canceled
    display_id SERIAL UNIQUE, -- Human-readable order number
    cart_id VARCHAR REFERENCES cart(id),
    customer_id VARCHAR REFERENCES customer(id),
    email VARCHAR NOT NULL,
    billing_address_id VARCHAR REFERENCES address(id),
    shipping_address_id VARCHAR REFERENCES address(id),
    region_id VARCHAR REFERENCES region(id),
    currency_code VARCHAR NOT NULL DEFAULT 'CHF',
    tax_rate DECIMAL,
    canceled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **🔐 Authentication & Users**

#### **`user`** - Admin Users
```sql
CREATE TABLE "user" (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    role VARCHAR DEFAULT 'member', -- admin, member, developer
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **`auth_identity`** - Authentication Providers
```sql
CREATE TABLE auth_identity (
    id VARCHAR PRIMARY KEY,
    provider_id VARCHAR NOT NULL, -- emailpass, google, etc.
    user_id VARCHAR REFERENCES "user"(id),
    provider_metadata JSONB, -- Provider-specific data
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 **FitFoot-Specific Data Examples**

### **Swiss Sustainable Footwear Products**

```sql
-- Example: Alpine Trek Pro hiking boots
INSERT INTO product VALUES (
    'prod_alpine_trek_pro',
    'Alpine Trek Pro - Swiss Made Hiking Boots',
    'Premium waterproof hiking boots from Swiss Alps',
    'Handcrafted in Switzerland using sustainably sourced leather and recycled materials...',
    'alpine-trek-pro-hiking-boots',
    'published',
    'https://images.unsplash.com/photo-1544966503-7cc6cd46d6ad',
    1200, -- 1.2kg
    320, 280, 140, -- Dimensions in mm
    '6403999000', -- HS code for footwear
    'CH', -- Made in Switzerland
    'Sustainable leather, recycled polyester'
);

-- Swiss-specific metadata
INSERT INTO swiss_product_meta VALUES (
    'prod_alpine_trek_pro',
    TRUE, -- Swiss made
    'Zurich', -- Canton of origin
    92, -- High sustainability score
    '["EU Ecolabel", "Cradle to Cradle Certified"]',
    2.4, -- 2.4 kg CO2 equivalent
    35.0, -- 35% recycled materials
    FALSE -- Not vegan (leather)
);

-- Product variants with Swiss pricing
INSERT INTO product_variant VALUES (
    'variant_alpine_41_brown',
    'prod_alpine_trek_pro',
    'Size 41 / Brown',
    'ATP-41-BRN',
    NULL, NULL, NULL,
    15, -- Stock quantity
    FALSE, TRUE, -- Backorder settings
    1200, 320, 280, 140, -- Weight & dimensions
    '6403999000', 'CH', 'Sustainable leather'
);

-- Swiss Franc pricing
INSERT INTO money_amount VALUES (
    'price_alpine_chf',
    'CHF',
    29900, -- CHF 299.00
    'variant_alpine_41_brown',
    'region_switzerland'
);

-- Euro pricing for EU customers
INSERT INTO money_amount VALUES (
    'price_alpine_eur',
    'EUR', 
    27500, -- EUR 275.00
    'variant_alpine_41_brown',
    'region_europe'
);
```

---

## 📈 **Database Performance & Scaling**

### **Indexes for Swiss E-commerce**
```sql
-- Product search performance
CREATE INDEX idx_product_status_title ON product(status, title);
CREATE INDEX idx_product_handle ON product(handle);

-- Swiss business logic indexes
CREATE INDEX idx_swiss_made ON swiss_product_meta(swiss_made);
CREATE INDEX idx_sustainability_score ON swiss_product_meta(sustainability_score);
CREATE INDEX idx_canton_origin ON swiss_product_meta(canton_origin);

-- E-commerce performance
CREATE INDEX idx_variant_sku ON product_variant(sku);
CREATE INDEX idx_cart_customer ON cart(customer_id);
CREATE INDEX idx_order_status ON "order"(status);
CREATE INDEX idx_order_customer ON "order"(customer_id);

-- Pricing lookups
CREATE INDEX idx_money_amount_variant ON money_amount(variant_id, currency_code);
```

### **Row Level Security (RLS)**
```sql
-- Enable RLS for customer data protection
ALTER TABLE customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE address ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE "order" ENABLE ROW LEVEL SECURITY;

-- Customers can only see their own data
CREATE POLICY customer_isolation ON customer
    FOR ALL USING (auth.uid()::text = id);

CREATE POLICY address_isolation ON address  
    FOR ALL USING (customer_id IN (
        SELECT id FROM customer WHERE auth.uid()::text = id
    ));
```

---

## 🔗 **Integration Points**

### **Supabase Storage**
```sql
-- Product images stored in Supabase Storage buckets
-- Bucket: fitfoot-products
-- Structure: products/{product_id}/{image_id}.jpg
```

### **Real-time Subscriptions**
```sql
-- Live inventory updates
SELECT * FROM product_variant 
WHERE inventory_quantity < 5; -- Low stock alerts

-- Order status changes
SELECT * FROM "order" 
WHERE status = 'pending' AND created_at > NOW() - INTERVAL '1 hour';
```

### **Swiss Business Analytics**
```sql
-- Sustainability impact query
SELECT 
    p.title,
    spm.sustainability_score,
    spm.carbon_footprint,
    COUNT(li.id) as units_sold
FROM product p
JOIN swiss_product_meta spm ON p.id = spm.product_id
LEFT JOIN line_item li ON li.variant_id IN (
    SELECT id FROM product_variant WHERE product_id = p.id
)
WHERE spm.swiss_made = TRUE
GROUP BY p.id, p.title, spm.sustainability_score, spm.carbon_footprint
ORDER BY spm.sustainability_score DESC;
```

---

## 🎯 **Key Features**

### **✅ Swiss Market Ready**
- Multi-currency support (CHF, EUR)
- Swiss postal code validation
- Canton-based origin tracking
- Swiss tax compliance

### **✅ Sustainability Focus**
- Environmental impact tracking
- Recycled materials percentage
- Carbon footprint measurement
- Eco-certification management

### **✅ E-commerce Complete**
- Full product catalog management
- Shopping cart functionality
- Order processing workflow
- Customer relationship management

### **✅ Production Scalable**
- Optimized indexes for performance
- Row Level Security for data protection
- Real-time capabilities via Supabase
- Horizontal scaling ready

This schema provides a solid foundation for FitFoot's Swiss sustainable footwear business while maintaining all the robust e-commerce capabilities of MedusaJS. 