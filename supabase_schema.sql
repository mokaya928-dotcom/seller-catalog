-- ==============================================================================
-- DAILY POST & KENYAN BEAUTY STORE - SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Create Sellers Table
CREATE TABLE IF NOT EXISTS public.sellers (
    id TEXT PRIMARY KEY,
    shop_name TEXT NOT NULL,
    location TEXT,
    phone TEXT,
    phone_raw TEXT,
    brand_color TEXT DEFAULT '#064e3b',
    brand_secondary TEXT DEFAULT '#047857',
    palette TEXT DEFAULT 'emerald',
    brand_font TEXT DEFAULT 'Cinzel',
    language TEXT DEFAULT 'kenyan_mix',
    mpesa_till TEXT,
    mpesa_type TEXT DEFAULT 'Buy Goods Till',
    delivery_info TEXT,
    pin TEXT DEFAULT '1234',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure pin column exists if sellers table was already created
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS pin TEXT DEFAULT '1234';

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    seller_id TEXT,
    name TEXT NOT NULL,
    size TEXT,
    photo TEXT,
    photos JSONB DEFAULT '[]'::JSONB,
    companion_id TEXT,
    video TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    regular_price NUMERIC,
    benefit_line TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    badge TEXT,
    category TEXT,
    ingredients TEXT,
    how_to_use TEXT,
    highlights JSONB DEFAULT '[]'::JSONB,
    description TEXT,
    original_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Public Access
-- Allow anyone (customers and seller) to read catalog and seller profile
CREATE POLICY "Public read sellers" 
    ON public.sellers FOR SELECT 
    USING (true);

CREATE POLICY "Public read products" 
    ON public.products FOR SELECT 
    USING (true);

-- Allow inserting, updating, and deleting products
CREATE POLICY "Public write products" 
    ON public.products FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Allow updating seller profile
CREATE POLICY "Public write sellers" 
    ON public.sellers FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- 5. Enable Supabase Realtime for instant customer screen refresh
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sellers;

-- 6. Insert Default Seller Profile (Beauty Bar Kenya)
INSERT INTO public.sellers (
    id, shop_name, location, phone, phone_raw, brand_color, brand_secondary, 
    palette, brand_font, language, mpesa_till, mpesa_type, delivery_info
) VALUES (
    'seller_beauty_bar_kenya',
    'The Beauty Bar Kenya',
    'Jamia Mall, Shop F47 (1st Flr), Nairobi CBD',
    '+254 728 222 211',
    '254728222211',
    '#064e3b',
    '#047857',
    'emerald',
    'Cinzel',
    'kenyan_mix',
    '582910',
    'Buy Goods Till',
    'Countrywide Delivery via Wells Fargo / G4S / Boda'
)
ON CONFLICT (id) DO NOTHING;
