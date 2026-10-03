/**
 * Starter Data for Beauty Bar Kenya & Kenyan Beauty Sellers
 * Real live products fetched directly from https://thebeautybarkenya.com/
 * with local offline images in public/products/, accurate KES prices, and M-Pesa verification.
 */

export const TIME_SLOTS = [
  { id: 'morning_rush', time: '09:00 AM', label: 'Morning Commute & Office Browse', icon: 'Sun' },
  { id: 'lunch_break', time: '12:30 PM', label: 'Lunchtime Shoppers & Quick Inquiries', icon: 'Clock' },
  { id: 'afternoon_boost', time: '03:30 PM', label: 'Afternoon Pick-Me-Up & Payday Restock', icon: 'Sparkles' },
  { id: 'evening_transit', time: '06:30 PM', label: 'Evening Commute & Matatu Scrolling', icon: 'Sunset' },
  { id: 'bedtime_orders', time: '08:45 PM', label: 'Bedtime Browsing & Next-Day Delivery Orders', icon: 'Moon' }
];

export const BEAUTY_BAR_SELLER = {
  id: 'seller_beauty_bar_kenya',
  shop_name: 'The Beauty Bar Kenya',
  location: 'Jamia Mall, Shop F47 (1st Flr), Nairobi CBD',
  phone: '+254 728 222 211',
  phone_raw: '254728222211',
  brand_color: '#064e3b',
  brand_secondary: '#047857',
  palette: 'emerald', // 'emerald' (Unified Emerald & Gold) or 'slate' (Luxury Slate & Gold)
  brand_font: 'Cinzel',
  language: 'kenyan_mix',
  mpesa_till: '582910',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Countrywide Delivery via Wells Fargo / G4S / Boda'
};

export const DEFAULT_SELLER = BEAUTY_BAR_SELLER;

export const GLOW_HOUSE_SELLER = {
  id: 'seller_glow_house',
  shop_name: 'Glow House Cosmetics Kakamega',
  location: 'Mega Mall Ground Floor, Kakamega Town',
  phone: '+254 712 345 678',
  phone_raw: '254712345678',
  brand_color: '#047857',
  brand_secondary: '#065f46',
  brand_font: 'Cinzel',
  language: 'kenyan_mix',
  mpesa_till: '482019',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Kakamega Town Pick-up & Western Kenya Parcels'
};

export const HALAL_BEAUTY_SELLER = {
  id: 'seller_halal_beauty_047',
  shop_name: 'Halal Beauty Products Shop',
  location: 'Eastleigh / Jamia Mall, Nairobi',
  phone: '+254 747 000 047',
  phone_raw: '254747000047',
  brand_color: '#047857',
  brand_secondary: '#065f46',
  brand_font: 'Cinzel',
  language: 'swahili',
  mpesa_till: '901234',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Nairobi Same-Day & Countrywide Delivery'
};


export const MOH_037_SELLER = {
  id: 'seller_moh_037',
  shop_name: 'MOH 037 Collection ❤️',
  location: "Kakamega Town (037) • Delivery Countrywide",
  phone: '+254 712 345 037',
  phone_raw: '254712345037',
  brand_color: '#be185d',
  brand_secondary: '#881337',
  brand_font: 'Cinzel',
  language: 'kenyan_mix',
  mpesa_till: '637019',
  mpesa_type: 'Buy Goods Till',
  delivery_info: "Owira's Collection & Households • Kakamega Pickup & Countrywide Delivery"
};

export const GLOWND_SELLER = {
  id: 'seller_glownd',
  shop_name: 'GLOWND Bags & Luxury Handbags',
  location: 'Nairobi CBD, Kenya • Countrywide Delivery',
  phone: '+254 707 124 567',
  phone_raw: '254707124567',
  brand_color: '#fa31df',
  brand_secondary: '#18181b',
  palette: 'luxury_slate',
  brand_font: 'Cinzel',
  language: 'kenyan_mix',
  mpesa_till: '707124',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Nairobi Same-Day Boda & Countrywide Parcels via Fargo / G4S'
};

import orewaProductsData from './orewaProducts.json';
import digitalStoreProductsData from './digitalStoreProducts.json';

export const OREWA_PRODUCTS = orewaProductsData;

export const OREWA_SELLER = {
  id: 'seller_orewa_limited',
  shop_name: 'Orewa Limited',
  location: 'Nairobi CBD • 2-hr Express Delivery | Countrywide Dispatch',
  phone: '+254 118 926 934',
  phone_raw: '254118926934',
  brand_color: '#0e5e6f',
  brand_secondary: '#e5a93b',
  palette: 'deep_teal_gold',
  brand_font: 'Outfit',
  language: 'kenyan_mix',
  mpesa_till: '118926',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Same-day 2-hr delivery in Nairobi • Fast countrywide dispatch • Pay on Delivery available',
  website: 'https://orewa.co.ke'
};

export const DIGITAL_STORE_PRODUCTS = digitalStoreProductsData;

export const DIGITAL_STORE_SELLER = {
  id: 'seller_digital_store_kenya',
  shop_name: 'Digital Store Kenya',
  location: 'Bihi Towers, Basement 1, Shop B10, Moi Avenue, Nairobi',
  phone: '+254 718 263 833',
  phone_raw: '254718263833',
  brand_color: '#0284c7',
  brand_secondary: '#0f172a',
  palette: 'midnight_navy_amber',
  brand_font: 'Outfit',
  language: 'kenyan_mix',
  mpesa_till: '718263',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Nairobi Same-Day 2-Hour Delivery • Countrywide Courier Dispatch • 1-Year Local Warranty Included',
  website: 'https://digitalstore.co.ke'
};


export const SHOE_IN_SELLER = {
  id: 'seller_shoe_in_kenya',
  shop_name: 'Shoe-In Kenya | Kicks & Loafers',
  location: 'Imenti House / CBD, Nairobi • Delivery Across Kenya',
  phone: '+254 712 345 999',
  phone_raw: '254712345999',
  brand_color: '#0f172a',
  brand_secondary: '#1e293b',
  palette: 'midnight_navy_amber',
  brand_font: 'Outfit',
  language: 'kenyan_mix',
  mpesa_till: '782910',
  mpesa_type: 'Buy Goods Till',
  delivery_info: 'Same-day Nairobi Boda & Countrywide Delivery via Wells Fargo / G4S'
};

export const CURATED_PRODUCTS = [
{
    "id": "prod_shoein_john_foster_woven_vamp_loafer_bl",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Woven Vamp Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/WhatsApp%20Image%202026-09-09%20at%2017.40.41.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster woven-vamp loafer in black and brown leather with a classic penny strap and textured finish.",
    "in_stock": true,
    "featured": true,
    "badge": "Bestseller 🔥",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Woven Vamp Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_classic_slip_on_loaf",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Classic Slip On Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/WhatsApp%20Image%202026-09-09%20at%2017.40.41.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Classic Slip-On Loafer in Black leather, featuring a stitched apron toe and refined profile.",
    "in_stock": true,
    "featured": true,
    "badge": "New Arrival ⚡",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Classic Slip On Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_textured_strap_loafe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Textured Strap Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/WhatsApp%20Image%202026-09-09%20at%2017.40.41.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Textured Strap Loafer in black leather with a textured strap across the vamp for understated style.",
    "in_stock": true,
    "featured": true,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Textured Strap Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_horsebit_loafer_blac",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Horsebit Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/jfs2brown.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/jfs1.webp"
    ],
    "colors": [
      "Black",
      "Dark-tan",
      "Dark Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Black, Dark-tan & Dark Brown • Handcrafted genuine leather",
    "in_stock": true,
    "featured": true,
    "badge": "3 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Black, Dark-tan, Dark Brown",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Horsebit Loafer. Available in Black, Dark-tan, Dark Brown. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_minimal_slip_on_leather_sneaker_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Minimal Slip On Leather Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/san%20marinagrey.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Minimal Slip-On Leather Sneaker in Black by Storeez, sleek low-profile leather.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Minimal Slip On Leather Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_marco_cardini_cap_toe_oxford_dar",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Cap Toe Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/WhatsApp%20Image%202026-09-09%20at%2017.40.41.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/WhatsApp%20Image%202026-09-09%20at%2017.40.41.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/marco.webp"
    ],
    "colors": [
      "Dark Brown",
      "Brown"
    ],
    "price": 6000,
    "regular_price": 7100,
    "benefit_line": "Available in Dark Brown & Brown • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Dark Brown, Brown",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Cap Toe Oxford. Available in Dark Brown, Brown. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_brown_leather_cap_toe_brogue_oxf",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Leather Cap Toe Brogue Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/MAR.png",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/MAR.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Dark brown leather cap-toe brogue Oxford with classic perforated detailing.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Leather Cap Toe Brogue Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_santoni_horsebit_leather_loafer_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Santoni Horsebit Leather Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/santoni1.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/santoni1.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Santoni horsebit leather loafer in black with pebble-grain upper, metal horseb.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Santoni Horsebit Leather Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_santoni_leather_loafer_dark_brow",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Santoni Leather Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/santoni2.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/santoni2.jpeg"
    ],
    "colors": [
      "Dark Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Santoni Leather Loafer in dark brown leather with contrast white midsole and.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Santoni Leather Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_black_striped_leather_loafer",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Striped Leather Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Black%20Striped%20Leather%20Loafer.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Black%20Striped%20Leather%20Loafer.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Black Striped Leather Loafer from Shoe-In: sleek black leather loafer with.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Striped Leather Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_perforated_leather_loafer",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Perforated Leather Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Clarks%20Perforated%20Leather%20Loafer%20Black.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Clarks%20Perforated%20Leather%20Loafer%20Black.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Polished black Clarks leather loafer with a perforated vamp, braided strap.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Perforated Leather Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_billionaire_suede_loafer_black",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Billionaire Suede Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Billionaire%20Suede%20Loafer%20Black.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Billionaire%20Suede%20Loafer%20Black.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Billionaire Suede Loafer Black: a sleek penny loafer in black suede with stitc.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Billionaire Suede Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_minimal_leather_sneaker_white",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Minimal Leather Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/san%20marinagrey.jpeg"
    ],
    "colors": [
      "White"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Minimal Leather Sneaker in white - low-profile lace-up silhouette with smooth.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Minimal Leather Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_zopo_low_top_sneaker_tan_brown",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Zopo Low Top Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/san%20marinagrey.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopowhite.jpeg"
    ],
    "colors": [
      "Brown",
      "Black",
      "White"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Available in Brown, Black & White • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "3 COLORS AVAILABLE",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Brown, Black, White",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Zopo Low Top Sneaker. Available in Brown, Black, White. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_san_marina_leather_sneaker_light",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "San Marina Leather Sneaker Light",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/san%20marinagrey.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/san%20marinagrey.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "Grey"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "San Marina leather sneaker in light grey offers a clean low-top silhouette.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "San Marina Leather Sneaker Light. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_zopo_low_top_sneaker_khaki",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Zopo Low Top Sneaker Khaki",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopokahki.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopokahki.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Khaki Zopo low-top sneaker in soft suede with brown accents and a white sole —.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Zopo Low Top Sneaker Khaki. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_zopo_low_top_sneaker_navy_blue",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Zopo Low Top Sneaker Blue",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopoblue.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopoblue.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "Navy"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Zopo low-top sneaker in navy suede with white sole, clean minimalist profile.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Zopo Low Top Sneaker Blue. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_adidas_handball_spezia",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Adidas Handball Spezia",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/sneakers/sambasapezia.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/sneakers/sambasapezia.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [],
    "price": 4200,
    "regular_price": 5000,
    "benefit_line": "Adidas Handball Spezia is a Grey finish with suede construction boot selected.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Adidas Handball Spezia. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_new_balance_530",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "New Balance 530",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/sneakers/noke.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/sneakers/noke.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [],
    "price": 4000,
    "regular_price": 4700,
    "benefit_line": "New Balance 530 is a White finish with leather construction boot selected.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "New Balance 530. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_white_smooth_leather_sneaker",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "smooth leather sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/White%20smooth%20leather%20sneaker.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/White%20smooth%20leather%20sneaker.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "White"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "White smooth leather sneaker with a clean low-top silhouette for smart-casual.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "smooth leather sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_white_textured_sneaker",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "textured sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/White%20textured%20sneaker.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/White%20textured%20sneaker.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "White"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Clean white textured sneaker in leather from Aldo, featuring subtle stitch.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "textured sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_zara_black_leather_suede_casual_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Zara Leather Suede Casual Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/zara.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/zara.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/zara1.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Zara Black Leather & Suede Casual Sneaker is a Black finish with leather const.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Zara Leather Suede Casual Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_aldo_white_leather_green_lining_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Aldo Leather Green Lining Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/Aldo%20White%20Leather%20Green%20Lining.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/Aldo%20White%20Leather%20Green%20Lining.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "White"
    ],
    "price": 4798,
    "regular_price": 5700,
    "benefit_line": "White Aldo leather sneaker with green lining detail and a clean low-top profil.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Aldo Leather Green Lining Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_aldo_black_leather_sneaker",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Aldo Leather Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/black-aldo.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/black-aldo.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/aldo-plain%20white.webp"
    ],
    "colors": [
      "Black",
      "White"
    ],
    "price": 4794,
    "regular_price": 5700,
    "benefit_line": "Available in Black & White • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Black, White",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Aldo Leather Sneaker. Available in Black, White. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_aldo_white_navy_premium_sneaker",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Aldo Premium Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/Aldo%20White%20%26%20Navy.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/Aldo%20White%20%26%20Navy.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/also-black-13.webp"
    ],
    "colors": [
      "Navy",
      "Black"
    ],
    "price": 4797,
    "regular_price": 5700,
    "benefit_line": "Available in Navy & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Navy, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Aldo Premium Sneaker. Available in Navy, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_aldo_white_textured_sneaker",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Aldo Textured Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/aldo-textered-white.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/aldo-textered-white.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "White"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Aldo White Textured Sneaker is a White finish with leather construction boot.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Aldo Textured Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_aldo_grey_luxe_sneaker",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Aldo Luxe Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/aldo-12-grey.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/aldo-12-grey.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "Grey"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Aldo Grey Luxe Sneaker is a Grey finish with leather construction boot selecte.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Aldo Luxe Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_aldo_white_premium_court_sneaker",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Aldo Premium Court Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/aldo%20white-11.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Sneakers/aldo%20white-11.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "White"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Aldo White Premium Court Sneaker is a White finish with leather construction.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Aldo Premium Court Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_asics_gel_1130_white_red_runner",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ASICS GEL 1130 Red Runner",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779822123896-3200f52e-58ee-4df9-9c49-b2e4956e0316.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779822123896-3200f52e-58ee-4df9-9c49-b2e4956e0316.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "White"
    ],
    "price": 4200,
    "regular_price": 5000,
    "benefit_line": "Bold retro runner featuring breathable white mesh with red sporty accents.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ASICS GEL 1130 Red Runner. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_asics_gel_1130_white_green_runne",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ASICS GEL 1130 Green Runner",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779822270352-4df484ec-2668-4ca9-862c-a0f0ca8c1352.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779822270352-4df484ec-2668-4ca9-862c-a0f0ca8c1352.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "White"
    ],
    "price": 4200,
    "regular_price": 5000,
    "benefit_line": "Retro-inspired ASICS sneaker featuring white mesh construction with green spor.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ASICS GEL 1130 Green Runner. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_asics_gel_1130_triple_black_runn",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ASICS GEL 1130 Triple Runner",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779822305349-33b55034-0e4c-4dce-9aeb-ed62e57f0582.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779822305349-33b55034-0e4c-4dce-9aeb-ed62e57f0582.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 4200,
    "regular_price": 5000,
    "benefit_line": "Minimalist triple-black retro sneaker with breathable comfort and modern stree.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ASICS GEL 1130 Triple Runner. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_asics_gel_1130_silver_grey_runne",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ASICS GEL 1130 Silver Runner",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779822332429-58920aed-5da2-4cb1-b6f3-c62c7b2e0725.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779822332429-58920aed-5da2-4cb1-b6f3-c62c7b2e0725.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/black%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/white%20sneaker.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/zopo%20black.jpeg"
    ],
    "colors": [
      "Grey"
    ],
    "price": 4200,
    "regular_price": 5000,
    "benefit_line": "Premium retro-inspired ASICS runner featuring breathable mesh, lightweight.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ASICS GEL 1130 Silver Runner. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_marco_cardini_leather_derby_shoe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Leather Derby Shoes",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/sept%205/7981e405-027a-47c0-8e76-4dffc6be4d0d.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/sept%205/7981e405-027a-47c0-8e76-4dffc6be4d0d.jpeg"
    ],
    "colors": [],
    "price": 6000,
    "regular_price": 7100,
    "benefit_line": "Marco Cardini leather Derby shoes with a classic lace-up silhouette designed.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Leather Derby Shoes. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_marco_cardini_leather_cap_toe_ox",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Leather Cap Toe Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/sept%205/03d13f39-cbb9-47f7-a22d-72f6550b777f.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/sept%205/03d13f39-cbb9-47f7-a22d-72f6550b777f.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 6000,
    "regular_price": 7100,
    "benefit_line": "Marco Cardini leather cap-toe Oxford in black and brown, combining a classic.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Leather Cap Toe Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_leather_cap_toe_derby_dar",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Leather Cap Toe Derby",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/clarkdark.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/clarkdark.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/clarkblack.jpeg"
    ],
    "colors": [
      "Dark Brown",
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Dark Brown & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Dark Brown, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Leather Cap Toe Derby. Available in Dark Brown, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_derby_brogue_brown",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Derby Brogue",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/john%20foster1.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/john%20foster1.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Dark brown John Foster leather Derby brogue with classic perforation and an open-lacing Derby vamp.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Derby Brogue. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_brogue_oxford_black",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Brogue Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/john%20foster2.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/john%20foster2.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/john%20foster3.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/John%20Foster%20Brogue%20Oxford%20Dark%20Brown%20.jpeg"
    ],
    "colors": [
      "Black",
      "Brown",
      "Dark Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Black, Brown & Dark Brown • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "3 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Black, Brown, Dark Brown",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Brogue Oxford. Available in Black, Brown, Dark Brown. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_ecco_croc_embossed_leather_loafe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Ecco Croc Embossed Leather Loafer Green",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/ecco1.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/ecco1.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Olive"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Ecco croc-embossed leather loafer in olive green; slip-on design with low-prof.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Ecco Croc Embossed Leather Loafer Green. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_ecco_leather_loafer_dark_brown",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Ecco Leather Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/ecco2.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/ecco2.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Dark Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Dark Brown Ecco leather loafers with a moc-toe silhouette and black rubber.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Ecco Leather Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_marco_cardini_1buckle_loafer_bla",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Buckle Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack1.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack1.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Marco Cardin Buckle Loafer in black from Shoe-In, slip-on casual loafers with.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Buckle Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_marco_cardini_1metal_bit_loafer_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Metal Bit Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack2.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack2.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Polished black Marco Cardin metal-bit loafers with a streamlined profile and.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Metal Bit Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_marco_cardini_1textured_loafer_b",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Textured Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack3.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack3.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcobrown1.jpeg"
    ],
    "colors": [
      "Black",
      "Dark Brown"
    ],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Available in Black & Dark Brown • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Black, Dark Brown",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Textured Loafer. Available in Black, Dark Brown. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_marco_cardini_1penny_loafer_blac",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Penny Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack4.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack4.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Marco Cardin black penny loafer in leather with a smooth apron toe, classic.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Penny Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_marco_cardini_1formal_slip_on_bl",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Formal Slip On",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack5.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2017/marcoblack5.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Marco Cardin Formal Slip-On Black is a sleek leather slip-on with subtle toe.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Formal Slip On. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_textured_oxford_dark_brow",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Textured Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Clarks%20Textured%20Oxford%20Dark%20Brown.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Clarks%20Textured%20Oxford%20Dark%20Brown.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Dark Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Clarks Textured Oxford dark brown leather shoe with cap toe and pebble-texture.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Textured Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_england_dark_brown_wingti",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks England Wingtip Brogue Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%208/clark%20download.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%208/clark%20download.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Dark Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Polished dark brown leather Clarks wingtip brogue oxford with classic broguing.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks England Wingtip Brogue Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_england_black_cap_toe_bro",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks England Cap Toe Brogue Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%208/clarcks%20england.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%208/clarcks%20england.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Black leather cap-toe brogue Oxford with closed lacing, subtle perforations.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks England Cap Toe Brogue Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clark_classic_cap_toe_oxford_dre",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clark Classic Cap Toe Oxford Dress Shoes",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/official/clarkdarktan.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/official/clarkdarktan.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Dark Brown Clark Cap-Toe Oxford dress shoes in leather with a polished toe.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clark Classic Cap Toe Oxford Dress Shoes. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_heritage_wingtip_derby_tan_suede",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Heritage Wingtip Derby Suede",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/billionare300.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/billionare300.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Tan"
    ],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Billionaire Heritage Wingtip Derby – Tan Suede is a Tan finish with suede cons.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Heritage Wingtip Derby Suede. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_executive_cap_toe_oxford_burgund",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Executive Cap Toe Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/billionaire200.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/billionaire200.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/billionare1.webp",
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779788364884-bb572c99-86c3-4703-b420-65936affe3e6.webp"
    ],
    "colors": [
      "Burgundy",
      "Black",
      "Dark Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Burgundy, Black & Dark Brown • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "3 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Burgundy, Black, Dark Brown",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Executive Cap Toe Oxford. Available in Burgundy, Black, Dark Brown. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_marco_cardini_oxford_cap_toe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Oxford Cap Toe",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/marco%20cardini1.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/marco%20cardini1.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Marco Cardini leather Oxford with a classic cap toe and refined formal shape.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Oxford Cap Toe. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_marco_cardini_cap_toe_derby",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Marco Cardini Cap Toe Derby",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/marco%20cardini.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/marco%20cardini.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5800,
    "regular_price": 6800,
    "benefit_line": "Marco Cardini cap-toe Derby shoe with a versatile lace-up profile for office.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Marco Cardini Cap Toe Derby. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_leather_slip_on",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Leather Slip On",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/clark.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/clark.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Clarks Leather Slip-On is a Black finish with leather construction loafer sele.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Leather Slip On. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_black_pebble_leather_derby_white",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "pebble leather Derby ( sole",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20pebble%20leather%20Derby%20(white%20sole).webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20pebble%20leather%20Derby%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20pebble%20leather%20Derby%20(white%20sole",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5495,
    "regular_price": 6500,
    "benefit_line": "John Foster Black pebble leather Derby (white sole is a Black finish with leat.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "pebble leather Derby ( sole. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_dark_brown_medallion_oxford_whit",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Executive Medallion Oxford (White Sole)",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20medallion%20Oxford%20(white%20sole).webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20medallion%20Oxford%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20medallion%20Oxford%20(white%20sole",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20medallion%20Oxford%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20medallion%20Oxford%20(white%20sole"
    ],
    "colors": [
      "Dark Brown",
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Dark Brown & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Dark Brown, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Executive Medallion Oxford (White Sole). Available in Dark Brown, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_double_monk_shoe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Double Monk Shoe",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-24%20at%2014.19.40.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-24%20at%2014.19.40.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-24%20at%2014.19.39.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster double monk strap shoe with a clean twin-buckle silhouette for.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Double Monk Shoe. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_signature_double_monk_shoe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Signature Double Monk Shoe",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-24%20at%2014.19.33.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-24%20at%2014.19.33.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Signature double monk shoe with twin-buckle styling and a refined.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Signature Double Monk Shoe. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_heritage_dress_boot",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Heritage Dress Boot",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-17%20at%2014.28.56.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-17%20at%2014.28.56.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-17%20at%2014.28.56%20(1",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Heritage Dress Boot is a Brown finish with leather construction.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Heritage Dress Boot. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_billionaire_oxford",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Billionaire Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-29%20at%2010.36.32.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-29%20at%2010.36.32.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Billionaire-Oxford is a Brown finish with leather construction brogue Oxford.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Billionaire Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_billionaire_wingtip_oxford",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Billionaire Wingtip Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-07-01%20at%2011.43.47.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-07-01%20at%2011.43.47.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-29%20at%2010.36.32.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Billionaire-Oxford Billionaire-Wingtip Oxford is a Black|Brown finish with.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Billionaire Wingtip Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_richwanaz_black_white_loafer",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Richwanaz Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.02%20(1).webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.02%20(1).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.02%20(1",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.01.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.02.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.46.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.04.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.18%20(1"
    ],
    "colors": [
      "Black"
    ],
    "price": 5499,
    "regular_price": 6500,
    "benefit_line": "Richwanaz Black & White Loafer is a Black finish with leather construction.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Richwanaz Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_richwanaz_brown_horsebit_loafer",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Richwanaz Horsebit Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.18%20(1).webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.18%20(1).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.18%20(1",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.04.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.46.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Richwanaz Brown Horsebit Loafer is a Tan and Brown finish with leather constru.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Richwanaz Horsebit Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_richwanaz_black_penny_loafer",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Richwanaz Penny Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.45.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.45.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.46.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.37%20(1",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Richwanaz Black Penny Loafer is a Black finish with leather construction penny.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Richwanaz Penny Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_richwanaz_royal_blue_horsebit_lo",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Richwanaz Royal Blue Horsebit Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.47.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.47.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/WhatsApp%20Image%202026-06-19%20at%2018.49.46.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Richwanaz Royal Blue Horsebit Loafer is a Blue finish with leather constructio.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Richwanaz Royal Blue Horsebit Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_billionaire_cap_toe_oxford",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Billionaire Cap Toe Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/black%202.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/black%202.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20products/brown1.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/billionare%20low%20cut.webp"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Billionaire Cap Toe Oxford is a Black finish with leather construction Oxford.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Billionaire Cap Toe Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_richwanaz_premium_leather_loafer",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Richwanaz Premium Leather Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/richwanaz.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/richwanaz.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/richwanaz1.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [],
    "price": 5499,
    "regular_price": 6500,
    "benefit_line": "Richwanaz Premium Leather Loafer is a Black and Brown finish with leather cons.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Richwanaz Premium Leather Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_black_penny_loafer_b",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Penny Loafer Penny Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/john%20foster%20red%20sole.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/john%20foster%20red%20sole.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5495,
    "regular_price": 6500,
    "benefit_line": "John Foster Black Penny Loafer Black Penny Loafer is a Black finish with leath.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Penny Loafer Penny Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_black_signature_loaf",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Signature Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/jfsbl.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/jfsbl.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/jfsdrk.webp"
    ],
    "colors": [
      "Black",
      "Burgundy"
    ],
    "price": 5497,
    "regular_price": 6500,
    "benefit_line": "Available in Black & Burgundy • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Black, Burgundy",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Signature Loafer. Available in Black, Burgundy. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_burgundy_buckle_loaf",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Buckle Loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/jfsbr3.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/jfsbr3.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/jfsbu.webp"
    ],
    "colors": [
      "Burgundy",
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Burgundy & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Burgundy, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Buckle Loafer. Available in Burgundy, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_black_wingtip_brogue",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Wingtip Brogue",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/John%20Foster%20Black%20Wingtip%20Brogue.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/John%20Foster%20Black%20Wingtip%20Brogue.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5496,
    "regular_price": 6500,
    "benefit_line": "John Foster Black Wingtip Brogue is a Black finish with leather construction.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Wingtip Brogue. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_brown_cap_toe_oxford",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Cap Toe Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/John%20Foster%20Brown%20Cap%20Toe%20Oxford.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/John%20Foster%20Brown%20Cap%20Toe%20Oxford.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5196,
    "regular_price": 6100,
    "benefit_line": "John Foster Brown Cap Toe Oxford is a Brown finish with leather construction.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Cap Toe Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_executive_croc_oxford_bla",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Executive Croc Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/official-4.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/official-4.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/official-2.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/0fficial-1.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/official-5.webp"
    ],
    "colors": [
      "Black",
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Black & Brown • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Black, Brown",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Executive Croc Oxford. Available in Black, Brown. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_billionaire_premium_penny_loafer",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Billionaire Premium Penny Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779957835025-9f3653cc-5d07-490a-b177-a39c057080fa.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779957835025-9f3653cc-5d07-490a-b177-a39c057080fa.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Elegant brown penny loafers crafted for executive sophistication.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Billionaire Premium Penny Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_milano_luxury_wingtip_loafer_bla",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Milano Luxury Wingtip Loafer",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779745339188-ecf8d645-b040-4290-ba83-d76c62f91ace.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779745339188-ecf8d645-b040-4290-ba83-d76c62f91ace.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Luxury black wingtip loafer blending classic elegance with modern comfort.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Milano Luxury Wingtip Loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_milano_woven_tassel_loafers_blac",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Milano Woven Tassel Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779745261924-95c2b980-4c41-4da8-8271-b4ee06aebaff.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779745261924-95c2b980-4c41-4da8-8271-b4ee06aebaff.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Luxury woven tassel loafers designed for elegant smart casual wear.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Milano Woven Tassel Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_ecco_luxury_bit_loafers_brown",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ECCO Luxury Bit Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779745043648-338e054c-5133-4571-afb5-0f1ea43a99db.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779745043648-338e054c-5133-4571-afb5-0f1ea43a99db.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Luxury brown bit loafers designed for premium executive styling.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ECCO Luxury Bit Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_executive_slip_on_loafers",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Executive Slip On Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779745010158-4b71f8ba-cdd2-4f47-8bea-dba322f772de.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779745010158-4b71f8ba-cdd2-4f47-8bea-dba322f772de.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Premium black slip-on loafers built for executive comfort and elegance.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Executive Slip On Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_wingtip_derby_shoes_brown",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Wingtip Derby Shoes",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744979277-fb4d6cbd-91e9-4ef4-af49-e82430262a66.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744979277-fb4d6cbd-91e9-4ef4-af49-e82430262a66.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Classic brown wingtip Derby shoes with premium brogue detailing.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Wingtip Derby Shoes. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_comfort_slip_on_loafers_b",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Comfort Slip On Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744934002-59aba241-338a-40d2-ab15-b55f1eb4f53a.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744934002-59aba241-338a-40d2-ab15-b55f1eb4f53a.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Comfort-focused brown loafers crafted for effortless executive wear.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Comfort Slip On Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_clarks_premium_penny_loafers_bla",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clarks Premium Penny Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744902154-a7b562ea-d580-4903-b0f3-eb39a00af366.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744902154-a7b562ea-d580-4903-b0f3-eb39a00af366.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Elegant black penny loafers designed for smart executive styling.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Clarks Premium Penny Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_ecco_executive_bit_loafers_black",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ECCO Executive Bit Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744866508-acbe119e-56bf-48c6-bd48-a685ad871258.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744866508-acbe119e-56bf-48c6-bd48-a685ad871258.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Premium black bit loafers crafted for executive comfort and elegance.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ECCO Executive Bit Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_premium_comfort_ecco_loafers_bro",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Premium Comfort ecco Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744827347-f46c3c2e-3668-4469-9f5b-a87877a13ef9.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744827347-f46c3c2e-3668-4469-9f5b-a87877a13ef9.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Comfort-focused premium ecco loafers for smart casual elegance.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Premium Comfort ecco Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_wingtip_oxford_shoes",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Wingtip Oxford Shoes",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779788644673-24536a9d-8703-4012-9ed7-97926e1d7d3d.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779788644673-24536a9d-8703-4012-9ed7-97926e1d7d3d.webp"
    ],
    "colors": [
      "Dark Brown"
    ],
    "price": 5200,
    "regular_price": 6100,
    "benefit_line": "Dark brown John Foster wingtip Oxford shoes with brogue detailing for executiv.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Wingtip Oxford Shoes. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_premium_leather_brogue_oxford_br",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Premium Leather Brogue Oxford",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779788490764-8675c03f-c465-4c57-b4f4-9ed860f4d4cd.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779788490764-8675c03f-c465-4c57-b4f4-9ed860f4d4cd.jpeg",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Elegant brogue Oxford shoes crafted with premium leather finishing.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Premium Leather Brogue Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_brown_leather_oxford_brogues",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Leather Oxford Brogues",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779443240561-1b3070a2-0f66-4308-9dca-9164d29957ce.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779443240561-1b3070a2-0f66-4308-9dca-9164d29957ce.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5549,
    "regular_price": 6500,
    "benefit_line": "Classic Oxford brogues crafted from premium leather for executive sophisticati.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Leather Oxford Brogues. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_brown_luxury_penny_loafers",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Luxury Penny Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779443350536-103cc7f2-40ae-41d3-a0cb-76486d88d37f.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779443350536-103cc7f2-40ae-41d3-a0cb-76486d88d37f.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5499,
    "regular_price": 6500,
    "benefit_line": "Premium brown leather loafers designed for smart casual elegance and refined.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Luxury Penny Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_black_double_monk_strap_leather_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Double Monk Strap Leather Shoes",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/double-monk.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/Official/double-monk.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5499,
    "regular_price": 6500,
    "benefit_line": "Black John Foster leather double monk strap shoes with twin buckles and a poli.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Double Monk Strap Leather Shoes. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_executive_black_penny_loafers",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Executive Penny Loafers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779443303121-61504ded-d1ca-403d-9939-d71c4f067ee4.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779443303121-61504ded-d1ca-403d-9939-d71c4f067ee4.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon%203.png",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2014/slipon2.png"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Luxury black leather penny loafers crafted for executive dressing, smart casua.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Executive Penny Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_billionaire_suede_loafer_taupe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Billionaire Suede Loafer Taupe",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Billionaire%20Suede%20Loafer%20Taupe.jpeg",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/date%2011/Billionaire%20Suede%20Loafer%20Taupe.jpeg"
    ],
    "colors": [],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Billionaire Suede Loafer in taupe is a classic penny-strap slip-on with soft.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Billionaire Suede Loafer Taupe. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_premium_leather_low_top_white",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Premium Leather Low Top",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/whiteblack.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/whiteblack.webp"
    ],
    "colors": [
      "White"
    ],
    "price": 4798,
    "regular_price": 5700,
    "benefit_line": "Clean white leather low-top sneaker with a minimal profile for smart-casual.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Premium Leather Low Top. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_premium_leather_low_top_light_gr",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Premium Leather Low Top Light",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/cream.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/cream.webp"
    ],
    "colors": [
      "Grey"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "San-Marina Premium Leather Low Top – Light Grey is a Grey finish with leather.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Premium Leather Low Top Light. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_zopo_premium_minimal_sneaker_oli",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ZOPO Premium Minimal Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/green.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/green.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/blue.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/black.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/white.webp"
    ],
    "colors": [
      "Olive",
      "Navy",
      "Black",
      "White"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Available in Olive, Navy, Black & White • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "4 COLORS AVAILABLE",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Olive, Navy, Black, White",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ZOPO Premium Minimal Sneaker. Available in Olive, Navy, Black, White. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_zopo_premium_minimal_sneaker_cam",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ZOPO Premium Minimal Sneaker Camel",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/brown.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20stock/brown.webp"
    ],
    "colors": [],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "ZOPO Premium Minimal Sneaker – Camel is a Brown finish with suede construction.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ZOPO Premium Minimal Sneaker Camel. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_dark_brown_perforated_penny_loaf",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Executive Perforated Penny Loafer (White Sole)",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20perforated%20penny%20loafer%20(white%20sole).webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20perforated%20penny%20loafer%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20perforated%20penny%20loafer%20(white%20sole",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/ark%20Brown%20perforated%20penny%20loafer%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/ark%20Brown%20perforated%20penny%20loafer%20(white%20sole"
    ],
    "colors": [
      "Dark Brown",
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Dark Brown & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Dark Brown, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Executive Perforated Penny Loafer (White Sole). Available in Dark Brown, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_dark_brown_crocodile_cap_toe_oxf",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Crocodile Cap-Toe Oxford (White Sole)",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20crocodile%20cap-toe%20Oxford%20(white%20sole).webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20crocodile%20cap-toe%20Oxford%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20crocodile%20cap-toe%20Oxford%20(white%20sole",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20crocodile%20cap-toe%20Oxford%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20crocodile%20cap-toe%20Oxford%20(white%20sole"
    ],
    "colors": [
      "Dark Brown",
      "Black"
    ],
    "price": 5496,
    "regular_price": 6500,
    "benefit_line": "Available in Dark Brown & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Dark Brown, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Crocodile Cap-Toe Oxford (White Sole). Available in Dark Brown, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_dark_brown_scale_texture_wingtip",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "scale texture Wingtip Derby ( sole)",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20scale-texture%20Wingtip%20Derby%20(white%20sole).webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20scale-texture%20Wingtip%20Derby%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Dark%20Brown%20scale-texture%20Wingtip%20Derby%20(white%20sole"
    ],
    "colors": [
      "Dark Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Dark Brown scale-texture Wingtip Derby (white sole) is a Brown.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "scale texture Wingtip Derby ( sole). Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_black_woven_wingtip_derby_white_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "woven Wingtip Derby ( sole)",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20woven%20Wingtip%20Derby%20(white%20sole).webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20woven%20Wingtip%20Derby%20(white%20sole).webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/white%20sole/Black%20woven%20Wingtip%20Derby%20(white%20sole"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Black woven Wingtip Derby (white sole) is a Black finish with leat.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "woven Wingtip Derby ( sole). Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_olive_suede_loafer",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Classic Italian Suede Loafers",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Olive%20suede%20loafer.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Olive%20suede%20loafer.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Dark%20Brown%20suede%20loafer.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Navy%20suede%20loafer.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Black%20suede%20loafer.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Tan%20suede%20loafer.webp"
    ],
    "colors": [
      "Olive",
      "Dark Brown",
      "Navy",
      "Black",
      "Tan"
    ],
    "price": 6000,
    "regular_price": 7100,
    "benefit_line": "Available in Olive, Dark Brown, Navy, Black & Tan • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "5 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Olive, Dark Brown, Navy, Black, Tan",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Classic Italian Suede Loafers. Available in Olive, Dark Brown, Navy, Black, Tan. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_black_pebble_leather_penny_loafe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Pebble Leather Penny Loafers",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Black%20pebble%20leather%20penny%20loafer.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Black%20pebble%20leather%20penny%20loafer.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Navy%20pebble%20leather%20penny%20loafer.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Grey%20pebble%20leather%20penny%20loafer.webp"
    ],
    "colors": [
      "Black",
      "Navy",
      "Grey"
    ],
    "price": 6000,
    "regular_price": 7100,
    "benefit_line": "Available in Black, Navy & Grey • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "3 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Black, Navy, Grey",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Pebble Leather Penny Loafers. Available in Black, Navy, Grey. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_green_pebble_leather_penny_loafe",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Green pebble leather penny loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Green%20pebble%20leather%20penny%20loafer.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Green%20pebble%20leather%20penny%20loafer.webp"
    ],
    "colors": [],
    "price": 6000,
    "regular_price": 7100,
    "benefit_line": "Dior Green pebble leather penny loafer is a GREEN finish with leather construc.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Green pebble leather penny loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_tan_cognac_pebble_leather_penny_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "/ pebble leather penny loafer",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Tan_Cognac%20pebble%20leather%20penny%20loafer.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/new%20updates/Tan_Cognac%20pebble%20leather%20penny%20loafer.webp"
    ],
    "colors": [
      "Tan"
    ],
    "price": 6000,
    "regular_price": 7100,
    "benefit_line": "Dior Tan/Cognac pebble leather penny loafer is a Tan finish with leather const.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "/ pebble leather penny loafer. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_croc_leather_sneaker",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Croc Leather Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Jnmc.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Jnmc.webp"
    ],
    "colors": [
      "Black"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "John Foster Croc Leather Sneaker – Black is a Black finish with leather constr.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Croc Leather Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_john_foster_brown_leather_bit_lo",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Leather Bit Loafer Sneaker",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/jn%20sneaker.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/jn%20sneaker.webp"
    ],
    "colors": [
      "Brown"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "John Foster Brown Leather Bit Loafer Sneaker is a Brown finish with leather.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Leather Bit Loafer Sneaker. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_billionaire_woven_cap_toe_derby_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Billionaire Woven Cap Toe Derby",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/Clarks-woven-casual-4.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/Clarks-woven-casual-4.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/Clarks-woven-casual-2.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/Billionaire-woven-casual-1.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/-5.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/-woven-casual.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/Clarks-woven-casual-1.webp"
    ],
    "colors": [
      "Grey",
      "Brown",
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Grey, Brown & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "3 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Grey, Brown, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Billionaire Woven Cap Toe Derby. Available in Grey, Brown, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_croc_penny_loafers_b",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Croc Penny Loafers",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-5.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-5.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-3.webp"
    ],
    "colors": [
      "Black",
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Black & Brown • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Black, Brown",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Croc Penny Loafers. Available in Black, Brown. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_signature_loafers_bl",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Signature Loafers",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-6.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-6.webp"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Black John Foster Signature leather loafers with a clean slip-on profile for.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Signature Loafers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_croc_cap_toe_oxford_",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Croc Cap Toe Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-7.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-7.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-8.webp"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Croc Cap Toe Oxford Black is a Black finish with leather construct.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Croc Cap Toe Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_patent_cap_toe_oxfor",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Patent Cap Toe Oxford",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-2.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-2.webp"
    ],
    "colors": [
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Patent Cap Toe Oxford Black is a Black finish with leather constru.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Patent Cap Toe Oxford. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_heritage_brogue_derb",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Heritage Brogue Derby",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-10.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-10.webp"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Heritage Brogue Derby Brown is a Brown finish with leather constru.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Heritage Brogue Derby. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_brown_brogue_derby_s",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Brogue Derby Shoes",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-4.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-4.webp"
    ],
    "colors": [
      "Brown"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "John Foster Brown Brogue Derby Shoes is a Brown finish with leather constructi.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Brogue Derby Shoes. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_john_foster_brown_croc_tassel_lo",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "John Foster Croc Tassel Loafers",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-1.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-1.webp",
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/casual-9.webp"
    ],
    "colors": [
      "Brown",
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Brown & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Brown, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "John Foster Croc Tassel Loafers. Available in Brown, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_cat_rugged_moc_casual_shoes_grey",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "CAT Rugged Moc Casual Shoes",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779826901567-54af7d68-f893-47c2-acf3-fd0152a8d542.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779826901567-54af7d68-f893-47c2-acf3-fd0152a8d542.webp",
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779826951107-fac50e08-cf3d-47c5-af4a-39a018dcfb6f.webp",
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779827005746-6ee62959-8fe1-4a73-b222-811a7631aaba.webp"
    ],
    "colors": [
      "Grey",
      "Dark Brown",
      "Black"
    ],
    "price": 5200,
    "regular_price": 6100,
    "benefit_line": "Available in Grey, Dark Brown & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "3 COLORS AVAILABLE",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Grey, Dark Brown, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "CAT Rugged Moc Casual Shoes. Available in Grey, Dark Brown, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_cat_rugged_moc_casual_shoes_came",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "CAT Rugged Moc Casual Shoes Camel",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779827045362-26371b6d-0983-4ee7-b410-ca81dc3cf9b2.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779827045362-26371b6d-0983-4ee7-b410-ca81dc3cf9b2.webp"
    ],
    "colors": [],
    "price": 5200,
    "regular_price": 6100,
    "benefit_line": "Rugged CAT moc shoes built for comfort, durability, and smart casual styling.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "CAT Rugged Moc Casual Shoes Camel. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_monogram_luxury_slides_black",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Monogram Luxury Slides",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744779314-2d68174a-23ee-4650-8c27-fdeb346c0bd8.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744779314-2d68174a-23ee-4650-8c27-fdeb346c0bd8.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 3200,
    "regular_price": 3800,
    "benefit_line": "Luxury-inspired slides crafted for modern casual comfort.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Monogram Luxury Slides. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_luxury_comfort_sandals_black",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Luxury Comfort Sandals",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744741938-94c98a44-e7e2-44c5-a3a5-685699412705.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744741938-94c98a44-e7e2-44c5-a3a5-685699412705.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 3200,
    "regular_price": 3800,
    "benefit_line": "Premium comfort sandals designed for stylish everyday wear.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Luxury Comfort Sandals. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_aldo_minimal_leather_sneakers_bl",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "ALDO Minimal Leather Sneakers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744710408-937a3c5a-3396-4147-97ef-53bc8f9882e9.jpeg",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779744710408-937a3c5a-3396-4147-97ef-53bc8f9882e9.jpeg"
    ],
    "colors": [
      "Black"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Clean premium sneakers designed for smart casual everyday styling.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "ALDO Minimal Leather Sneakers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_luxury_croc_double_monk_strap_sh",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Luxury Croc Double Monk Strap Shoes",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779788609276-f024d7c6-9986-4097-8f19-a1e318342dec.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779788609276-f024d7c6-9986-4097-8f19-a1e318342dec.webp",
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779788547359-5d78692c-b00e-4ead-b927-82341ed3be5b.webp"
    ],
    "colors": [
      "Brown",
      "Black"
    ],
    "price": 5500,
    "regular_price": 6500,
    "benefit_line": "Available in Brown & Black • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Men's Footwear",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Brown, Black",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Luxury Croc Double Monk Strap Shoes. Available in Brown, Black. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with tailored trousers, official suits, or smart-casual chinos for an elevated executive look."
  },
  {
    "id": "prod_shoein_dark_brown_luxe_minimal_sneakers",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Luxe Minimal Sneakers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779454282563-84af74a6-e2bd-4913-8f6d-d9e4c7193621.webp",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779454282563-84af74a6-e2bd-4913-8f6d-d9e4c7193621.webp",
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779454493091-ad7ba7ba-3ff1-466b-82a9-8dd05d7ad687.webp"
    ],
    "colors": [
      "Dark Brown",
      "Brown"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Available in Dark Brown & Brown • Handcrafted genuine leather",
    "in_stock": true,
    "featured": false,
    "badge": "2 COLORS AVAILABLE",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "Available in Dark Brown, Brown",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Luxe Minimal Sneakers. Available in Dark Brown, Brown. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_white_premium_casual_sneakers",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Premium Casual Sneakers",
    "size": "EU 40 - 45",
    "photo": "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/aldo-white-sneaker.webp",
    "photos": [
      "https://pub-a3a3034d346140c994f64090c1eb4c73.r2.dev/products/casuals/Casuals/aldo-white-sneaker.webp"
    ],
    "colors": [
      "White"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "ALDO White Premium Casual Sneakers is a White finish with leather construction.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Premium Casual Sneakers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_shoein_brown_elastic_strap_casual_sneak",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Elastic Strap Casual Sneakers",
    "size": "EU 40 - 45",
    "photo": "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779454349875-8c7e8448-6f01-4edb-aa3b-dafe739ab7d7.png",
    "photos": [
      "https://klttgzmdoozxsvdahusz.supabase.co/storage/v1/object/public/product-images/products/1779454349875-8c7e8448-6f01-4edb-aa3b-dafe739ab7d7.png"
    ],
    "colors": [
      "Brown"
    ],
    "price": 4800,
    "regular_price": 5700,
    "benefit_line": "Modern leather casual sneakers with elastic strap support and premium everyday.",
    "in_stock": true,
    "featured": false,
    "badge": "",
    "category": "Sneakers & Kicks",
    "ingredients": "Genuine Calfskin / High-Grade Suede, Cushioned Memory Foam Insole, Durable Rubber Sole",
    "highlights": [
      "100% Genuine Materials",
      "Fast Nairobi Same-Day Dispatch",
      "Countrywide Parcels via Fargo / G4S",
      "Lipa na M-Pesa Available"
    ],
    "description": "Elastic Strap Casual Sneakers. Crafted from premium genuine leather with cushioned memory foam insole and durable outsole. Built for cloud-comfort and executive sophistication.",
    "how_to_use": "Pair with jeans, casual trousers, or shorts for effortless everyday comfort and style."
  },
  {
    "id": "prod_glow_brighten_calm_duo",
    "seller_id": "seller_glow_secret",
    "name": "Brighten & Calm Duo (REVASE Rice + Anua Azelaic Acid 10+)",
    "size": "2-Piece Set",
    "photo": "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Brighten_Calm_Duo.webp?v=1790597712",
    "photos": [
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Brighten_Calm_Duo.webp?v=1790597712",
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Anua_70_rice_70_cerramide_150ML.webp?v=1790336908",
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Cosrx_-_Blue_Peptide_Bakuchiol_Plump_Glow_Serum.webp?v=1790320840"
    ],
    "price": 5500,
    "regular_price": 6200,
    "benefit_line": "Fades hyperpigmentation & calms redness with clinical Korean actives",
    "in_stock": true,
    "featured": true,
    "badge": "DUO COMBO",
    "category": "Korean Skincare & Serums",
    "ingredients": "10% Azelaic Acid, Tranexamic Acid, Fermented Rice Water, Centella Asiatica",
    "how_to_use": "Apply Anua Azelaic Serum after cleansing, follow with REVASE Rice Moisturizer morning and evening.",
    "highlights": [
      "Dark Spot Eraser",
      "Calms Acne & Redness",
      "100% Authentic Korean",
      "Best Value Bundle"
    ],
    "description": "The viral brightening power combo! Pairs REVASE Rice + Tranexamic brightening moisturizer with Anua Azelaic Acid 10+ serum to clear stubborn dark marks, even out skin tone, and restore a luminous glass-skin glow."
  },
  {
    "id": "prod_glow_cosrx_peptide_cream",
    "seller_id": "seller_glow_secret",
    "name": "COSRX The 6 Peptide Bakuchiol Plump Bounce Cream",
    "size": "50ml",
    "photo": "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/COSRX_The_Blue_Peptide_Bakuchiol_Plump_Bounce_Cream.webp?v=1790255745",
    "photos": [
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/COSRX_The_Blue_Peptide_Bakuchiol_Plump_Bounce_Cream.webp?v=1790255745",
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Cosrx_-_Blue_Peptide_Bakuchiol_Plump_Glow_Serum.webp?v=1790320840"
    ],
    "price": 3800,
    "regular_price": 4300,
    "benefit_line": "6 Peptides + natural Bakuchiol for intense collagen bounce & firmness",
    "in_stock": true,
    "featured": true,
    "badge": "COLLAGEN BOUNCE",
    "category": "Korean Skincare & Serums",
    "ingredients": "6 Multi-Peptide Complex, Bakuchiol (Natural Retinol Alternative), Squalane",
    "how_to_use": "Smooth a dime-sized amount over face and neck as the final moisturising step.",
    "highlights": [
      "Collagen Booster",
      "Gentle Retinol Alternative",
      "Deep Hydration",
      "Safe for Sensitive Skin"
    ],
    "description": "COSRX's breakthrough anti-aging bounce cream! Packed with 6 targeted peptides and plant-based Bakuchiol to visibly firm fine lines, restore youthful elasticity, and give skin an instant plump texture."
  },
  {
    "id": "prod_glow_anua_rice_milk",
    "seller_id": "seller_glow_secret",
    "name": "Anua Rice 70 Intensive Ceramide Moisturizing Milk",
    "size": "150ml",
    "photo": "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Anua_70_rice_70_cerramide_150ML.webp?v=1790336908",
    "photos": [
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Anua_70_rice_70_cerramide_150ML.webp?v=1790336908",
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Brighten_Calm_Duo.webp?v=1790597712"
    ],
    "price": 2800,
    "regular_price": 3200,
    "benefit_line": "70% Rice Bran Water + Ceramides for milky glass skin hydration",
    "in_stock": true,
    "featured": true,
    "badge": "VIRAL GLASS SKIN",
    "category": "Korean Skincare & Serums",
    "ingredients": "70% Rice Bran Extract, 5 Essential Ceramides, Niacinamide, Hyaluronic Acid",
    "how_to_use": "Apply 2-3 pumps onto palms and pat into skin after toner. Absorbs with zero greasy residue.",
    "highlights": [
      "70% Rice Water",
      "Barrier Repair",
      "Lightweight Milky Glow"
    ],
    "description": "Anua's viral Milky Toner-Lotion hybrid! Formulated with 70% pure Korean rice bran extract and multi-ceramides to repair damaged moisture barriers, brighten dull texture, and leave skin soft as silk."
  },
  {
    "id": "prod_glow_cosrx_peptide_serum",
    "seller_id": "seller_glow_secret",
    "name": "COSRX Blue Peptide Bakuchiol Plump Glow Serum",
    "size": "50ml",
    "photo": "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Cosrx_-_Blue_Peptide_Bakuchiol_Plump_Glow_Serum.webp?v=1790320840",
    "photos": [
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Cosrx_-_Blue_Peptide_Bakuchiol_Plump_Glow_Serum.webp?v=1790320840",
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/COSRX_The_Blue_Peptide_Bakuchiol_Plump_Bounce_Cream.webp?v=1790255745"
    ],
    "price": 3700,
    "regular_price": 4200,
    "benefit_line": "Fast-absorbing blue peptide elixir for pore tightening & radiant glow",
    "in_stock": true,
    "featured": false,
    "badge": "NEW RELEASE",
    "category": "Korean Skincare & Serums",
    "ingredients": "Copper Tripeptide-1, Bakuchiol, Azulene, Hyaluronic Acid",
    "how_to_use": "Dispense 3-4 drops directly onto clean face and gently press until absorbed.",
    "highlights": [
      "Pore Tightening",
      "Natural Blue Azulene",
      "Non-Sticky Finish"
    ],
    "description": "COSRX high-potency blue peptide serum. Blends soothing azulene with firming copper peptides and bakuchiol to tighten enlarged pores, refine rough skin texture, and infuse youthful luminosity."
  },
  {
    "id": "prod_glow_iunik_beta_glucan",
    "seller_id": "seller_glow_secret",
    "name": "iUNIK Beta-Glucan Power Moisture Serum (20% More Hydrating Than HA)",
    "size": "50ml",
    "photo": "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/iunik-beta-glucan-power-moisture-serum-50ml_2_1.webp?v=1790246623",
    "photos": [
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/iunik-beta-glucan-power-moisture-serum-50ml_2_1.webp?v=1790246623",
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Cosrx_-_Blue_Peptide_Bakuchiol_Plump_Glow_Serum.webp?v=1790320840"
    ],
    "price": 2650,
    "regular_price": 3000,
    "benefit_line": "Pure 98% Beta-Glucan holding 20% more moisture than hyaluronic acid",
    "in_stock": true,
    "featured": false,
    "badge": "DEEP HYDRATION",
    "category": "Korean Skincare & Serums",
    "ingredients": "98% Third-Generation Fermented Beta-Glucan",
    "how_to_use": "Apply morning and night after toner. Instantly locks in moisture without heaviness.",
    "highlights": [
      "98% Beta Glucan",
      "Superior to Hyaluronic Acid",
      "Soothes Irritation"
    ],
    "description": "The gold standard in barrier hydration! iUNIK Beta-Glucan Power Serum contains 98% pure beta-glucan to hold moisture 20% better than hyaluronic acid, calming stressed, irritated, or compromised skin."
  },
  {
    "id": "prod_glow_abib_eye_patches",
    "seller_id": "seller_glow_secret",
    "name": "Abib Glutathione Kojic Acid Vita Jelly Eye Patches",
    "size": "60 Patches (90g)",
    "photo": "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Glutathione_Kojic_Acid_Eye_Patch_Vita_Jelly.webp?v=1790154307",
    "photos": [
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Glutathione_Kojic_Acid_Eye_Patch_Vita_Jelly.webp?v=1790154307",
      "https://cdn.shopify.com/s/files/1/0546/1996/3565/files/Anua_70_rice_70_cerramide_150ML.webp?v=1790336908"
    ],
    "price": 2650,
    "regular_price": 3100,
    "benefit_line": "Fades dark circles & depuffs tired eyes with glutathione jelly",
    "in_stock": true,
    "featured": true,
    "badge": "EYE REPAIR",
    "category": "Korean Skincare & Serums",
    "ingredients": "Pure Glutathione, Kojic Acid, Vitamin C Derivative, Niacinamide, Caffeine",
    "how_to_use": "Apply hydrogel patches under eyes for 20 minutes before skincare or makeup. Pat remaining serum in.",
    "highlights": [
      "Erases Dark Under-Eyes",
      "Depuffs in 15 Mins",
      "60 Hydrogel Patches"
    ],
    "description": "Instant remedy for tired, dark under-eyes! Abib Vita Jelly patches deliver concentrated glutathione and kojic acid to brighten stubborn dark circles, reduce morning puffiness, and smooth under-eye fine lines."
  },
  {
    "id": "prod_bbk_elf_brightening",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "e.l.f. C-Bright Brightening Face Primer (2% Vit C)",
    "size": "21g",
    "photo": "/products/bbk-elf-brightening.webp",
    "photos": [
      "/products/bbk-elf-brightening.webp"
    ],
    "companion_id": "prod_bbk_lagirl_kit",
    "video": "/products/bbk-elf-brightening.mp4",
    "price": 1800,
    "regular_price": 2200,
    "benefit_line": "2% Vitamin C for instant radiant base & all-day makeup grip",
    "in_stock": true,
    "featured": true,
    "badge": "VIDEO DEMO",
    "category": "Makeup & Prep",
    "ingredients": "2% Vitamin C (Ascorbyl Palmitate), Squalane, Vitamin E, Light-Diffusing Micro-Pigments",
    "how_to_use": "Apply a thin, even amount to clean, moisturized skin prior to makeup application. Allow 30 seconds to set before applying foundation.",
    "highlights": [
      "Includes Video Demo",
      "2% Vitamin C Infused",
      "All-Day Makeup Grip",
      "Great for All Skin Types"
    ],
    "description": "Dull skin? Not on our watch! e.l.f. Brightening (C-Bright) Primer has landed at Beauty Bar. Infused with 2% Vitamin C to brighten and even out skin tone. Velvety, smooth texture that preps skin for a flawless base, gripping makeup for long-lasting, all-day wear. Wear alone for an instant glow or under makeup for a radiant finish."
  },
  {
    "id": "prod_bbk_elf_poreless",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "e.l.f. Poreless Putty Face Primer with Squalane",
    "size": "21g",
    "photo": "/products/bbk-elf-poreless.webp",
    "photos": [
      "/products/bbk-elf-poreless.webp"
    ],
    "companion_id": "prod_bbk_lagirl_kit",
    "video": "/products/bbk-elf-poreless.mp4",
    "price": 1800,
    "regular_price": 2200,
    "benefit_line": "Blurs visible pores & smooths imperfections with squalane",
    "in_stock": true,
    "featured": true,
    "badge": "VIDEO DEMO",
    "category": "Makeup & Prep",
    "ingredients": "Hydrating Squalane, Velvety Putty Complex, Dimethicone, Silica",
    "how_to_use": "Scoop a pea-sized amount and warm between fingers. Pat gently into areas with visible pores (nose, cheeks, chin) before applying makeup.",
    "highlights": [
      "Includes Video Demo",
      "Blurs Pores Instantly",
      "Infused with Squalane",
      "Velvety Smooth Base"
    ],
    "description": "The viral TikTok Poreless Putty Primer! Formulated with hydrating squalane to help grip makeup for all-day wear and protect skin from moisture loss. The velvety texture glides effortlessly over skin, smoothing over imperfections for a poreless effect."
  },
  {
    "id": "prod_bbk_lagirl_kit",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "L.A. Girl PRO Starter Makeup Essentials 5-Piece Bundle",
    "size": "Full Kit",
    "photo": "/products/bbk-lagirl-kit.webp",
    "photos": [
      "/products/bbk-lagirl-kit.webp",
      "/products/bbk-elf-brightening.webp",
      "/products/bbk-elf-poreless.webp"
    ],
    "companion_id": "prod_bbk_elf_brightening",
    "price": 4500,
    "regular_price": 5200,
    "benefit_line": "Complete professional HD coverage routine in one box",
    "in_stock": true,
    "featured": true,
    "badge": "DUO COMBO",
    "category": "Makeup & Prep",
    "ingredients": "PRO Conceal HD formula, Matte Setting Powder, HD Primer, Precision Blending Sponge",
    "how_to_use": "Prime face, apply HD concealer to dark circles and blemishes, set with HD translucent powder.",
    "highlights": [
      "5-in-1 Routine Kit",
      "HD Camera Ready",
      "Best Value Bundle",
      "Cruelty Free"
    ],
    "description": "Everything you need for an unshakeable full-face beat! Includes authentic L.A. Girl PRO Conceal HD concealer, setting powder, primer, and applicator sponge. Complete coverage that holds up under hot weather and cameras."
  },
  {
    "id": "prod_bbk_36025",
    "original_id": 36025,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "BELLAZURI Concealer",
    "size": "Standard",
    "photo": "/products/bbk_36025.jpg",
    "photos": [
      "/products/bbk_36025.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/concealer-shade-00-1.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/Concealer-04-1.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/concealer-09-2.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/concealer-06-1.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/Concealer-03.jpg"
    ],
    "price": 1000,
    "regular_price": 1000,
    "benefit_line": "Authentic BELLAZURI Concealer with fast delivery countrywide",
    "in_stock": true,
    "featured": true,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Bellazuri Concealer is a lightweight, buildable makeup product made specifically for melanin-rich African skin tones",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35969",
    "original_id": 35969,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "SHEGLAM Eyeshadow Palette 9-Color Ultra-pigmented Shimmer &#038; Matte",
    "size": "Standard",
    "photo": "/products/bbk_35969.jpg",
    "photos": [
      "/products/bbk_35969.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/07/coffee-hop.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/07/Golden-Mirage.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/07/cinamon-spice.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "The SHEGLAM 9-color palettes feature a blend of buttery mattes and high-shine glitters or shimmers.",
    "in_stock": true,
    "featured": true,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The SHEGLAM 9-color palettes feature a blend of buttery mattes and high-shine glitters or shimmers. Designed for seamless blending, this ultra-pigmented formula delivers buildable, long-lasting color with minimal fallout. Depending on your color preference, the palette is available in highly rated, versatile collections spanning soft pinks, warm roses, delicate neutrals, and deep smokey tone",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35962",
    "original_id": 35962,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "MAYBELLINE FIT ME SPOT RESCUE",
    "size": "Standard",
    "photo": "/products/bbk_35962.jpg",
    "photos": [
      "/products/bbk_35962.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/07/85-spo.webp",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/07/80.webp",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/07/70.webp"
    ],
    "price": 2000,
    "regular_price": 2000,
    "benefit_line": "Authentic MAYBELLINE FIT ME SPOT RESCUE with fast delivery countrywide",
    "in_stock": true,
    "featured": true,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "Maybelline Fit Me Spot Rescue Concealer is a breathable, full-coverage hybrid makeup featuring Salicylic Acid, Vitamin C, and Glycerin",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35958",
    "original_id": 35958,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Make It Last Moisture Boost Alcohol-Free Setting Spray",
    "size": "Standard",
    "photo": "/products/bbk_35958.jpg",
    "photos": [
      "/products/bbk_35958.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "Authentic Make It Last Moisture Boost Alcohol-Free Setting Spray with fast delivery countrywide",
    "in_stock": true,
    "featured": true,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "Description The Milani Make It Last Moisture Boost Setting Spray is an alcohol-free, fragrance-free waterproof mist that locks in makeup for up to 16 hours while boosting skin hydration by an average of 75% using a weightless, non-sticky formula",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35953",
    "original_id": 35953,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "COLOR VIBES Eyeshadow palette",
    "size": "Standard",
    "photo": "/products/bbk_35953.jpg",
    "photos": [
      "/products/bbk_35953.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic COLOR VIBES Eyeshadow palette with fast delivery countrywide",
    "in_stock": true,
    "featured": true,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The L.A. Colors Color Vibe Eyeshadow Palette features a playful, on-trend clear acrylic packaging that lets you see the 12 vibrant, color-coordinating shades at a glance. Designed for versatility, this highly pigmented palette combines buttery mattes and luminous shimmers that blend seamlessly with minimal fallout",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35951",
    "original_id": 35951,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Toffee Fusion Eyeshadow Palette",
    "size": "Standard",
    "photo": "/products/bbk_35951.jpg",
    "photos": [
      "/products/bbk_35951.jpg"
    ],
    "price": 3500,
    "regular_price": 3500,
    "benefit_line": "The UCANBE Toffee Fusion is a versatile 48-shade eyeshadow palette featuring a mix of warm and cool neutral tones.",
    "in_stock": true,
    "featured": true,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The UCANBE Toffee Fusion is a versatile 48-shade eyeshadow palette featuring a mix of warm and cool neutral tones. It includes a blend of matte, shimmer, metallic, and satin finishes designed to create both everyday natural looks and dramatic smokey eyes",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35947",
    "original_id": 35947,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Essence | Lash Without Limits Extreme Lengthening &#038; Volume Mascara",
    "size": "Standard",
    "photo": "/products/bbk_35947.jpg",
    "photos": [
      "/products/bbk_35947.jpg"
    ],
    "price": 1500,
    "regular_price": 1500,
    "benefit_line": "Authentic Essence | Lash Without Limits Extreme Lengthening &#038; Volume Mascara with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Essence Lash Without Limits Extreme Lengthening & Volume Mascara is a budget-friendly, highly-rated mascara known for its flexible elastomer brush that grabs and elongates even the shortest lashes. It is highly celebrated for its clean, vegan formula and comes in several variations",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35930",
    "original_id": 35930,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Revlon PhotoReady Insta-Filter Foundation",
    "size": "Standard",
    "photo": "/products/bbk_35930.jpg",
    "photos": [
      "/products/bbk_35930.jpg"
    ],
    "price": 2500,
    "regular_price": 2500,
    "benefit_line": "Authentic Revlon PhotoReady Insta-Filter Foundation with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "Revlon PhotoReady Insta-Filter Foundation in Caramel (Shade 400) is a medium, buildable coverage liquid foundation featuring High-Definition Filter technology designed to blur flaws and give a natural, airbrushed finish. It includes a unique built-in sponge blender for on-the-go touch-ups and contains SPF 20",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35928",
    "original_id": 35928,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Maybelline Grippy Serum Primer, Hydrating Makeup Primer With 2% Niacinamide For Up To 24HR Make Up Wear",
    "size": "Standard",
    "photo": "/products/bbk_35928.jpg",
    "photos": [
      "/products/bbk_35928.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "Maybelline's Grippy Serum is a hydrating water-based makeup primer featuring &#8220;Serum-to-Grip&#8221; technology.",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "Maybelline's Grippy Serum is a hydrating water-based makeup primer featuring &#8220;Serum-to-Grip&#8221; technology. It goes on like a serum and transforms into an adhesive base that locks foundation in place for up to 24 hours. Infused with 2% niacinamide, it plumps and moisturizes without a greasy feel or white cast",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35918",
    "original_id": 35918,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Maybelline Fit Me Matte + luminous smooth+ Hydrating Face Primer With Vitamin E and Spf 20",
    "size": "Standard",
    "photo": "/products/bbk_35918.jpg",
    "photos": [
      "/products/bbk_35918.jpg"
    ],
    "price": 1550,
    "regular_price": 1550,
    "benefit_line": "Authentic Maybelline Fit Me Matte + luminous smooth+ Hydrating Face Primer With Vitamin E and Spf 20 with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Maybelline Fit Me Luminous + Smooth Hydrating Primer is a moisturizing face primer infused with Vitamin E and SPF 20 designed for normal to dry skin. It locks in makeup for up to 16 hours, smooths skin texture, and creates a radiant, dewy finish",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35857",
    "original_id": 35857,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "e.l.f. Power Grip Primer Clear 75mL",
    "size": "Standard",
    "photo": "/products/bbk_35857.jpg",
    "photos": [
      "/products/bbk_35857.jpg"
    ],
    "price": 4800,
    "regular_price": 4800,
    "benefit_line": "Authentic e.l.f. Power Grip Primer Clear 75mL with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The e.l.f. Power Grip Primer in the 75ml (jumbo) size is a gel-based, hydrating face primer designed to smooth your complexion and lock your makeup in place. Its unique, sticky texture grips onto makeup to ensure all-day wear",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35805",
    "original_id": 35805,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "PRO Perfect Hydrating multi-tasking Dewy Setting Spray",
    "size": "Standard",
    "photo": "/products/bbk_35805.jpg",
    "photos": [
      "/products/bbk_35805.jpg"
    ],
    "price": 2500,
    "regular_price": 2500,
    "benefit_line": "A milky, weightless micro mist that hydrates, refreshes, and locks in a dewy glow all day.",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "A milky, weightless micro mist that hydrates, refreshes, and locks in a dewy glow all day.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35803",
    "original_id": 35803,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "L.A. Girl Brow Bestie Gel With Dual-Ended Dark Blonde GBG 381",
    "size": "Standard",
    "photo": "/products/bbk_35803.jpg",
    "photos": [
      "/products/bbk_35803.jpg"
    ],
    "price": 900,
    "regular_price": 900,
    "benefit_line": "Authentic L.A. Girl Brow Bestie Gel With Dual-Ended Dark Blonde GBG 381 with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The L.A. Girl Brow Bestie Gel (GBG381 Dark Blonde) is a long-wearing, waterproof brow gel kit designed to define, sculpt, and set brows . It includes a tinted pomade formula and a dual-ended tool (brush/spoolie) for precise application. The formula is enriched with Vitamin E and jojoba oil, providing a smudge-proof finish that holds brows in place, with color that can last up to 3-4 days",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35801",
    "original_id": 35801,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Fanatic Highlighting Palette - GBL427 Sunlight Sensation",
    "size": "Standard",
    "photo": "/products/bbk_35801.jpg",
    "photos": [
      "/products/bbk_35801.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Fanatic Highlighting Palette &#8211; GBL427 Sunlight Sensation with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "This is a 4 pan palette featuring warm-toned, highly pigmented, and blendable, shimmering shades designed to create a radiant, sun-kissed glow",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35799",
    "original_id": 35799,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "L.A. Girl GBL 422 Fanatic Blush Palette, Blushed Babe",
    "size": "Standard",
    "photo": "/products/bbk_35799.jpg",
    "photos": [
      "/products/bbk_35799.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic L.A. Girl GBL 422 Fanatic Blush Palette, Blushed Babe with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The L.A. Girl Fanatic Blush Palette in Blushed Babe (GBL422) is a 4-pan powder palette featuring highly pigmented, blendable pink and mauve shades . It offers a mix of matte and satin finishes designed to create a radiant, natural-looking flush suitable for all skin tones. The compact includes a mirror for on-the-go application",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35795",
    "original_id": 35795,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "S.he makeup festival 35 color pastel palette",
    "size": "Standard",
    "photo": "/products/bbk_35795.jpg",
    "photos": [
      "/products/bbk_35795.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "Authentic S.he makeup festival 35 color pastel palette with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The S.he Makeup Festival 35 Color Pastel Palette (often found as SH-SP15) is a vibrant, 35-shade collection featuring a mix of soft pastels, rich mattes, and dazzling shimmers.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35793",
    "original_id": 35793,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "BW-&#8216;XOXO' Nude 40 Color Eyeshadow Palette",
    "size": "Standard",
    "photo": "/products/bbk_35793.jpg",
    "photos": [
      "/products/bbk_35793.jpg"
    ],
    "price": 3800,
    "regular_price": 3800,
    "benefit_line": "The 40 beautiful shades in this eyeshadow palette are highly pigmented, and easy to blend.",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The 40 beautiful shades in this eyeshadow palette are highly pigmented, and easy to blend. This versatile palette lets you go for a subtle daytime look, and easily transition to a sultry nighttime smoky eye. It is the perfect go-to for creating a flawless, sexy look for any occasion",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35789",
    "original_id": 35789,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "UCANBE Professional 18 Colors Aromas Nude Eyeshadow Palette",
    "size": "Standard",
    "photo": "/products/bbk_35789.jpg",
    "photos": [
      "/products/bbk_35789.jpg"
    ],
    "price": 2000,
    "regular_price": 2000,
    "benefit_line": "Authentic UCANBE Professional 18 Colors Aromas Nude Eyeshadow Palette with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The UCANBE Professional 18 Colors Aromas Nude Eyeshadow Palette is a versatile, budget-friendly palette featuring a mix of 18 highly pigmented nude, pink, berry, and copper shades. It includes matte, shimmer, pearl, and glitter textures with a buttery, blendable formula designed for both everyday natural looks and dramatic party glam",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35787",
    "original_id": 35787,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Essence Fix &#038; Last 18H Make-Up Fixing Spray",
    "size": "Standard",
    "photo": "/products/bbk_35787.jpg",
    "photos": [
      "/products/bbk_35787.jpg"
    ],
    "price": 1400,
    "regular_price": 1400,
    "benefit_line": "Authentic Essence Fix &#038; Last 18H Make-Up Fixing Spray with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "Back and better than ever! Keep your makeup looking fresh all day with essence Fix & Last 18h Long-Lasting Make-Up Fixing Spray",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35770",
    "original_id": 35770,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Prism Makeup Matte Eyeshadow Palette Pro 18 Colors Pigmented Solitude",
    "size": "Standard",
    "photo": "/products/bbk_35770.jpg",
    "photos": [
      "/products/bbk_35770.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Prism Makeup Matte Eyeshadow Palette Pro 18 Colors Pigmented  Solitude with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The UCANBE Prism Makeup Matte Eyeshadow Palette Pro (04# Solitude) is a 18-shade, highly pigmented palette featuring a versatile mix of matte, shimmer, and metallic finishes . It includes cool and vibrant tones like pinky roses, dusty coffee, rustic red, and purple, with a cream-like, blendable formula designed for long-lasting wear",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35750",
    "original_id": 35750,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "S oft Glam satin concealer medium buildable coverage",
    "size": "Standard",
    "photo": "/products/bbk_35750.jpg",
    "photos": [
      "/products/bbk_35750.jpg"
    ],
    "price": 1200,
    "regular_price": 1200,
    "benefit_line": "Authentic S oft Glam satin concealer  medium buildable coverage with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The e.l.f. Cosmetics Soft Glam Satin Concealer is a lightweight, creamy, and long-lasting concealer designed for a natural, satin finish. It provides medium buildable coverage that effectively covers dark circles, redness, and blemishes while resisting creasing and transferring . Infused with 1% hydrating hibiscus complex and hyaluronic acid, it keeps skin hydrated for a smooth, non-cakey look",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35745",
    "original_id": 35745,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Soft Glam Satin Foundation - Medium Coverage",
    "size": "Standard",
    "photo": "/products/bbk_35745.jpg",
    "photos": [
      "/products/bbk_35745.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/04/tan-warm.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/04/deep-warm-50.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Soft Glam Satin Foundation &#8211; Medium Coverage with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The e.l.f. Cosmetics Soft Glam Satin Foundation is a long-lasting, lightweight liquid foundation offering medium, buildable coverage with a smooth satin finish",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35727",
    "original_id": 35727,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Halo Glow Powder Filter - Pressed Finishing Powder",
    "size": "Standard",
    "photo": "/products/bbk_35727.jpg",
    "photos": [
      "/products/bbk_35727.jpg"
    ],
    "price": 2600,
    "regular_price": 2600,
    "benefit_line": "Authentic Halo Glow Powder Filter &#8211; Pressed Finishing Powder with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The e.l.f. Halo Glow Powder Filter is a lightweight, ultra-fine pressed finishing powder designed to provide a &#8220;social filter&#8221; effect in real life . It is engineered to blur the appearance of pores and fine lines while reducing excess shine for a soft-focus, airbrushed finish",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35725",
    "original_id": 35725,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "CoverGirl Clean Invisible pressed Powder -Lightweight",
    "size": "Standard",
    "photo": "/products/bbk_35725.jpg",
    "photos": [
      "/products/bbk_35725.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/165-TAWNY.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/Golden-caramel-180.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/WARM-NUDE-158.webp"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic CoverGirl Clean Invisible pressed Powder -Lightweight with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "CoverGirl Clean Invisible pressed Powder is a lightweight, vegan setting powder designed to provide a natural, shine-free finish. This product is part of CoverGirl’s &#8220;Clean&#8221; line, which focuses on simpler, non-irritating ingredients",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35705",
    "original_id": 35705,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "UCANBE Baked Eyeshadow Makeup Palette with Hidden Gems, 16 Colors Nude Black",
    "size": "Standard",
    "photo": "/products/bbk_35705.jpg",
    "photos": [
      "/products/bbk_35705.jpg"
    ],
    "price": 1300,
    "regular_price": 1300,
    "benefit_line": "Authentic UCANBE Baked Eyeshadow Makeup Palette with Hidden Gems, 16 Colors Nude Black with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The UCANBE Baked Eyeshadow Makeup Palette with Hidden Gems is a 16-color collection featuring a mix of neutral, brown, soft pink, and gray tones . It uses a unique &#8220;baked&#8221; formula where cream ingredients are heated and compacted to create a silky, smooth texture that offers more intense pigment and better adhesion than traditional pressed powders. This palette is suitable for both b...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35703",
    "original_id": 35703,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Rimmel Natural Bronzer, 022 Sun Bronze",
    "size": "Standard",
    "photo": "/products/bbk_35703.jpg",
    "photos": [
      "/products/bbk_35703.jpg"
    ],
    "price": 1500,
    "regular_price": 1500,
    "benefit_line": "The Rimmel Natural Bronzer is an ultra-fine bronzing powder designed to create a natural-looking, sun-kissed glow.",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Rimmel Natural Bronzer is an ultra-fine bronzing powder designed to create a natural-looking, sun-kissed glow. Its lightweight, &#8220;barely-there&#8221; formula uses a blend of natural pigments to mimic the appearance of a real tan without looking heavy or cakey Key Features Velvety Texture : The soft, ultra-fine powder is specifically formulated to blend effortlessly into the skin for a ...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35697",
    "original_id": 35697,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Maybelline Lash Sensational BODY Mascara",
    "size": "Standard",
    "photo": "/products/bbk_35697.jpg",
    "photos": [
      "/products/bbk_35697.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Maybelline Lash Sensational BODY  Mascara with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Maybelline Lash Sensational Body™ Mascara is a full-volume lifting mascara designed to provide high-impact volume and a fanned-out effect that lasts for up to 24 hours . It is specifically engineered to lift and separate lashes without the heavy, &#8220;crunchy&#8221; feel of traditional volumising formulas",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35634",
    "original_id": 35634,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Beauty bar eye liner brush",
    "size": "Standard",
    "photo": "/products/bbk_35634.jpg",
    "photos": [
      "/products/bbk_35634.jpg"
    ],
    "price": 200,
    "regular_price": 200,
    "benefit_line": "Authentic Beauty bar eye liner brush with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "A fine eyeliner brush is a specialized makeup tool featuring ultra-thin, often tapered bristles designed for high-precision application of liquid, gel, or powder eyeliners . Its primary purpose is to create sharp, crisp lines and intricate details that standard pencils or thicker brushes cannot achieve",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35632",
    "original_id": 35632,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Milani Conceal + Perfect Blur Out Powder - Translucent - 0.17oz",
    "size": "Standard",
    "photo": "/products/bbk_35632.jpg",
    "photos": [
      "/products/bbk_35632.jpg"
    ],
    "price": 2400,
    "regular_price": 2400,
    "benefit_line": "Authentic Milani Conceal + Perfect Blur Out Powder &#8211; Translucent &#8211; 0.17oz with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Milani Conceal + Perfect Blur Out Powder in Translucent is a weightless, ultra-finely milled loose setting powder designed to create a soft-focus, &#8220;filter-like&#8221; effect on the skin . This talc-free formula blurs imperfections and absorbs excess oil to provide a luminous matte finish without appearing chalky or heavy",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35630",
    "original_id": 35630,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "SHEGLAM Color Bloom Liquid Blush Makeup for Cheeks Matte Finish",
    "size": "Standard",
    "photo": "/products/bbk_35630.jpg",
    "photos": [
      "/products/bbk_35630.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/love-cake.webp",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/swipe-right.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/cutie-pie.webp"
    ],
    "price": 1600,
    "regular_price": 1600,
    "benefit_line": "Authentic SHEGLAM Color Bloom Liquid Blush Makeup for Cheeks Matte Finish with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "SHEGLAM Color Bloom Liquid Blush is a highly rated, affordable, and cruelty-free creamy blush designed for a soft matte, natural-looking finish . It features a unique, built-in sponge applicator for easy, streak-free blending and is known for being long-lasting, lightweight, and buildable, making it a popular choice for achieving a, rosy, matte flush",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35624",
    "original_id": 35624,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "L. A. GIRL | Pro Coverage HD Long Wear Illuminating Foundation",
    "size": "Standard",
    "photo": "/products/bbk_35624.jpg",
    "photos": [
      "/products/bbk_35624.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/TOAST.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/RICH-COCOA.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/DARK-CHOCOLATE.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/COFFEE.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/BRONZE.jpg"
    ],
    "price": 1500,
    "regular_price": 1500,
    "benefit_line": "Authentic L. A. GIRL | Pro Coverage HD Long Wear Illuminating Foundation with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "PRO.coverage HD Illuminating Foundation has a buildable, lightweight, antioxidant rich formula that hydrates and helps improve skin appearance while you wear. Cover imperfections, and even out skin tone with a dewy, radiant finish that looks like your skin, but better. It’s like having a pro MUA in a bottle. PRO Tip: Try the white foundation mixer to lighten your summer shade for winter or use ...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35621",
    "original_id": 35621,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "LA Girl Pro. Matte Foundation Mixing Pigment",
    "size": "Standard",
    "photo": "/products/bbk_35621.jpg",
    "photos": [
      "/products/bbk_35621.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/yellow.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/ORANGE.webp",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/blue.jpg"
    ],
    "price": 1500,
    "regular_price": 1550,
    "benefit_line": "Authentic LA Girl Pro. Matte Foundation Mixing Pigment with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The L.A. Girl PRO.color Foundation Mixing Pigment is a highly pigmented liquid additive designed to adjust the shade and undertone of liquid or cream foundations . It allows users to customize their existing products for a more precise skin tone match, particularly when a foundation is slightly off-season or has the wrong undertone",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35588",
    "original_id": 35588,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Elf Makeup Mist & Set 2x The Original 4.1oz",
    "size": "Standard",
    "photo": "/products/bbk_35588.jpg",
    "photos": [
      "/products/bbk_35588.jpg"
    ],
    "price": 1600,
    "regular_price": 1600,
    "benefit_line": "Authentic Elf Makeup Mist &amp; Set 2x The Original 4.1oz with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The e.l.f. Makeup Mist & Set Spray is designed to hold your face and eye makeup in place all day and to revitalize makeup color with just a few sprays.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35578",
    "original_id": 35578,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "L'Oreal Infallible 3-Second Setting Spray",
    "size": "Standard",
    "photo": "/products/bbk_35578.jpg",
    "photos": [
      "/products/bbk_35578.jpg"
    ],
    "price": 2500,
    "regular_price": 2500,
    "benefit_line": "Authentic L&#8217;Oreal Infallible 3-Second Setting Spray with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The L'Oreal Paris Infallible 3-Second Setting Mist is a fast-drying, professional-inspired aerosol spray designed to lock makeup in place for up to 36 hours . It features a microfine mist technology that applies an even, lightweight layer to prevent makeup from smudging, cracking, or transferring",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35571",
    "original_id": 35571,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "NOTE Brow master wax 50ml",
    "size": "Standard",
    "photo": "/products/bbk_35571.jpg",
    "photos": [
      "/products/bbk_35571.jpg"
    ],
    "price": 2100,
    "regular_price": 2100,
    "benefit_line": "Authentic NOTE Brow master wax  50ml with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "Note Cosmetics Brow Master Wax 50ml An easy-to-use brow fixing wax that combs, styles, and sculpts every brow hair with a long-lasting clear gel. It instantly gives brows a lifted, modern appearance while providing extreme hold.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35570",
    "original_id": 35570,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Maybelline Super stay concealer full coverage 65",
    "size": "Standard",
    "photo": "/products/bbk_35570.jpg",
    "photos": [
      "/products/bbk_35570.jpg"
    ],
    "price": 1740,
    "regular_price": 1740,
    "benefit_line": "SuperStay Full Coverage Under-Eye Liquid Concealer to transform the look of tired eyes.",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "SuperStay Full Coverage Under-Eye Liquid Concealer to transform the look of tired eyes. This full-coverage, yet breathable formula grips",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35534",
    "original_id": 35534,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Kara Beauty Never Ending Paradise Shadow Palette 15 Colors",
    "size": "Standard",
    "photo": "/products/bbk_35534.jpg",
    "photos": [
      "/products/bbk_35534.jpg"
    ],
    "price": 2500,
    "regular_price": 2500,
    "benefit_line": "Authentic Kara Beauty Never Ending Paradise Shadow Palette 15 Colors with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Kara Beauty Never Ending Paradise (ES118) palette is a 15-shade, travel-friendly eyeshadow palette featuring a mix of soft pastels, vivid pops of color, and essential warm tones . It includes a blend of matte and shimmer formulas designed for versatile, high-pigment looks. The cruelty-free, vegan palette includes shades like &#8220;It Exists&#8221; (shimmery coral) and &#8220;Dreamland&#822...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35533",
    "original_id": 35533,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Kara Beauty Sweetest Treat Shadow Palette 24 Colors",
    "size": "Standard",
    "photo": "/products/bbk_35533.jpg",
    "photos": [
      "/products/bbk_35533.jpg"
    ],
    "price": 2700,
    "regular_price": 2700,
    "benefit_line": "The Kara Beauty Sweetest Treat 24-Color Shadow Palette offers a feast of highly pigmented, multi-finish shades.",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Kara Beauty Sweetest Treat 24-Color Shadow Palette offers a feast of highly pigmented, multi-finish shades. This vegan and cruelty-free palette features a curated mix of buttery mattes, silky shimmers, and pressed glitters in assorted, &#8220;candy-like&#8221; hues, designed to deliver epic pigment payoff and seamless blendability. The versatile formula allows for endless creative possibili...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35525",
    "original_id": 35525,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Maybelline Super Stay Lumi-Matte Foundation, Lightweight and Buildable Full Coverage Foundation Makeup For Up To 30HR Wear",
    "size": "Standard",
    "photo": "/products/bbk_35525.jpg",
    "photos": [
      "/products/bbk_35525.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/368.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/356.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/351.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/340.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/337.jpg"
    ],
    "price": 2400,
    "regular_price": 2400,
    "benefit_line": "Authentic Maybelline Super Stay Lumi-Matte Foundation, Lightweight and Buildable Full Coverage Foundation Makeup For Up To 30HR Wear with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "Maybelline Super Stay Lumi-Matte Foundation is a long-wear, liquid foundation offering up to 30 hours of breathable, buildable, full coverage with a lightweight, luminous matte finish . Infused with amino acids, this transfer-resistant formula resists sweat and water, ensuring a comfortable, non-flat, &#8220;light-as-air&#8221; look for all skin types.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35481",
    "original_id": 35481,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Kara Beauty Mademoiselle Shadow Palette 24 Colors",
    "size": "Standard",
    "photo": "/products/bbk_35481.jpg",
    "photos": [
      "/products/bbk_35481.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/kara-beauty-mademoiselle-shadow-palette-24-colors-190366_2048x.webp"
    ],
    "price": 2700,
    "regular_price": 2700,
    "benefit_line": "Authentic Kara Beauty Mademoiselle Shadow Palette 24 Colors with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The Kara Beauty Mademoiselle Shadow Palette is a refined and timeless collection of 24 highly pigmented eyeshadows designed to create versatile looks for any occasion, from day to night. It offers a mix of finishes, including buttery mattes, silky shimmers, and pressed glitters, all in a blendable, paraben-free, cruelty-free, and vegan formula. Product Features & Benefits Versatile 24 Shades : ...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35480",
    "original_id": 35480,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "KARA BEAUTY Tropical Vibes Eyeshadow Palette 28 Colors",
    "size": "Standard",
    "photo": "/products/bbk_35480.jpg",
    "photos": [
      "/products/bbk_35480.jpg"
    ],
    "price": 2800,
    "regular_price": 2800,
    "benefit_line": "Authentic KARA BEAUTY Tropical Vibes Eyeshadow Palette 28 Colors with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The KARA BEAUTY Tropical Vibes Eyeshadow Palette 28 Colors is a highly pigmented, cruelty-free palette featuring a versatile mix of bright and neutral shades to create various eye looks . It combines velvety smooth matte and shimmering finishes that blend effortlessly and are long-lasting. Key Product Details Shades : The palette includes 28 shades that combine bright, tropical-inspired colors ...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35479",
    "original_id": 35479,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Better Brows Mini Eyebrow Palette - Light to Medium",
    "size": "Standard",
    "photo": "/products/bbk_35479.jpg",
    "photos": [
      "/products/bbk_35479.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/better-brows.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Better Brows Mini Eyebrow Palette &#8211; Light to Medium with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Makeup & Prep",
    "description": "The KARA Beauty Better Brows Mini Eyebrow Palette - Light to Medium is a compact, travel-friendly kit featuring four buildable, soft-focus powders and two high-pigment pomades for shaping, sculpting, and defining brows . Key Features Customizable Looks : The versatile shades allow for a range of looks, from natural, everyday definition using the powders to bold, dramatic arches with the pomades...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_36062",
    "original_id": 36062,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Vaseline® Lip Therapy® Advanced Healing Tube",
    "size": "Standard",
    "photo": "/products/bbk_36062.jpg",
    "photos": [
      "/products/bbk_36062.jpg"
    ],
    "price": 850,
    "regular_price": 850,
    "benefit_line": "Authentic Vaseline® Lip Therapy® Advanced Healing Tube with fast delivery countrywide",
    "in_stock": true,
    "featured": true,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "Vaseline Lip Therapy Advanced Healing is a fragrance-free, restorative lip balm designed to instantly soothe, moisturize, and heal severely dry, cracked, or chapped lips",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35998",
    "original_id": 35998,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "BELLAZURI Matte Liquid Lipstick16HR Long Wear, Soft Finish",
    "size": "Standard",
    "photo": "/products/bbk_35998.jpg",
    "photos": [
      "/products/bbk_35998.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/037.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/36.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/lipstick-05.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/08/o35.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "The Bellazuri Matte Liquid Lipstick is a long-wear lip color priced at KES 1,800 .",
    "in_stock": true,
    "featured": true,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The Bellazuri Matte Liquid Lipstick is a long-wear lip color priced at KES 1,800 . It features a 16-hour formula that provides rich, full coverage in a single stroke. Infused with African shea butter and avocado oil, it delivers a soft, velvety matte finish without cracking or drying out the lips",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35955",
    "original_id": 35955,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "EOS Sun. Sea Spritz 24H Moisture Super Balm",
    "size": "Standard",
    "photo": "/products/bbk_35955.jpg",
    "photos": [
      "/products/bbk_35955.jpg"
    ],
    "price": 1200,
    "regular_price": 1200,
    "benefit_line": "Authentic EOS Sun. Sea Spritz 24H Moisture Super Balm with fast delivery countrywide",
    "in_stock": true,
    "featured": true,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The eos Sun. Sea. Spritz. (also known as the Seaside Spritz) collection is a line of summer-inspired lip balms and treatments designed to mimic the feeling of a sun-soaked European vacation.These ultra-hydrating balms glide on effortlessly with a lightweight, non-greasy finish. They are formulated to leave your lips feeling soft, smooth, and nourished for 24 hours.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35949",
    "original_id": 35949,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Saltair Lip Oil Balm",
    "size": "Standard",
    "photo": "/products/bbk_35949.jpg",
    "photos": [
      "/products/bbk_35949.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/09/prickly-pear.webp",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/09/goji.avif",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/09/dragon-fruit.webp",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/09/buff.jpeg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/09/Acai.webp"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Saltair Lip Oil Balm with fast delivery countrywide",
    "in_stock": true,
    "featured": true,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "Saltair’s Lip Oil Balms are hydrating hybrids that combine the cushiony feel of a balm with the high-shine finish of a lip oil. Formulated with coconut oil, murumuru butter, shea butter, and plant-derived esters, they drench dry lips in moisture without feeling heavy or sticky",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35883",
    "original_id": 35883,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Revlon Super Lustrous The Gloss, Non-Sticky, High Shine Finish",
    "size": "Standard",
    "photo": "/products/bbk_35883.jpg",
    "photos": [
      "/products/bbk_35883.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/05/215-super.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/05/crystal-clear.jpg"
    ],
    "price": 2000,
    "regular_price": 2000,
    "benefit_line": "Authentic Revlon Super Lustrous The Gloss, Non-Sticky, High Shine Finish with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "This silky high shine lip gloss delivers lush color, major shine, and such great hydration, you might retire your lip balm. Shout-out to color, moisture, and multidimensional shine.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35879",
    "original_id": 35879,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "NICKA K NEW YORK Hydrating Lip Gel - With Vitamin E - All Flavours",
    "size": "Standard",
    "photo": "/products/bbk_35879.jpg",
    "photos": [
      "/products/bbk_35879.jpg"
    ],
    "price": 950,
    "regular_price": 950,
    "benefit_line": "Authentic NICKA K NEW YORK Hydrating Lip Gel &#8211; With Vitamin E &#8211; All Flavours with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The NICKA K NEW YORK Hydrating Lip Gel is a lightweight, non-sticky lip gloss infused with Vitamin E to deeply moisturize, soften, and protect lips . It glides on effortlessly to deliver a smooth gel texture and a brilliant, ultra-glossy mirror finish with a subtle hint of color",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35877",
    "original_id": 35877,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "NYX PROFESSIONAL MAKEUP Fat Oil 07 Scrollin",
    "size": "Standard",
    "photo": "/products/bbk_35877.jpg",
    "photos": [
      "/products/bbk_35877.jpg"
    ],
    "price": 2000,
    "regular_price": 2000,
    "benefit_line": "Authentic NYX PROFESSIONAL MAKEUP Fat Oil 07 Scrollin with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The NYX Fat Oil Lip Drip in the shade &#8220;Scrollin'&#8221; is a deep caramel tinted lip gloss that delivers up to 12 hours of hydration . It features a comfortable, non-sticky formula that provides the high shine of a lip gloss with the conditioning benefits of a vegan lip oil",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35875",
    "original_id": 35875,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Ruby Kisses Hydrating Lip Gloss Clear Hydrating Lip Gloss",
    "size": "Standard",
    "photo": "/products/bbk_35875.jpg",
    "photos": [
      "/products/bbk_35875.jpg"
    ],
    "price": 600,
    "regular_price": 600,
    "benefit_line": "Authentic Ruby Kisses Hydrating Lip Gloss Clear Hydrating Lip Gloss with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "Ruby Kisses Hydrating Lip Oil Treatment Gloss is a hybrid lip care solution that functions as a high-shine gloss and deep-conditioning treatment . This lightweight, non-sticky oil formula intensely moisturizes, repairs, and protects dry, chapped lips. It is widely used for both standalone daily nourishment and as a glowing top-coat over lipstick.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35873",
    "original_id": 35873,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Ruby Kisses Broadway Vita-Lip Tinted &#038; Clear Lip Gloss",
    "size": "Standard",
    "photo": "/products/bbk_35873.jpg",
    "photos": [
      "/products/bbk_35873.jpg"
    ],
    "price": 600,
    "regular_price": 600,
    "benefit_line": "Authentic Ruby Kisses Broadway Vita-Lip Tinted &#038; Clear Lip Gloss with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The Ruby Kisses (Broadway) Vita-Lip Tinted & Clear Lip Gloss is an ultra-hydrating, multi-vitamin lip oil gloss that provides a brilliant, glass-like shine without any sticky residue . Designed for daily wear, it helps soothe, moisturize, and reduce fine lines while giving lips a natural, plump appearance",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35870",
    "original_id": 35870,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "L.A. COLORS High Shine Shea Butter Lip Gloss",
    "size": "Standard",
    "photo": "/products/bbk_35870.jpg",
    "photos": [
      "/products/bbk_35870.jpg"
    ],
    "price": 1000,
    "regular_price": 1000,
    "benefit_line": "Authentic L.A. COLORS High Shine Shea Butter Lip Gloss with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The L.A. COLORS High Shine Shea Butter Lip Gloss is a moisturizing, ultra-pigmented gloss that delivers intense, buildable color and a glossy finish . Enriched with nourishing ingredients, it provides all-day comfort without the heavy build-up or stickiness of traditional glosses",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35868",
    "original_id": 35868,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Milani Stay Put Liquid Lip Longwear Lipstick Snatched",
    "size": "Standard",
    "photo": "/products/bbk_35868.jpg",
    "photos": [
      "/products/bbk_35868.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Milani Stay Put Liquid Lip Longwear Lipstick Snatched with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The Milani Stay Put Liquid Lip in the shade Snatched is a highly pigmented, long-wear liquid lipstick delivering bold, full-coverage color with a soft-focus matte finish . Infused with nourishing avocado oil and vitamin E, it provides a lightweight, airy texture that is designed to stay comfortable and transfer-proof for up to 12 hours.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35866",
    "original_id": 35866,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Milani Stay Put Matte Liquid Lipstick Smudge-Proof, Kiss-Proof, and Fade-Resistant Formula for All-Day Wear - Red Flag",
    "size": "Standard",
    "photo": "/products/bbk_35866.jpg",
    "photos": [
      "/products/bbk_35866.jpg"
    ],
    "price": 2500,
    "regular_price": 2500,
    "benefit_line": "Milani Stay Put Matte Liquid Lipstick in &#8220;Red Flag&#8221; is a highly pigmented, true red shade .",
    "in_stock": false,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "Milani Stay Put Matte Liquid Lipstick in &#8220;Red Flag&#8221; is a highly pigmented, true red shade . It features a lightweight, mousse-like texture that dries down to a soft-focus matte finish. Infused with Avocado Oil and Vitamin E, it delivers up to 12 hours of transfer-proof, all-day comfort.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35864",
    "original_id": 35864,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Milani Fruit Fetish Lip Oil 140 Cherry lime",
    "size": "Standard",
    "photo": "/products/bbk_35864.jpg",
    "photos": [
      "/products/bbk_35864.jpg"
    ],
    "price": 2100,
    "regular_price": 2100,
    "benefit_line": "Authentic Milani Fruit Fetish Lip Oil 140 Cherry lime with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The Milani Fruit Fetish Lip Oil in Cherry Lime is a glossy, non-sticky treatment that delivers instant hydration and a subtle pop of color . Infused with Vitamin E and fruit extracts, the custom oil blend leaves lips feeling ultra-comfortable, nourished, and naturally moisturized",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35709",
    "original_id": 35709,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Burts And Bees Lip Balm",
    "size": "Standard",
    "photo": "/products/bbk_35709.jpg",
    "photos": [
      "/products/bbk_35709.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/mango.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/pink-grapefruit.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/coconut-pear.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/03/pomegranate.jpg"
    ],
    "price": 600,
    "regular_price": 600,
    "benefit_line": "Authentic Burts And Bees Lip Balm with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "Burt's Bees Lip Balm is a 100% natural, intensely moisturizing lip care product formulated with responsibly sourced beeswax, vitamin E, and peppermint oil to hydrate, soften, and soothe dry lips . Known for its iconic refreshing tingle, it offers a matte, non-greasy finish that leaves lips feeling healthy and smooth without parabens, phthalates, or petrolatum",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35629",
    "original_id": 35629,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "eos 24H Moisture Super Balm - Strawberry Sorbet",
    "size": "Standard",
    "photo": "/products/bbk_35629.jpg",
    "photos": [
      "/products/bbk_35629.jpg"
    ],
    "price": 1200,
    "regular_price": 1200,
    "benefit_line": "Authentic eos 24H Moisture Super Balm &#8211; Strawberry Sorbet with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "EOS 24H Moisture Super Balm in Strawberry Sorbet is a deeply conditioning, dermatologist-recommended lip treatment designed for dry, sensitive skin . It features a fruity, sweet scent and is formulated with hydrating shea, cocoa, and avocado butters to provide 24-hour moisture. The formula is hypoallergenic, cruelty-free, and free from parabens, phthalates, and gluten",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35606",
    "original_id": 35606,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "NYX PROFESSIONAL Makeup Butter Gloss, Eclair",
    "size": "Standard",
    "photo": "/products/bbk_35606.jpg",
    "photos": [
      "/products/bbk_35606.jpg"
    ],
    "price": 1400,
    "regular_price": 1400,
    "benefit_line": "NYX Professional Makeup Butter Gloss in Éclair is a fan-favourite pale cool-toned pink lip gloss .",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "NYX Professional Makeup Butter Gloss in Éclair is a fan-favourite pale cool-toned pink lip gloss . Like the rest of the Butter Gloss line, it is known for its non-sticky , creamy texture that provides sheer-to-medium coverage with a high-shine finish.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35574",
    "original_id": 35574,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "NOTE Peptide lip balm",
    "size": "Standard",
    "photo": "/products/bbk_35574.jpg",
    "photos": [
      "/products/bbk_35574.jpg"
    ],
    "price": 1400,
    "regular_price": 1400,
    "benefit_line": "Authentic NOTE Peptide lip balm with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The NOTE Paris Peptide Lip Balm is a multifunctional treatment designed to provide a &#8220;glassy&#8221; high-shine finish while actively nourishing and plumping lips from within . Unlike traditional balms, this formula uses a skin-care-first approach to address lip health both immediately and over time",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35573",
    "original_id": 35573,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Zaron Matte Lip fix",
    "size": "Standard",
    "photo": "/products/bbk_35573.jpg",
    "photos": [
      "/products/bbk_35573.jpg"
    ],
    "price": 1500,
    "regular_price": 1500,
    "benefit_line": "Authentic Zaron Matte Lip fix with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The Zaron Matte Lip Fix is a weightless, long-wearing liquid lipstick that delivers a bold, velvety matte finish without chapping or flaking the lips . Specially formulated for a tropical climate and diverse skin tones, this highly pigmented formula provides full, opaque coverage in a single swipe",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35572",
    "original_id": 35572,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "NOTE Lip oil 60",
    "size": "Standard",
    "photo": "/products/bbk_35572.jpg",
    "photos": [
      "/products/bbk_35572.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic NOTE Lip oil 60 with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "The NOTE Paris Lip Oil (Shade 60 - Mocha Kiss) is a moisturizing lip treatment that combines the high-shine finish of a gloss with the deep hydration of an oil . It is specifically formulated to revive dry, chapped lips while providing a lightweight, non-sticky feel",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35569",
    "original_id": 35569,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "NYX PROFESSIONAL Makeup Butter Gloss, Non-Sticky",
    "size": "Standard",
    "photo": "/products/bbk_35569.jpg",
    "photos": [
      "/products/bbk_35569.jpg"
    ],
    "price": 1400,
    "regular_price": 1400,
    "benefit_line": "NYX Professional Makeup Butter Gloss in Salty Coco is a versatile dusty nude mauve lip gloss .",
    "in_stock": true,
    "featured": false,
    "badge": "POPULAR LIP",
    "category": "Lip Care",
    "description": "NYX Professional Makeup Butter Gloss in Salty Coco is a versatile dusty nude mauve lip gloss . Like others in the line, it is celebrated for its non-sticky , creamy texture that offers sheer-to-medium coverage with a high-shine finish",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35944",
    "original_id": 35944,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Clinical Invisible Solid Antiperspirant Deodorant",
    "size": "Standard",
    "photo": "/products/bbk_35944.jpg",
    "photos": [
      "/products/bbk_35944.jpg"
    ],
    "price": 2800,
    "regular_price": 2800,
    "benefit_line": "Authentic Clinical Invisible Solid Antiperspirant Deodorant with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "Secret Clinical Strength 100HR Antiperspirant with Hyaluronic Acid in the &#8220;Buzzer Beater Berry&#8221; scent (endorsed by basketball player Paige Bueckers) is an advanced, PETA-certified cruelty-free deodorant. It offers up to 100 hours of wetness and odor protection while using hyaluronic acid to hydrate and strengthen the underarm skin barrier.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35934",
    "original_id": 35934,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "THORNE Perimenopause Complete",
    "size": "Standard",
    "photo": "/products/bbk_35934.jpg",
    "photos": [
      "/products/bbk_35934.jpg"
    ],
    "price": 8000,
    "regular_price": 8000,
    "benefit_line": "Authentic THORNE Perimenopause Complete with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "Thorne offers a dedicated supplement called Perimenopause Complete, specifically formulated to ease the most common physical and emotional symptoms of the perimenopausal transition.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35932",
    "original_id": 35932,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Purely Optimal Magnesium Complex",
    "size": "Standard",
    "photo": "/products/bbk_35932.jpg",
    "photos": [
      "/products/bbk_35932.jpg"
    ],
    "price": 4500,
    "regular_price": 4500,
    "benefit_line": "Authentic Purely Optimal Magnesium Complex with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "Purely Optimal Magnesium Complex is a premium 6-in-1 supplement delivering 500 mg of magnesium per serving across highly bioavailable forms: bisglycinate chelate, citrate, malate, taurate, oxide, and aspartate. It is engineered for maximum absorption to support deeper sleep, stress relief, muscle recovery, and heart health without upsetting sensitive stomachs.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35906",
    "original_id": 35906,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Vaseline Glazed and Glisten Body Shimmer Gel Oil",
    "size": "Standard",
    "photo": "/products/bbk_35906.jpg",
    "photos": [
      "/products/bbk_35906.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/06/sunlit.webp",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/06/vaseline.jpg"
    ],
    "price": 2450,
    "regular_price": 2450,
    "benefit_line": "Vaseline Glazed & Glisten Body Gel Oil | Vanilla & Cocoa Shimmer has a g low that catches the light.",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "Vaseline Glazed & Glisten Body Gel Oil | Vanilla & Cocoa Shimmer has a g low that catches the light.A lightweight gel-oil with shimmering pearl that melts into skin and leaves a soft, glowing finish with an indulgent warm vanilla and toasted cocoa fragrance.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35816",
    "original_id": 35816,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "BB LAB THE COLLAGEN POWDER S PLUS LOW MOLECULAR COLLAGEN 30 sachets 60G",
    "size": "Standard",
    "photo": "/products/bbk_35816.jpg",
    "photos": [
      "/products/bbk_35816.jpg"
    ],
    "price": 3500,
    "regular_price": 3500,
    "benefit_line": "If your looking for clear healthy skin, nails and good hair.",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "If your looking for clear healthy skin, nails and good hair. Each stick contains 1,200 mg of fish collagen with vitamin C, hyaluronic acid, elastin cysteine, and 12 kinds of mixed lactic acid bacteria for the best possible results. LOW-MOLECULAR COLLAGEN : Skin regeneration product to absorb collagen before sleep. Our low-molecular (1,000 DA) fish/marine collagen allows for quick and efficient ...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35780",
    "original_id": 35780,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Cerave anti-dandruff hydrating shampoo",
    "size": "Standard",
    "photo": "/products/bbk_35780.jpg",
    "photos": [
      "/products/bbk_35780.jpg"
    ],
    "price": 2400,
    "regular_price": 2400,
    "benefit_line": "Authentic Cerave anti-dandruff hydrating shampoo with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "CeraVe Anti-Dandruff Hydrating Shampoo is a dermatologist-developed, sulfate-free formula that treats dandruff while restoring moisture",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35773",
    "original_id": 35773,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "CeraVe Moisturizing Cream 19 oz – Body &#038; Face Moisturizer for Dry Skin",
    "size": "Standard",
    "photo": "/products/bbk_35773.jpg",
    "photos": [
      "/products/bbk_35773.jpg"
    ],
    "price": 4500,
    "regular_price": 4500,
    "benefit_line": "Authentic CeraVe Moisturizing Cream 19 oz – Body &#038; Face Moisturizer for Dry Skin with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "CeraVe Moisturizing Cream (19 oz) is a rich, non-greasy, daily moisturizer developed with dermatologists to hydrate and restore the protective skin barrier . Formulated with three essential ceramides, hyaluronic acid, and patented MVE controlled-release technology , it provides 24-hour hydration for normal to very dry skin on both the face and body.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35694",
    "original_id": 35694,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Drop of Luminosity Organic Rosehip Oil Skin &#038; Hair Oil",
    "size": "Standard",
    "photo": "/products/bbk_35694.jpg",
    "photos": [
      "/products/bbk_35694.jpg"
    ],
    "price": 3800,
    "regular_price": 3800,
    "benefit_line": "Authentic Drop of Luminosity Organic Rosehip Oil Skin &#038; Hair Oil with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "Cliganic Drop of Luminosity Organic Rosehip Oil is a 100% pure, cold-pressed, and USDA-certified organic multi-purpose oil designed for both skin and hair care . It is often described as a &#8220;radiance-boosting hydrator&#8221; because it naturally exfoliates and locks in moisture without leaving a greasy residue",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35597",
    "original_id": 35597,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Tree Hut Fragrance Body Mist - Vanilla - 6 fl oz",
    "size": "Standard",
    "photo": "/products/bbk_35597.jpg",
    "photos": [
      "/products/bbk_35597.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/tree-hut.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Tree Hut Fragrance Body Mist &#8211; Vanilla &#8211; 6 fl oz with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "The Tree Hut Fragrance Body Mist - Vanilla - 6 fl oz is a hydrating, alcohol-free body spray designed to provide a long-lasting, cozy scent without drying out the skin . Infused with glycerin , it acts as a natural humectant to help condition and soften the skin with every spritz",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35510",
    "original_id": 35510,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "EOS Shea Better 24 Hour Moisture Body Lotion",
    "size": "Standard",
    "photo": "/products/bbk_35510.jpg",
    "photos": [
      "/products/bbk_35510.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/JASMINE-PEACH.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/POMOGRANATE.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/pink-champagne.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/fresh-and-cozy-1.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/coconut-waters-1.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2025/09/eos-Shea-butter-lotion.jpeg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/02/creme-d.jpg"
    ],
    "price": 3200,
    "regular_price": 3250,
    "benefit_line": "A silky, lightweight body lotion that delivers 24 hours of moisture without the greasy feel.",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Bath & Body",
    "description": "A silky, lightweight body lotion that delivers 24 hours of moisture without the greasy feel. Absorbs fast, smells amazing, and leaves your skin soft, smooth, and totally touchable.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35812",
    "original_id": 35812,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Nutrione TECA Calming Aqua Sunscreen",
    "size": "Standard",
    "photo": "/products/bbk_35812.jpg",
    "photos": [
      "/products/bbk_35812.jpg"
    ],
    "price": 2500,
    "regular_price": 2500,
    "benefit_line": "Authentic Nutrione TECA Calming Aqua Sunscreen with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Sunscreen & SPF",
    "description": "Nutrione TECA Calming Aqua Sunscreen (50ml) is a lightweight, hydrating sunscreen providing broad-spectrum SPF50+ PA++++ protection to soothe and moisturize sensitive skin. It features a fast-absorbing, non-sticky formula designed to leave no white cast, suitable for daily wear and hydration",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35808",
    "original_id": 35808,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Ohana Escape Desert Moisture Sun Serum SPF 50+ PA++",
    "size": "Standard",
    "photo": "/products/bbk_35808.jpg",
    "photos": [
      "/products/bbk_35808.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "Authentic Ohana Escape Desert Moisture Sun Serum SPF 50+ PA++ with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Sunscreen & SPF",
    "description": "Ohana Escape Desert Moisture Sun Serum (SPF 50+ PA++++) is a Korean-designed, lightweight, 75% moisture-essence formula tailored for diverse skin tones. It offers high-level UV protection, brightens, and hydrates without a white cast. Key ingredients like niacinamide and hyaluronic acid make it suitable for all skin types, including sensitive skin",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35797",
    "original_id": 35797,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "CeraVe Invisible Mineral Face Sunscreen - SPF 50 with 3 essential ceramides,niacinamide &#038;minerall technology",
    "size": "Standard",
    "photo": "/products/bbk_35797.jpg",
    "photos": [
      "/products/bbk_35797.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "Mineral sunscreen for all skin tones and skin types, offers 100% invisible finish and protection against UVA/UVB rays.",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Sunscreen & SPF",
    "description": "Mineral sunscreen for all skin tones and skin types, offers 100% invisible finish and protection against UVA/UVB rays.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35859",
    "original_id": 35859,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Eclat midnight retinol night cream with vitamin E +Hyaluronic acid",
    "size": "Standard",
    "photo": "/products/bbk_35859.jpg",
    "photos": [
      "/products/bbk_35859.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "Authentic Eclat midnight retinol night cream with vitamin E +Hyaluronic acid with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "The Eclat Midnight Retinol Night Cream (often branded as Midnight Miracle) is a deeply hydrating anti-aging moisturizer formulated to visibly reduce fine lines, wrinkles, and dullness while you sleep. It pairs the renewing power of Vitamin A with intense moisturizers and soothing antioxidant",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35848",
    "original_id": 35848,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Cetaphil Water Gel for Deep Skin Hydration",
    "size": "Standard",
    "photo": "/products/bbk_35848.jpg",
    "photos": [
      "/products/bbk_35848.jpg"
    ],
    "price": 4800,
    "regular_price": 4800,
    "benefit_line": "Authentic Cetaphil Water Gel for Deep Skin Hydration with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "Cetaphil Deep Hydration Skin Restoring Water Gel is a lightweight, cooling facial moisturizer designed for dry and sensitive skin . It features a 72-hour hydration formula with Hyaluronic Acid and Polyglutamic Acid, aiming to boost skin moisture, restore the barrier, and provide a non-greasy, plumped appearance",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35846",
    "original_id": 35846,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "TOTARIA HEALTH NMNH NICOTINAMIDE RIBOSIDE NOCOTINAMIDE QUERCETIN RESVERATROL NAD+LEVELS ANTI AGING SUPPORT",
    "size": "Standard",
    "photo": "/products/bbk_35846.jpg",
    "photos": [
      "/products/bbk_35846.jpg"
    ],
    "price": 5600,
    "regular_price": 5600,
    "benefit_line": "Authentic TOTARIA HEALTH NMNH NICOTINAMIDE RIBOSIDE NOCOTINAMIDE QUERCETIN RESVERATROL NAD+LEVELS ANTI AGING SUPPORT with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare",
    "description": "Totaria NMNH – Advanced NAD+ Support for Vitality & Longevity Boost NAD+ Levels Naturally Formulated with NMNH, a powerful next-generation NAD+ precursor, this supplement supports healthy aging, energy, cellular repair, and immune function. Advanced Synergistic Formula Combines NMNH with Nicotinamide Riboside, Nicotinamide, Quercetin, and Resveratrol to enhance brain health, DNA repair, and ove...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35840",
    "original_id": 35840,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Nizoral Anti-Dandruff Shampoo with 1% Ketoconazole, 14 Fl Oz, Fresh Scent, Anti Fungal Shampoo",
    "size": "Standard",
    "photo": "/products/bbk_35840.jpg",
    "photos": [
      "/products/bbk_35840.jpg"
    ],
    "price": 3500,
    "regular_price": 3500,
    "benefit_line": "Authentic Nizoral Anti-Dandruff Shampoo with 1% Ketoconazole, 14 Fl Oz, Fresh Scent, Anti Fungal Shampoo with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35814",
    "original_id": 35814,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Nutrione TECATECA Calming Pore Cleansing Oil(200ml)",
    "size": "Standard",
    "photo": "/products/bbk_35814.jpg",
    "photos": [
      "/products/bbk_35814.jpg"
    ],
    "price": 3200,
    "regular_price": 3200,
    "benefit_line": "Authentic Nutrione TECATECA Calming Pore Cleansing Oil(200ml) with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "MD'SPICK Tecateca Calming Pore Cleansing Oil is a 200ml vegan cleansing oil designed to remove impurities, excess sebum, and blackheads while soothing sensitive skin with Madecassoside and Centella Asiatica (TECA). It is a lightweight, non-irritating formula that emulsifies quickly",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35791",
    "original_id": 35791,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Matte Eyeshadow Palette Pro 18 Colors Pigmented shimmer with glitters",
    "size": "Standard",
    "photo": "/products/bbk_35791.jpg",
    "photos": [
      "/products/bbk_35791.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Matte Eyeshadow Palette Pro 18 Colors Pigmented shimmer with glitters with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare",
    "description": "The UCANBE Supreme Seductress Eyeshadow Palette is an 18-color, high-pigment palette featuring a mix of matte, shimmer, and metallic finishes.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35785",
    "original_id": 35785,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "MAREE 4-IN-1 Exfoliating Toner with Salicylic Acid,Mandelic,Glycolic and Lactic Acids – AHA BHA",
    "size": "Standard",
    "photo": "/products/bbk_35785.jpg",
    "photos": [
      "/products/bbk_35785.jpg"
    ],
    "price": 2000,
    "regular_price": 2000,
    "benefit_line": "Authentic MAREE 4-IN-1 Exfoliating Toner with Salicylic Acid,Mandelic,Glycolic and Lactic Acids – AHA BHA with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "The MAREE 4-in-1 Exfoliating Face Toner is a lightweight AHA/BHA liquid exfoliant designed to smooth, refresh, brighten, and hydrate skin.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35782",
    "original_id": 35782,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "MAREE Pore Minimizer for Face Toner Witch Hazel Toner,Niacinamide &#038; Marine Collagen",
    "size": "Standard",
    "photo": "/products/bbk_35782.jpg",
    "photos": [
      "/products/bbk_35782.jpg"
    ],
    "price": 2000,
    "regular_price": 2000,
    "benefit_line": "Authentic MAREE Pore Minimizer for Face Toner Witch Hazel Toner,Niacinamide &#038; Marine Collagen with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "MAREE Pore Minimizing Face Toner is a hydrating and clarifying astringent designed to refine skin texture and reduce the appearance of pores, often used for a &#8220;glass skin&#8221; effect",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35704",
    "original_id": 35704,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Aveeno Positively Radiant Clear Complexion Daily Moisturizer Salicylic Acid Acne Treatment",
    "size": "Standard",
    "photo": "/products/bbk_35704.jpg",
    "photos": [
      "/products/bbk_35704.jpg"
    ],
    "price": 3200,
    "regular_price": 3200,
    "benefit_line": "Authentic Aveeno Positively Radiant Clear Complexion Daily Moisturizer Salicylic  Acid Acne Treatment with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "The Aveeno Positively Radiant Clear Complexion Daily Moisturizer is an oil-free facial treatment designed specifically for breakout-prone skin . It combines acne-fighting medication with skin-brightening ingredients to improve overall complexion without dulling natural radiance",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35636",
    "original_id": 35636,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Andalou - Age Defying Berry Enzyme Mask",
    "size": "Standard",
    "photo": "/products/bbk_35636.jpg",
    "photos": [
      "/products/bbk_35636.jpg"
    ],
    "price": 3550,
    "regular_price": 3550,
    "benefit_line": "Authentic Andalou &#8211; Age Defying Berry Enzyme Mask with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "The Andalou Naturals Age Defying BioActive 8 Berry Fruit Enzyme Mask is a rejuvenating treatment designed to gently exfoliate and revitalize dry, mature, and sensitive skin. Using natural fruit enzymes and potent antioxidants, it works to dissolve dull surface cells and support a firmer, more youthful complexion Key Benefits and Usefulness This mask serves several therapeutic functions to impro...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35631",
    "original_id": 35631,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Andalou Naturals Blossom + Leaf Toning Refresher",
    "size": "Standard",
    "photo": "/products/bbk_35631.jpg",
    "photos": [
      "/products/bbk_35631.jpg"
    ],
    "price": 2200,
    "regular_price": 2200,
    "benefit_line": "Authentic Andalou Naturals Blossom + Leaf Toning Refresher with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "The Andalou Naturals Age Defying Blossom + Leaf Toning Refresher is a 98% nature-derived facial mist designed to instantly hydrate, replenish nutrients, and balance the skin's pH . Part of the brand's Age Defying collection, it uses &#8220;Fruit Stem Cell Science&#8221; to support skin vitality and a youthful appearance Key Benefits and Usefulness This refresher serves several functional purpos...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35594",
    "original_id": 35594,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Aveeno Positively Radiant Daily Face Moisturizer Lotion with SPF 15, 4 oz",
    "size": "Standard",
    "photo": "/products/bbk_35594.jpg",
    "photos": [
      "/products/bbk_35594.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "Authentic Aveeno Positively Radiant Daily Face Moisturizer Lotion with SPF 15, 4 oz with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "Aveeno Positively Radiant Daily Facial Moisturizer with Broad Spectrum SPF 15 sunscreen & with clinically proven soy improves skin tone & texture revealing radiant looking skin & leaves skin feeling softer. Soy contains antioxidant compounds, as well as proteins, lipids & carbohydrates which boost radiance & brighten skin. This daily face moisturizer with sunscreen is designed to be fast-absorb...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35585",
    "original_id": 35585,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Olay Total Effects 7 in one Fragrance Free Face Moisturizer1.7FL 0Z",
    "size": "Standard",
    "photo": "/products/bbk_35585.jpg",
    "photos": [
      "/products/bbk_35585.jpg"
    ],
    "price": 4050,
    "regular_price": 4050,
    "benefit_line": "Authentic Olay Total Effects 7 in one Fragrance Free Face Moisturizer1.7FL 0Z with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "OLAY TOTAL EFFECTS 7 IN 1 ANTI-AGEING FRAGRANCE FREE MOISTURISER 50ML Nourished & hydrated skin in one simple step7 benefits in one help keep skin at its youthful, radiant bestFormula supercharged with antioxidant vitamins B3, C E, as well as Pro-Vitamin B5",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35564",
    "original_id": 35564,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Amazon Basics Morning Fresh Facial Cleanser with Vitamin C and BHA 8 fl oz",
    "size": "Standard",
    "photo": "/products/bbk_35564.jpg",
    "photos": [
      "/products/bbk_35564.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Amazon Basics Morning Fresh Facial Cleanser with Vitamin C and BHA 8 fl oz with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Skincare & Face",
    "description": "The Amazon Basics Morning Fresh Facial Cleanser with Ginseng and Vitamin C (8 fl oz) is a daily, oil-free face wash suitable for all skin types. It is designed to cleanse and refresh the skin without the use of harsh chemicals like parabens, phthalates, or sulfates. Key Ingredients : Formulated with revitalizing ginseng root extract and Vitamin C for a brighter complexion. Gentle Exfoliation : ...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35942",
    "original_id": 35942,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "e.l.f. SKIN Bright Icon Vitamin C + E + Ferulic Serum",
    "size": "Standard",
    "photo": "/products/bbk_35942.jpg",
    "photos": [
      "/products/bbk_35942.jpg"
    ],
    "price": 3950,
    "regular_price": 3950,
    "benefit_line": "Authentic e.l.f. SKIN Bright Icon Vitamin C + E + Ferulic Serum with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "The e.l.f. SKIN Bright Icon Vitamin C + E + Ferulic Serum is a potent, non-greasy brightening treatment. It features a powerhouse blend of 15% vitamin C, 1% vitamin E, and 0.5% ferulic acid. It is designed to even out skin tone, fade dark spots, smooth fine lines, and give your complexion a luminous glow",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35938",
    "original_id": 35938,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "BYOMA Brightening Serum,Tri ceramide complex +Niacinamide +Hyaluronic acid",
    "size": "Standard",
    "photo": "/products/bbk_35938.jpg",
    "photos": [
      "/products/bbk_35938.jpg",
      "https://thebeautybarkenya.com/wp-content/uploads/2026/07/images.jpg"
    ],
    "price": 3800,
    "regular_price": 3800,
    "benefit_line": "BYOMA Brightening Serum is a lightweight, fragrance-free face serum designed to improve dullness and hyperpigmentation.",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "BYOMA Brightening Serum is a lightweight, fragrance-free face serum designed to improve dullness and hyperpigmentation. Packed with niacinamide to even skin tone, hyaluronic acid for hydration, and a proprietary Tri-Ceramide Complex, it boosts radiance while protecting your skin barrier",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35911",
    "original_id": 35911,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Minimalist Retinol 0.6% Serum For Face",
    "size": "Standard",
    "photo": "/products/bbk_35911.jpg",
    "photos": [
      "/products/bbk_35911.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "A powerful anti-aging Retinol serum formulated in a stable, water-free system for retaining efficacy of Retinol.",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "A powerful anti-aging Retinol serum formulated in a stable, water-free system for retaining efficacy of Retinol. Packed with quality ingredients like Coenzyme Q10, Squalane and Rosehip Oil for delivering excellent results",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35862",
    "original_id": 35862,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Andalou Naturals Turmeric + Vitamin C Enlighten Serum",
    "size": "Standard",
    "photo": "/products/bbk_35862.jpg",
    "photos": [
      "/products/bbk_35862.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "Authentic Andalou Naturals Turmeric + Vitamin C Enlighten Serum with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "The Andalou Naturals Turmeric + Vitamin C Enlighten Serum is a 99% nature-derived, vegan brightening treatment designed to target dark spots, uneven skin tone, and sun damage . Priced around \\(\\$28\\) to \\(\\$29\\), it uses the brand’s signature Fruit Stem Cell Science along with antioxidants to promote a luminous complexion.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35855",
    "original_id": 35855,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Minimalist Retinol 0.6% Face Serum",
    "size": "Standard",
    "photo": "/products/bbk_35855.jpg",
    "photos": [
      "/products/bbk_35855.jpg"
    ],
    "price": 3000,
    "regular_price": 3000,
    "benefit_line": "A powerful anti-aging Retinol serum formulated in a stable, water-free system for retaining efficacy of Retinol.",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "A powerful anti-aging Retinol serum formulated in a stable, water-free system for retaining efficacy of Retinol. Packed with quality ingredients like Coenzyme Q10, Squalane and Rosehip Oil for delivering excellent results",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35810",
    "original_id": 35810,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "MDSPICK Tecateca Calming Deep Ampoule 30ml",
    "size": "Standard",
    "photo": "/products/bbk_35810.jpg",
    "photos": [
      "/products/bbk_35810.jpg"
    ],
    "price": 3500,
    "regular_price": 3500,
    "benefit_line": "Authentic MDSPICK Tecateca Calming Deep Ampoule 30ml with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "MDSPICK Tecateca Calming Deep Ampoule (30ml) is a vegan, gel-like soothing serum designed to rapidly calm irritated, red, or sensitive skin while strengthening the barrier with TECA (Titrated Extract of Centella Asiatica) . It features a lightweight, non-greasy, fast-absorbing texture that delivers deep hydration using a 10-type hyaluronic acid complex and panthenol",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35682",
    "original_id": 35682,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "The Ordinary Argireline Solution 10% 30ml",
    "size": "Standard",
    "photo": "/products/bbk_35682.jpg",
    "photos": [
      "/products/bbk_35682.jpg"
    ],
    "price": 2450,
    "regular_price": 2450,
    "benefit_line": "Authentic The Ordinary Argireline Solution 10% 30ml with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "The Ordinary Argireline Solution 10% 30ml is a popular, affordable water-based serum designed to reduce the appearance of dynamic wrinkles and fine lines, particularly around the forehead and eyes . It features a 10% concentration of Acetyl Hexapeptide-8 (Argireline™) to improve skin elasticity and promote a smoother, more relaxed, and firmer complexion",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35681",
    "original_id": 35681,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "The Ordinary Matrixyl 10% + HA 1 oz/ 30 mL",
    "size": "Standard",
    "photo": "/products/bbk_35681.jpg",
    "photos": [
      "/products/bbk_35681.jpg"
    ],
    "price": 2400,
    "regular_price": 2400,
    "benefit_line": "Authentic The Ordinary Matrixyl 10% + HA 1 oz/ 30 mL with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "The Ordinary Matrixyl 10% + HA is a skin-firming anti-aging serum that targets fine lines with two generations of Matrixyl™ peptides and hydrating hyaluronic acid, promoting firmer, plumper skin. Matrixyl puts up an unrivalled fight against the effects of skin ageing. utilising two ‘generations’ of this miraculous ingredient – Matrixyl 3000 and Matrixyl Synthe’6 – at a combined concentration of...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35635",
    "original_id": 35635,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Andalou Naturals Dark Spot Corrector Brightening Face Serum with Vitamin C",
    "size": "Standard",
    "photo": "/products/bbk_35635.jpg",
    "photos": [
      "/products/bbk_35635.jpg"
    ],
    "price": 3500,
    "regular_price": 3500,
    "benefit_line": "Authentic Andalou Naturals Dark Spot Corrector Brightening Face Serum with Vitamin C with fast delivery countrywide",
    "in_stock": false,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "The Andalou Naturals Brightening Dark Spot Corrector is a clinically proven treatment designed to visibly reduce the appearance of dark spots, fine lines, and wrinkles in as little as four weeks . Formulated with 5% Vitamin C and a specialized &#8220;Spot-Targeting Complex,&#8221; this serum targets hyperpigmentation caused by UV damage, aging, and post-acne marks without lightening the overall...",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35616",
    "original_id": 35616,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Cliganic, Vitamin E Oil, 1 fl oz (30 ml)",
    "size": "Standard",
    "photo": "/products/bbk_35616.jpg",
    "photos": [
      "/products/bbk_35616.jpg"
    ],
    "price": 1800,
    "regular_price": 1800,
    "benefit_line": "Authentic Cliganic, Vitamin E Oil, 1 fl oz (30 ml) with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "Cliganic Vitamin E Oil (1 fl oz / 30 ml) is a high-potency, multi-purpose treatment containing 30,000 IU of natural D-Alpha Tocopherol sourced from non-GMO soybeans . It is a 100% pure, unrefined oil designed to deeply nourish the skin, hair, and nails while providing antioxidant protection",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_bbk_35591",
    "original_id": 35591,
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Neutrogena Collagen Bank 15% Vitamin C Face Serum",
    "size": "Standard",
    "photo": "/products/bbk_35591.jpg",
    "photos": [
      "/products/bbk_35591.jpg"
    ],
    "price": 3600,
    "regular_price": 3600,
    "benefit_line": "Authentic Neutrogena Collagen Bank 15% Vitamin C Face Serum with fast delivery countrywide",
    "in_stock": true,
    "featured": false,
    "badge": "VERIFIED QUALITY",
    "category": "Serums & Actives",
    "description": "Help strengthen and preserve collagen with Neutrogena's Collagen Bank Vitamin C Face Serum, featuring 15% pure vitamin C and 2% PHA for gentle exfoliation. This non-comedogenic formula promotes an even skin tone and enhances glow and plumpness, supported by patented Micro-Peptide Technology. Users report visible improvements in skin appearance with daily use over 12 weeks.",
    "highlights": [
      "100% Original & Authentic",
      "Nationwide Delivery in Kenya",
      "Direct Shop Pickup (Jamia Mall F47)",
      "M-Pesa Verified Seller"
    ],
    "companion_id": "prod_bbk_elf_brightening"
  },
  {
    "id": "prod_glownd_1022",
    "seller_id": "seller_glownd",
    "name": "The Valenne Statement Bag - Cream",
    "size": "Standard",
    "photo": "/products/glownd/glownd_1022.png",
    "photos": [
      "/products/glownd/glownd_1022.png",
      "https://glownd.com/wp-content/uploads/2026/09/2b58b2bf-26f6-4b2c-9523-3ba87c992a92.png",
      "https://glownd.com/wp-content/uploads/2026/09/a3a99ed1-54ba-49fb-a414-fa7a336d7728.png",
      "https://glownd.com/wp-content/uploads/2026/09/c4d5f7aa-80a6-45a9-bdf4-bf4d3828e197.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": true,
    "badge": "BESTSELLER",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Premium The Valenne Statement Bag - Cream. High quality structured craftsmanship, durable hardware, and elegant finish for everyday and occasion wear.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_1018",
    "seller_id": "seller_glownd",
    "name": "Vexa Mini Luxury Croc Bag - Red",
    "size": "Standard",
    "photo": "/products/glownd/glownd_1018.png",
    "photos": [
      "/products/glownd/glownd_1018.png",
      "https://glownd.com/wp-content/uploads/2026/09/1efacf88-383b-4e7e-ad1a-b96da07ea88f.png",
      "https://glownd.com/wp-content/uploads/2026/09/c3456a3e-7500-40a6-9a5c-e91e1652a3f7.png",
      "https://glownd.com/wp-content/uploads/2026/09/95821f5e-b02e-4b06-9358-d05f14034b8c.png"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": true,
    "badge": "BESTSELLER",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Croc Bags",
    "description": "Make a statement with the Vexa Mini Luxury Croc Bag - Red, a chic and eye-catching mini handbag featuring a glossy crocodile-textured finish, structured silhouette, elegant top handle, and polished silver clasp. Perfect for elevating everyday outfits, date nights, brunches, parties, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_1013",
    "seller_id": "seller_glownd",
    "name": "Vexa Mini Luxury Croc Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_1013.png",
    "photos": [
      "/products/glownd/glownd_1013.png",
      "https://glownd.com/wp-content/uploads/2026/09/18a4de74-ac31-4b6c-844f-5786db2f78a5.png",
      "https://glownd.com/wp-content/uploads/2026/09/8b7ff850-f984-46fc-a33e-c1f04de039c2.png",
      "https://glownd.com/wp-content/uploads/2026/09/581ba0a1-fecf-4301-8366-ccee0ab2637c.png",
      "https://glownd.com/wp-content/uploads/2026/09/330fb2cf-2424-4a48-bb8d-3c1f1ae3058a.png"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": false,
    "featured": true,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Croc Bags",
    "description": "The Vexa Mini Luxury Croc Bag - Black is a sleek and sophisticated statement bag featuring a glossy croc-textured finish, structured silhouette, elegant top handle, and polished metal clasp. Perfect for elevating everyday outfits, date nights, dinners, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_1009",
    "seller_id": "seller_glownd",
    "name": "Vexa Mini Luxury Croc Bag - Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_1009.png",
    "photos": [
      "/products/glownd/glownd_1009.png",
      "https://glownd.com/wp-content/uploads/2026/09/635e8c71-b252-49f3-b2c7-017d4bb302be.png",
      "https://glownd.com/wp-content/uploads/2026/09/86d9d24e-d035-45b8-a296-3953a5d33357.png",
      "https://glownd.com/wp-content/uploads/2026/09/467b1903-402e-444a-a64b-1f1868be930d.png"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": true,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Croc Bags",
    "description": "Elevate your everyday style with the Vexa Mini Luxury Croc Bag - Brown, a chic and sophisticated mini handbag featuring a glossy crocodile-textured finish, structured silhouette, elegant top handle, and polished clasp detail. Its compact design makes it perfect for carrying your essentials while adding an effortlessly luxe touch to any outfit. Ideal for brunches, date nights, events, dinners, and stylish everyday looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_1001",
    "seller_id": "seller_glownd",
    "name": "Vienne C-Clasp Shoulder Bag - Black Smooth",
    "size": "Standard",
    "photo": "/products/glownd/glownd_1001.png",
    "photos": [
      "/products/glownd/glownd_1001.png",
      "https://glownd.com/wp-content/uploads/2026/09/f274b67a-cf53-4982-9cb4-8f93f693e9af.png",
      "https://glownd.com/wp-content/uploads/2026/09/c32ec622-00f8-4256-b415-39b278f6bc6d.png",
      "https://glownd.com/wp-content/uploads/2026/09/fc77bd23-7a1e-402c-bfc4-7d48f6204037.png",
      "https://glownd.com/wp-content/uploads/2026/09/b0283b00-0f09-42af-99d5-96d674fc90cf.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": true,
    "badge": "BESTSELLER",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "The black smooth Vienne C-Clasp Shoulder Bag Is a sleek and elegant shoulder bag featuring a smooth, refined finish, structured silhouette, and statement C-shaped clasp. A timeless accessory designed to elevate both everyday and occasion-ready looks. Comes beautifully boxed.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch",
      "Comes Beautifully Boxed"
    ]
  },
  {
    "id": "prod_glownd_995",
    "seller_id": "seller_glownd",
    "name": "Vienne C-Clasp Shoulder Bag - Black Pebbled",
    "size": "Standard",
    "photo": "/products/glownd/glownd_995.png",
    "photos": [
      "/products/glownd/glownd_995.png",
      "https://glownd.com/wp-content/uploads/2026/09/6b7a385b-8a0b-4698-808e-bb5e4ad03659.png",
      "https://glownd.com/wp-content/uploads/2026/09/ccd72a6a-fa17-48ee-9830-0b10ac339470.png",
      "https://glownd.com/wp-content/uploads/2026/09/c8ab9814-ebd9-40cb-bd4e-1504d5660853.png",
      "https://glownd.com/wp-content/uploads/2026/09/65c6dfbd-e9a8-4993-a82b-4059c48bf5d3.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": true,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "The Vienne C-Clasp Shoulder Bag - Black Pebbled is a timeless statement piece featuring a structured silhouette, elegant flap design, and distinctive C-shaped clasp. Its rich pebbled texture adds depth and sophistication, while the classic black shade makes it effortlessly versatile. Perfect for everyday outings, brunches, dinners, date nights, parties, and special occasions. Comes beautifully boxed, making it a stylish gift choice.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch",
      "Comes Beautifully Boxed"
    ]
  },
  {
    "id": "prod_glownd_989",
    "seller_id": "seller_glownd",
    "name": "Selene Mini Crossbody Bag - Lilac Purple",
    "size": "Standard",
    "photo": "/products/glownd/glownd_989.png",
    "photos": [
      "/products/glownd/glownd_989.png",
      "https://glownd.com/wp-content/uploads/2026/09/932857a7-3586-48c2-9f88-5bd846971391.png",
      "https://glownd.com/wp-content/uploads/2026/09/08c45da3-a9fc-440b-a5b2-002fa9b22498.png",
      "https://glownd.com/wp-content/uploads/2026/09/bf537f1f-17b0-4895-8d3b-969ef34e766e.png",
      "https://glownd.com/wp-content/uploads/2026/09/f0818e35-9fb2-47f1-bc25-363cf048d5c4.png"
    ],
    "price": 1800,
    "regular_price": 2000,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "Selene Mini Crossbody Bag - Lilac Purple is a chic and compact handbag designed for effortless everyday style. Featuring a soft lilac purple finish, quilted detailing, gold-tone hardware, a ruched top handle, and a detachable chain strap, this mini crossbody bag adds a feminine and trendy touch to any outfit.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_984",
    "seller_id": "seller_glownd",
    "name": "Selene Mini Crossbody Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_984.png",
    "photos": [
      "/products/glownd/glownd_984.png",
      "https://glownd.com/wp-content/uploads/2026/09/21f0bcd0-56c0-4f5e-8070-8dc8c040d061.png",
      "https://glownd.com/wp-content/uploads/2026/09/d58c4dcd-708f-4044-aa65-699298ff7a06.png",
      "https://glownd.com/wp-content/uploads/2026/09/e2879ab5-80a6-4dbb-93a6-be8f62d28c13.png",
      "https://glownd.com/wp-content/uploads/2026/09/ab32c3cf-7ad6-4d45-aae2-6fb78c2df245.png"
    ],
    "price": 1800,
    "regular_price": 2000,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Selene Mini Crossbody Bag - Black is a chic and compact handbag featuring a stylish quilted design, structured silhouette, gold-tone hardware, and a unique ruched top handle. Perfect for adding an elegant touch to both everyday and dressy looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_980",
    "seller_id": "seller_glownd",
    "name": "Dahlia Quilted Structured Handbag - Grey",
    "size": "Standard",
    "photo": "/products/glownd/glownd_980.png",
    "photos": [
      "/products/glownd/glownd_980.png",
      "https://glownd.com/wp-content/uploads/2026/09/326e2595-3115-4286-8673-88090fc7d77e.png",
      "https://glownd.com/wp-content/uploads/2026/09/42a44b4e-c1c0-402c-8772-9f1cd3fbf4ba.png",
      "https://glownd.com/wp-content/uploads/2026/09/a19686cf-feda-4bae-9e5a-1f19ddf05ddc.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Elevate your everyday style with the Dahlia Quilted Structured Handbag in Grey. Featuring a sophisticated quilted design, structured silhouette, elegant top handles, and stylish hardware details, this versatile handbag is perfect for work, brunch, shopping, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_977",
    "seller_id": "seller_glownd",
    "name": "Dahlia Quilted Structured Handbag - Red",
    "size": "Standard",
    "photo": "/products/glownd/glownd_977.png",
    "photos": [
      "/products/glownd/glownd_977.png",
      "https://glownd.com/wp-content/uploads/2026/09/43302e76-2993-4b93-b281-bdd4d82410da.png",
      "https://glownd.com/wp-content/uploads/2026/09/b1c90481-379e-49a6-8aa0-9463a5ddf919.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Dahlia Quilted Structured Handbag - Red combines timeless elegance with modern style. Featuring a chic quilted design, structured shape, top handles, and statement charm, this compact medium handbag is perfect for everyday wear, work, brunch, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_973",
    "seller_id": "seller_glownd",
    "name": "Kylie Luxury Handbag - Nude",
    "size": "Standard",
    "photo": "/products/glownd/glownd_973.png",
    "photos": [
      "/products/glownd/glownd_973.png",
      "https://glownd.com/wp-content/uploads/2026/09/f1bb5318-0029-4a65-9045-ea53d50151b6.png",
      "https://glownd.com/wp-content/uploads/2026/09/770bba9c-e220-477f-85d9-9a1a5d0319b3.png",
      "https://glownd.com/wp-content/uploads/2026/09/f1270acf-94a2-464f-889a-6fc167310af5.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Kylie Luxury Handbag - Nude is a chic structured handbag designed for effortless elegance. Featuring a sophisticated nude finish, textured design, stylish top handles, gold-tone hardware, and a versatile shoulder strap, it's the perfect accessory for work, brunch, shopping, dinners, and special occasions. A timeless neutral handbag that instantly elevates any outfit.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_970",
    "seller_id": "seller_glownd",
    "name": "Kylie Luxury Handbag - Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_970.png",
    "photos": [
      "/products/glownd/glownd_970.png",
      "https://glownd.com/wp-content/uploads/2026/09/cfe77223-d21c-494f-b64e-7e8ad2a6f6eb.png",
      "https://glownd.com/wp-content/uploads/2026/09/478b6b33-9ed0-43c8-9749-222d735bc153.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Kylie Luxury Handbag - Brown is a classy structured handbag featuring a rich brown textured finish, elegant gold-tone hardware, and a spacious interior. Perfect for work, casual outings, dinners, events, and stylish everyday looks. A timeless luxury-inspired handbag and beautiful gift choice.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_966",
    "seller_id": "seller_glownd",
    "name": "Kylie Luxury Handbag - White",
    "size": "Standard",
    "photo": "/products/glownd/glownd_966.png",
    "photos": [
      "/products/glownd/glownd_966.png",
      "https://glownd.com/wp-content/uploads/2026/09/271f1dbf-7056-4386-b80d-0bcea03f4c13.png",
      "https://glownd.com/wp-content/uploads/2026/09/53692021-f381-404f-b6b9-4841d5191451.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Elevate your everyday style with the Kylie Luxury Handbag - White, a sophisticated statement bag designed for effortless elegance. Its structured silhouette, refined gold-tone hardware, and timeless white finish make it the perfect accessory for both everyday outfits and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_962",
    "seller_id": "seller_glownd",
    "name": "Kylie Luxury Handbag - Peach",
    "size": "Standard",
    "photo": "/products/glownd/glownd_962.png",
    "photos": [
      "/products/glownd/glownd_962.png",
      "https://glownd.com/wp-content/uploads/2026/09/2ab118f3-35b8-46c5-96e3-40f1467a83ef.png",
      "https://glownd.com/wp-content/uploads/2026/09/55aefc17-e1e3-40ba-bef0-6d641867857c.png",
      "https://glownd.com/wp-content/uploads/2026/09/8523071e-76a8-4961-b2c2-c2558d8522bb.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Kylie Luxury Handbag - Peach is an elegant structured handbag designed to add a sophisticated touch to any outfit. Featuring a beautiful peach tone, polished gold-tone hardware, and a timeless top-handle design, this luxury-inspired handbag is perfect for everyday styling, work, brunch, special occasions, and evening looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_957",
    "seller_id": "seller_glownd",
    "name": "Kylie Luxury Handbag - Green",
    "size": "Standard",
    "photo": "/products/glownd/glownd_957.png",
    "photos": [
      "/products/glownd/glownd_957.png",
      "https://glownd.com/wp-content/uploads/2026/09/a2bf21eb-a845-4d36-b8ed-b9b7aca1d7db.png",
      "https://glownd.com/wp-content/uploads/2026/09/43906cc1-be01-4e05-9f40-ca8b909b39d5.png",
      "https://glownd.com/wp-content/uploads/2026/09/4b34a6ee-6631-4302-81c5-1e44c7afe822.jpeg"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Make a statement with the Kylie Luxury Handbag - Green, a sophisticated structured handbag designed to elevate your everyday and occasion looks. Featuring a rich green finish, elegant gold-tone hardware, and a classic top-handle silhouette, it's the perfect blend of timeless style and modern luxury.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_953",
    "seller_id": "seller_glownd",
    "name": "Kylie Luxury Handbag - Blue",
    "size": "Standard",
    "photo": "/products/glownd/glownd_953.jpeg",
    "photos": [
      "/products/glownd/glownd_953.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/5f1166c6-91c8-4839-9be0-e98cbb67b14d.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/28ed8202-3ccc-491f-98f8-1666139569a2.png"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Kylie Luxury Handbag - Blue is a sophisticated structured handbag designed to elevate your everyday and occasion looks. Featuring a timeless silhouette, elegant gold-tone hardware, and a refined blue finish, this luxury-inspired handbag adds effortless polish to any outfit.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_939",
    "seller_id": "seller_glownd",
    "name": "Celine Vivienne Luxury Handbag - Orange",
    "size": "Standard",
    "photo": "/products/glownd/glownd_939.png",
    "photos": [
      "/products/glownd/glownd_939.png",
      "https://glownd.com/wp-content/uploads/2026/09/d93baf04-a470-450b-a89e-ceffdc512db5.png",
      "https://glownd.com/wp-content/uploads/2026/09/f4afed55-6d06-4ab8-9d7f-6e6066e5c3ee.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/3818dce2-7a73-47e5-a4eb-525c96bef893.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/f344c605-e9c6-418e-97cf-300bf0c2c485.png"
    ],
    "price": 5500,
    "regular_price": 6300,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Make a statement with the Celine Vivienne Luxury Handbag - Orange. Featuring a structured design, elegant top handle, gold-tone hardware and a vibrant orange finish, this stylish handbag adds sophistication and colour to any outfit. Perfect for everyday styling, special occasions and for gifting someone special.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_938",
    "seller_id": "seller_glownd",
    "name": "Celine Vivienne Luxury Handbag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_938.png",
    "photos": [
      "/products/glownd/glownd_938.png",
      "https://glownd.com/wp-content/uploads/2026/09/013be229-dae4-4b9c-83b6-09ee64ec8b84.png",
      "https://glownd.com/wp-content/uploads/2026/09/d67fa78a-bd52-4aa7-9354-59923102c86c.png",
      "https://glownd.com/wp-content/uploads/2026/09/a6264e12-782e-438c-ac81-0ea351de8222.png",
      "https://glownd.com/wp-content/uploads/2026/09/a850f17b-c71a-4956-b213-863b02a9f08c.png",
      "https://glownd.com/wp-content/uploads/2026/09/afb0a419-9284-4f18-8571-9584da7df76a.png"
    ],
    "price": 5500,
    "regular_price": 6300,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": true,
    "badge": "BESTSELLER",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Celine Vivienne Luxury Handbag - Black combines timeless elegance with a sophisticated structured design. Featuring a sleek black finish, elegant top handle, and gold-tone hardware, it's a versatile luxury handbag perfect for everyday styling, office looks, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_933",
    "seller_id": "seller_glownd",
    "name": "Celine Vivienne Luxury Handbag - Red",
    "size": "Standard",
    "photo": "/products/glownd/glownd_933.png",
    "photos": [
      "/products/glownd/glownd_933.png",
      "https://glownd.com/wp-content/uploads/2026/09/f1544aef-acc7-4793-8424-4005f619c2e0.png",
      "https://glownd.com/wp-content/uploads/2026/09/23d7dfab-3939-4ba9-9c9a-a16afca3c4da.png",
      "https://glownd.com/wp-content/uploads/2026/09/img_6892.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/3d10f36a-08c5-49b7-a7a4-5b2dc3b0c19d.png"
    ],
    "price": 5500,
    "regular_price": 6300,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Celine Vivienne Luxury Handbag - Red combines timeless elegance with a bold, sophisticated finish. Featuring a structured silhouette, refined gold-tone hardware, and a vibrant red colour, it's the perfect statement handbag for everyday styling, special occasions, and elegant outings.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_927",
    "seller_id": "seller_glownd",
    "name": "Celine Vivienne Luxury Handbag - Purple",
    "size": "Standard",
    "photo": "/products/glownd/glownd_927.png",
    "photos": [
      "/products/glownd/glownd_927.png",
      "https://glownd.com/wp-content/uploads/2026/09/3f9cfc62-cfde-46aa-9c01-3c82240414c9.png",
      "https://glownd.com/wp-content/uploads/2026/09/feaa5308-7431-4a86-a428-70043897f410.png",
      "https://glownd.com/wp-content/uploads/2026/09/0e91b0fd-aa51-4129-adeb-9ea46859333d.png",
      "https://glownd.com/wp-content/uploads/2026/09/1607c2a9-940f-42a4-a962-46227dbd2a71.png"
    ],
    "price": 5500,
    "regular_price": 6300,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Elevate your style with the Celine Vivienne Luxury Handbag in Purple, a sophisticated structured handbag designed for timeless elegance. Featuring a polished gold-tone clasp, refined textured finish, top handle, and detachable shoulder strap, it's perfect for both everyday luxury and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_921",
    "seller_id": "seller_glownd",
    "name": "Nova Minimalist Tote Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_921.jpeg",
    "photos": [
      "/products/glownd/glownd_921.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/b31f7523-c101-4b85-a773-5e420fa6d3ce.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/373c6175-2089-45c8-aa01-60c8515ad45b.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/7915e5b9-2c06-4b04-a11b-11fb92b7ece5.png",
      "https://glownd.com/wp-content/uploads/2026/09/8437997b-bc1a-4512-8779-1621217cb5c3.png"
    ],
    "price": 3000,
    "regular_price": 3400,
    "benefit_line": "Spacious everyday tote with minimalist finish & comfortable shoulder drop",
    "in_stock": true,
    "featured": true,
    "badge": "BESTSELLER",
    "category": "Handbags & Bags",
    "sub_category": "Tote Bags",
    "description": "The Nova Minimalist Tote Bag - Black is a sleek, versatile everyday bag designed for effortless style. Its clean, modern design makes it easy to pair with casual, office, and elevated looks. Perfect for work, shopping, brunch, travel, or everyday outings.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_916",
    "seller_id": "seller_glownd",
    "name": "Nova Minimalist Tote Bag - Cream",
    "size": "Standard",
    "photo": "/products/glownd/glownd_916.jpeg",
    "photos": [
      "/products/glownd/glownd_916.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/1ca1ddfa-9fae-4c60-8d88-770f80dd93e7.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/ef9b874e-d3b0-4134-b465-894f2e6323bc.png",
      "https://glownd.com/wp-content/uploads/2026/09/e4e26223-c204-431f-95d9-3f9ed7afdf81.png",
      "https://glownd.com/wp-content/uploads/2026/09/e766fc3c-9866-47f1-869f-5e5b3d4994ef.jpeg"
    ],
    "price": 3000,
    "regular_price": 3400,
    "benefit_line": "Spacious everyday tote with minimalist finish & comfortable shoulder drop",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Tote Bags",
    "description": "The Nova Minimalist Tote Bag - Cream combines clean, elegant design with everyday practicality. Its soft cream tone, subtle texture, and spacious tote silhouette make it a versatile choice for work, shopping, brunch, travel, and casual everyday looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_912",
    "seller_id": "seller_glownd",
    "name": "Nova Minimalist Tote Bag - Coffee Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_912.jpeg",
    "photos": [
      "/products/glownd/glownd_912.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/56501c77-d4b6-4cbb-9a5a-1452e6d7e6db.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/768e8e97-84ec-4ea6-916c-85aedcb96279.png",
      "https://glownd.com/wp-content/uploads/2026/09/2e007886-9abb-4ef8-ba70-45acc598d830.png"
    ],
    "price": 3000,
    "regular_price": 3400,
    "benefit_line": "Spacious everyday tote with minimalist finish & comfortable shoulder drop",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Tote Bags",
    "description": "The Nova Minimalist Tote Bag - Coffee Brown combines timeless style with everyday practicality. Its sleek silhouette, rich brown finish, long handles, and spacious design make it perfect for work, shopping, brunch, travel, and casual outings. A versatile everyday tote that adds effortless elegance to any look.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_908",
    "seller_id": "seller_glownd",
    "name": "Nova Minimalist Tote Bag - Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_908.jpeg",
    "photos": [
      "/products/glownd/glownd_908.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/778ed8b9-c076-425e-ace6-c153e3335d29.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/bf94267d-3344-47c4-bf63-398ab8b39818.png",
      "https://glownd.com/wp-content/uploads/2026/09/c9e4a906-8e0e-48da-aae4-6bcb413bd3f5.png"
    ],
    "price": 3000,
    "regular_price": 3400,
    "benefit_line": "Spacious everyday tote with minimalist finish & comfortable shoulder drop",
    "in_stock": true,
    "featured": false,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Tote Bags",
    "description": "Elevate your everyday style with the Nova Minimalist Tote Bag in Brown. Featuring a sleek, spacious design and warm brown finish, this versatile tote is perfect for work, shopping, casual outings, and everyday essentials.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_903",
    "seller_id": "seller_glownd",
    "name": "The Valenne Statement Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_903.png",
    "photos": [
      "/products/glownd/glownd_903.png",
      "https://glownd.com/wp-content/uploads/2026/09/5a664b92-2c13-4f28-b3cf-20218c224afc.png",
      "https://glownd.com/wp-content/uploads/2026/09/65b93868-a3ac-46cc-a2ef-0bb057a87428.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/ab79e8e1-45f0-4293-b36c-608c7ab7178e.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": true,
    "badge": "NEW ARRIVAL",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Valenne Statement Bag - Black is a chic and versatile handbag designed to elevate any outfit. Its timeless black finish makes it perfect for everyday styling, brunch dates, dinners, events, and special occasions. A sophisticated choice for yourself or as a stylish gift.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_897",
    "seller_id": "seller_glownd",
    "name": "The Valenne Statement Bag - Beige",
    "size": "Standard",
    "photo": "/products/glownd/glownd_897.png",
    "photos": [
      "/products/glownd/glownd_897.png",
      "https://glownd.com/wp-content/uploads/2026/09/f2cb6d9e-1614-4653-b139-30e70e115376.png",
      "https://glownd.com/wp-content/uploads/2026/09/e04dd8d3-39e8-48ec-aa07-ef2c3ce1e946.png",
      "https://glownd.com/wp-content/uploads/2026/09/25f3cdb6-504b-4e9d-b5b5-a3bdfddde6c0.png",
      "https://glownd.com/wp-content/uploads/2026/09/3a11c380-c378-4e76-8d3a-2d473f2ba9b3.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Valenne Statement Bag - Beige is an effortlessly chic handbag designed to add a polished touch to any outfit. Featuring a sleek envelope-style flap, elegant gold-tone hardware and a refined top handle, it's the perfect everyday accessory for both casual and dressy looks. A beautiful choice for gifting, too. 🤎",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_881",
    "seller_id": "seller_glownd",
    "name": "Cherry Muse Petal Bag Charm",
    "size": "Standard",
    "photo": "/products/glownd/glownd_881.jpeg",
    "photos": [
      "/products/glownd/glownd_881.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/4eaac1fd-7dfe-4e14-8991-5b8ce433a59a-1.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/a98a5ee9-4dd4-4276-a88b-f5afbbfca053-1.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/194fa46c-1c2d-4227-926f-0551e746c50d.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/85ae4751-7891-4369-8ab7-80f690fc9758-1.png",
      "https://glownd.com/wp-content/uploads/2026/09/27b86523-c51e-42a6-aade-475240ca002d-1.png"
    ],
    "price": 1000,
    "regular_price": 1100,
    "benefit_line": "Designer floral petal charm to personalize your favorite handbag",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Bag Accessories",
    "description": "Add a touch of playful elegance to your favourite bag with our Cherry Muse Petal Bag Charm. Featuring glossy cherry accents, delicate green leaves, and polished gold-tone detailing, this charming accessory is designed to instantly elevate your everyday bag. Clip it onto your handbag, shoulder bag, tote, or crossbody for a fun yet sophisticated finish.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_877",
    "seller_id": "seller_glownd",
    "name": "Clear Luxe Infinity Bag - Silver",
    "size": "Standard",
    "photo": "/products/glownd/glownd_877.png",
    "photos": [
      "/products/glownd/glownd_877.png",
      "https://glownd.com/wp-content/uploads/2026/09/1b7a3b05-7273-4dac-84d4-c9bed048a742.png",
      "https://glownd.com/wp-content/uploads/2026/09/4c97d061-f6ad-4fb6-bae7-258eb8130f5c.png",
      "https://glownd.com/wp-content/uploads/2026/09/399349ee-932c-4a70-9366-a7b86bfcc6a5.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Clear Luxe Infinity Bag - Silver is a sophisticated statement handbag featuring a structured transparent body, textured silver flap, elegant gold-tone hardware, and a distinctive infinity-inspired clasp. Designed with both a top handle and detachable shoulder strap, this versatile clear silver handbag is perfect for brunches, date nights, dinners, parties, weddings, birthdays, special events, and stylish everyday outings.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_873",
    "seller_id": "seller_glownd",
    "name": "Clear Luxe Infinity Bag - White & Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_873.png",
    "photos": [
      "/products/glownd/glownd_873.png",
      "https://glownd.com/wp-content/uploads/2026/09/20bc0a25-d7c6-4bc5-b54a-d97d99e05aef.png",
      "https://glownd.com/wp-content/uploads/2026/09/ac1ea48e-6a32-475e-92f1-6717fa2c8742.png",
      "https://glownd.com/wp-content/uploads/2026/09/02f2115d-c609-41c0-8a4f-c6bcb731d02a.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Clear Luxe Infinity Bag - White & Black features a sophisticated clear body paired with a textured white flap, white handles and elegant gold-tone hardware. Its chic structured design makes it perfect for brunches, date nights, dinners, parties, events, shopping and everyday outings, adding a polished statement to any outfit.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_870",
    "seller_id": "seller_glownd",
    "name": "Clear Luxe Infinity Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_870.png",
    "photos": [
      "/products/glownd/glownd_870.png",
      "https://glownd.com/wp-content/uploads/2026/09/2b555a29-1261-4d99-99d9-4d6dada3f54c.png",
      "https://glownd.com/wp-content/uploads/2026/09/1707bbe0-b8cf-43ae-812d-d395c8fc8c6b.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Clear Luxe Infinity Bag - Black is a stylish transparent black handbag designed for a modern, effortlessly chic look. Featuring a sleek infinity-inspired design, this versatile clear bag is perfect for everyday outfits, events, and fashion-forward styling.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_865",
    "seller_id": "seller_glownd",
    "name": "Clear Luxe Infinity Bag - Pink",
    "size": "Standard",
    "photo": "/products/glownd/glownd_865.jpeg",
    "photos": [
      "/products/glownd/glownd_865.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/af978455-98d3-4804-9bd0-0b430f0e69d7.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/43b2bd74-4eb4-4fc4-8506-85d2681a0fa1.png",
      "https://glownd.com/wp-content/uploads/2026/09/f6b8a3b0-a4c9-4900-a7c7-28f23581c739.jpeg"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Clear Luxe Infinity Bag - Pink is a chic statement handbag featuring a structured silhouette, clear panel detailing, and an elegant infinity-inspired clasp. The soft pink finish adds a feminine touch, making it perfect for elevating both everyday and dressy looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_857",
    "seller_id": "seller_glownd",
    "name": "Croc Effect Transparent T Bag - Mint Green",
    "size": "Standard",
    "photo": "/products/glownd/glownd_857.png",
    "photos": [
      "/products/glownd/glownd_857.png",
      "https://glownd.com/wp-content/uploads/2026/09/8317d7c2-c46c-4069-a163-cde8f160dcff.png",
      "https://glownd.com/wp-content/uploads/2026/09/df726668-3d93-4670-8609-1f7b12767689.png",
      "https://glownd.com/wp-content/uploads/2026/09/ef92455f-d938-45f8-a36c-96c2fc3d140a.png",
      "https://glownd.com/wp-content/uploads/2026/09/7a3863a6-a2f7-4132-bd61-fbed4f7b8566.png",
      "https://glownd.com/wp-content/uploads/2026/09/69cfac23-ab52-40b8-b7d8-8cb9d996881c.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": true,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Croc Bags",
    "description": "The Croc Effect Transparent T Bag -Mint Green is a chic and modern statement bag featuring a mint green croc-effect finish, transparent body, and elegant gold-tone detailing. Perfect for brunches, dinners, shopping, parties, and stylish everyday outings. A beautiful accessory to pair with neutral, denim or pastel looks and a lovely gift for any fashion lover.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_852",
    "seller_id": "seller_glownd",
    "name": "Croc Effect Transparent T Bag - Cream",
    "size": "Standard",
    "photo": "/products/glownd/glownd_852.png",
    "photos": [
      "/products/glownd/glownd_852.png",
      "https://glownd.com/wp-content/uploads/2026/09/6597df91-6d91-4bcb-a911-9cf73abf386c.png",
      "https://glownd.com/wp-content/uploads/2026/09/408e0843-b2a6-46e4-b651-6c100604c52a.png",
      "https://glownd.com/wp-content/uploads/2026/09/56027d4e-c6fc-491c-81e4-16432bf6defd.png",
      "https://glownd.com/wp-content/uploads/2026/09/07890365-5ce0-4eb3-a23b-8a9c6097b34d.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Croc Bags",
    "description": "The Croc Effect Transparent T Bag - Cream is a chic and sophisticated statement bag featuring a creamy croc-effect finish, clear transparent body, and elegant gold-tone hardware. A versatile accessory that effortlessly elevates any look.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_848",
    "seller_id": "seller_glownd",
    "name": "Croc Effect Transparent T Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_848.png",
    "photos": [
      "/products/glownd/glownd_848.png",
      "https://glownd.com/wp-content/uploads/2026/09/f2524ecd-ceab-4d91-a5bc-e038e2936ab6.png",
      "https://glownd.com/wp-content/uploads/2026/09/b5af879e-7b99-454b-ae09-f1d5dd84b339.png",
      "https://glownd.com/wp-content/uploads/2026/09/75041b33-69a2-4f98-a610-0f54f33b6418.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Croc Bags",
    "description": "The Croc Effect Transparent T Bag - Black is a chic statement handbag featuring a glossy croc-effect finish, transparent body, elegant gold hardware, and a bold T-shaped clasp. Perfect for adding a polished touch to both everyday and dressy looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_826",
    "seller_id": "seller_glownd",
    "name": "V-Detail Mini Top Handle Crossbody Bag - White",
    "size": "Standard",
    "photo": "/products/glownd/glownd_826.png",
    "photos": [
      "/products/glownd/glownd_826.png",
      "https://glownd.com/wp-content/uploads/2026/09/f6614a14-219e-4dd7-b7e3-fb71d596d2d2.png",
      "https://glownd.com/wp-content/uploads/2026/09/b7d89ad4-04e0-4e68-920e-44dc58bef280.png",
      "https://glownd.com/wp-content/uploads/2026/09/2830cf75-55b5-4581-b356-c0b773aa3466.png",
      "https://glownd.com/wp-content/uploads/2026/09/1ed23947-f9b4-44ba-b267-e5d1053f528b.png",
      "https://glownd.com/wp-content/uploads/2026/09/1441b575-100a-485e-a63e-b10cdc9f5175.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": true,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The V-Detail Mini Top Handle Crossbody Bag - White is a chic and versatile mini handbag featuring a structured silhouette, crisp white finish, statement V-shaped detail, top handle, and adjustable crossbody strap. Its timeless design makes it perfect for everyday wear, special occasions, and effortlessly elevating both casual and dressy outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_825",
    "seller_id": "seller_glownd",
    "name": "V-Detail Mini Top Handle Crossbody Bag - Pink",
    "size": "Standard",
    "photo": "/products/glownd/glownd_825.png",
    "photos": [
      "/products/glownd/glownd_825.png",
      "https://glownd.com/wp-content/uploads/2026/09/a7b03816-9ddc-46b8-bdc4-27c9e40de581.png",
      "https://glownd.com/wp-content/uploads/2026/09/c36ac22c-c74c-4d1a-b884-9770b4ce0bac.png",
      "https://glownd.com/wp-content/uploads/2026/09/99e9b31a-f345-4b47-8fe2-7bf8645c19c8.png",
      "https://glownd.com/wp-content/uploads/2026/09/4726fae1-9766-4118-87cf-d30967387523.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The V-Detail Mini Top Handle Crossbody Bag - Pink combines feminine style with everyday versatility. Featuring a structured mini design, vibrant pink finish, statement V-shaped detail, top handle, and adjustable crossbody strap, it's perfect for carrying your essentials while adding a stylish pop of colour to any outfit.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_824",
    "seller_id": "seller_glownd",
    "name": "V-Detail Mini Top Handle Crossbody Bag - Red",
    "size": "Standard",
    "photo": "/products/glownd/glownd_824.png",
    "photos": [
      "/products/glownd/glownd_824.png",
      "https://glownd.com/wp-content/uploads/2026/09/4a5e9799-fc05-480c-a396-12d69c80d1ea.png",
      "https://glownd.com/wp-content/uploads/2026/09/7901a084-f58c-4f87-aa86-1f142b53e235.png",
      "https://glownd.com/wp-content/uploads/2026/09/a0c7bd97-81ff-487b-b3f7-c350f6aac568.png",
      "https://glownd.com/wp-content/uploads/2026/09/671d3d0a-1208-4703-b3f2-ff1a691d940c.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The V-Detail Mini Top Handle Crossbody Bag - Red is a bold and elegant mini handbag featuring a structured silhouette, vibrant red finish, statement silver-tone V detail, top handle, and adjustable crossbody strap. Stylish and versatile, it's perfect for carrying your everyday essentials while adding a pop of colour to any outfit.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_823",
    "seller_id": "seller_glownd",
    "name": "V-Detail Mini Top Handle Crossbody Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_823.png",
    "photos": [
      "/products/glownd/glownd_823.png",
      "https://glownd.com/wp-content/uploads/2026/09/d9b19072-468a-4d99-88ec-f58ccb316c50.png",
      "https://glownd.com/wp-content/uploads/2026/09/f77ac593-b95f-41ae-a685-5933ff5af6a0.png",
      "https://glownd.com/wp-content/uploads/2026/09/3d328433-8d3c-46e5-a95a-9ae660442772.png",
      "https://glownd.com/wp-content/uploads/2026/09/aeaee53e-445b-44cd-b927-ca66e6751d61.png",
      "https://glownd.com/wp-content/uploads/2026/09/45c6eb56-ea0a-481b-81e6-94b460ca01f2.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The V-Detail Mini Top Handle Crossbody Bag - Black combines elegant design with everyday versatility. Featuring a structured mini shape, sleek black finish, statement silver-tone V detail, top handle, and adjustable crossbody strap, it's the perfect accessory for carrying your essentials in style. A timeless addition to any wardrobe, this bag pairs beautifully with both casual and dressy outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_815",
    "seller_id": "seller_glownd",
    "name": "Razor Mini Box Crossbody Bag - White",
    "size": "Standard",
    "photo": "/products/glownd/glownd_815.jpeg",
    "photos": [
      "/products/glownd/glownd_815.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/img_6263.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/img_6261.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/img_6266.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/img_6264.jpeg",
      "https://glownd.com/wp-content/uploads/2026/09/img_6267.jpeg"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "A chic white mini box crossbody bag featuring a structured design, silver-tone hardware, razor-inspired zip detailing and versatile top-handle and crossbody styling. Perfect for carrying your essentials while adding a polished touch to any look.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_807",
    "seller_id": "seller_glownd",
    "name": "Razor Mini Box Crossbody Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_807.png",
    "photos": [
      "/products/glownd/glownd_807.png",
      "https://glownd.com/wp-content/uploads/2026/09/93c15ca3-4e2e-4fd0-a34b-9b96725631f1.png",
      "https://glownd.com/wp-content/uploads/2026/09/539c2d9f-9521-45ba-8ace-7b7c342eae44.png",
      "https://glownd.com/wp-content/uploads/2026/09/e3623901-888d-475a-847e-42851b89df40.png",
      "https://glownd.com/wp-content/uploads/2026/09/cbe5ff0b-a043-4618-a0c7-a3b6c129e18b.png",
      "https://glownd.com/wp-content/uploads/2026/09/3754839f-d7c1-4ab4-bfa4-641eff025d75.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Razor Mini Box Crossbody Bag - Black is a sleek and stylish compact handbag designed for effortless everyday wear. Featuring a structured boxy silhouette, textured finish, silver-tone hardware, statement razor-inspired zip detailing, and a chain strap, this black crossbody bag adds a chic edge to any outfit while keeping your essentials close and organised.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_806",
    "seller_id": "seller_glownd",
    "name": "Razor Mini Box Crossbody Bag - Pink",
    "size": "Standard",
    "photo": "/products/glownd/glownd_806.png",
    "photos": [
      "/products/glownd/glownd_806.png",
      "https://glownd.com/wp-content/uploads/2026/09/8583a3bc-4fce-4b59-95cd-232526482ceb.png",
      "https://glownd.com/wp-content/uploads/2026/09/05bba2a4-48eb-4cc9-93b7-a89a909b824a.png",
      "https://glownd.com/wp-content/uploads/2026/09/4b6dcf33-a48d-4f88-9ab3-018197f5b4c8.png",
      "https://glownd.com/wp-content/uploads/2026/09/cf86e80b-ba5e-47ff-992f-6e11cf7428e0.png",
      "https://glownd.com/wp-content/uploads/2026/09/16ce0c5b-d6fe-4fee-a74c-b2ed020ab680.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Pink Razor Mini Box Crossbody bag is a chic and compact pink mini box crossbody bag featuring stylish razor-inspired zip detailing, a convenient top handle, silver-tone hardware, and a chain strap. Perfect for adding a feminine touch to both casual and dressy looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_794",
    "seller_id": "seller_glownd",
    "name": "Shirt-Style Collared Crossbody Bag - Blue",
    "size": "Standard",
    "photo": "/products/glownd/glownd_794.jpeg",
    "photos": [
      "/products/glownd/glownd_794.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/9ed36268-51c6-4d73-a0ac-ca1341c7b9d1.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/9a405e77-3535-45ab-94dc-f6668d35419b.png",
      "https://glownd.com/wp-content/uploads/2026/08/5e15a342-616e-410a-afce-ffd1ba110134.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/5f8193d1-c16c-47e0-b22f-f81f58785fb2.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "Shirt-Style Collared Crossbody Bag - Blue A stylish blue crossbody bag featuring a unique shirt-inspired design, pointed collar detailing, button accents, and a front pocket for a chic finish. Perfect for everyday outings, brunches, shopping trips, dates, and casual occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_789",
    "seller_id": "seller_glownd",
    "name": "Shirt-Style Collared Crossbody Bag - Lime Green",
    "size": "Standard",
    "photo": "/products/glownd/glownd_789.png",
    "photos": [
      "/products/glownd/glownd_789.png",
      "https://glownd.com/wp-content/uploads/2026/08/e8ba5f35-0c49-49b7-8f3b-9ecabcdeda29.png",
      "https://glownd.com/wp-content/uploads/2026/08/3a857045-7dca-48f7-bfde-94c6240286b8.png",
      "https://glownd.com/wp-content/uploads/2026/08/ef7e2784-bf61-4c2d-8d4e-ca8c9158379b.png",
      "https://glownd.com/wp-content/uploads/2026/08/274a3715-02f7-4a1d-adc5-6ecabf735593.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Shirt-Style Collared Crossbody Bag - Lime Green is a trendy mini bag designed with a playful shirt-inspired silhouette. Featuring a structured collared front, button-style detailing, a convenient front pocket, top handles, and an adjustable crossbody strap, this vibrant lime green bag adds a fresh pop of colour to any outfit. Perfect for casual outings, brunch dates, shopping trips, and stylish everyday looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_783",
    "seller_id": "seller_glownd",
    "name": "Shirt-Style Collared Crossbody Bag - Pink",
    "size": "Standard",
    "photo": "/products/glownd/glownd_783.png",
    "photos": [
      "/products/glownd/glownd_783.png",
      "https://glownd.com/wp-content/uploads/2026/08/c3f02d76-8198-4025-ab29-2a4d4c379b17.png",
      "https://glownd.com/wp-content/uploads/2026/08/94680dde-12ba-4f7e-a754-542fd1c6360f.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/dca2459f-b729-4de2-b582-a81386ad8b24.png",
      "https://glownd.com/wp-content/uploads/2026/08/e6a7331f-b6fa-4b51-9c34-552c205f4d37.png",
      "https://glownd.com/wp-content/uploads/2026/08/85524431-ced0-4144-adad-8722119a9e87.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Pink Shirt-Style Collared Crossbody Bag Add a playful yet polished touch to your look with this stylish pink shirt-style collared crossbody bag. Featuring a structured silhouette, statement collar, button detailing, front pocket, and an adjustable crossbody strap, it's a chic everyday bag for casual outings, brunch dates, shopping trips, and weekend plans.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_778",
    "seller_id": "seller_glownd",
    "name": "Shirt-Style Collared Crossbody Bag - Chocolate Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_778.png",
    "photos": [
      "/products/glownd/glownd_778.png",
      "https://glownd.com/wp-content/uploads/2026/08/b5c3da71-7832-400e-b936-983b684ae90f.png",
      "https://glownd.com/wp-content/uploads/2026/08/32ea09de-9e94-42d6-ab0e-ecf61965c177.png",
      "https://glownd.com/wp-content/uploads/2026/08/29034193-fc0e-40e3-a91e-0fd13e313f5b.png",
      "https://glownd.com/wp-content/uploads/2026/08/728b7f57-a676-4834-ac74-f1f25bda116f.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "Elevate your everyday style with the Shirt-Style Collared Crossbody Bag - Chocolate Brown, featuring a structured silhouette, shirt-inspired collar, button details, and a practical front pocket. With both top handles and a detachable crossbody strap, it's perfect for everyday outings, brunch, shopping, and casual occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_777",
    "seller_id": "seller_glownd",
    "name": "Shirt-Style Collared Crossbody Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_777.png",
    "photos": [
      "/products/glownd/glownd_777.png",
      "https://glownd.com/wp-content/uploads/2026/08/c98949ea-0a0d-4150-a66e-8539f7c41830.png",
      "https://glownd.com/wp-content/uploads/2026/08/fad4ef2f-9c84-438d-939e-2855dd5b4692.png",
      "https://glownd.com/wp-content/uploads/2026/08/8ba85624-3de9-4220-8314-777035191dbb.png",
      "https://glownd.com/wp-content/uploads/2026/08/17c1a320-2767-403d-a7eb-a44a9d62823f.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "A chic and versatile Shirt-Style Collared Crossbody Bag in Black, featuring a structured silhouette, statement collar detail, front button accents, and a convenient front pocket. Complete with top handles and an adjustable crossbody strap, it's perfect for everyday outings, brunch dates, shopping, and casual evenings.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_770",
    "seller_id": "seller_glownd",
    "name": "Amélie Dome Bag - Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_770.png",
    "photos": [
      "/products/glownd/glownd_770.png",
      "https://glownd.com/wp-content/uploads/2026/08/8c18d55a-ab80-4b9f-b4ed-1c150ed99ee2.png",
      "https://glownd.com/wp-content/uploads/2026/08/63be83a9-6bac-4028-badc-fbfd6fe2aaf4.png",
      "https://glownd.com/wp-content/uploads/2026/08/79f7d4fc-dee2-4a0c-a818-48f547517038.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/444f3f91-e651-47fc-a3c8-d772497589ee.jpeg"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Timeless dome silhouette with sturdy top handles & refined finish",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Dome Handbags",
    "description": "The Amélie Dome Bag - Brown is a chic and versatile handbag featuring a structured dome silhouette, elegant brown accents, gold-tone hardware, and a sophisticated patterned finish. With top handles and a detachable shoulder strap, it's perfect for everyday outings, brunch dates, work, shopping, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_766",
    "seller_id": "seller_glownd",
    "name": "Amélie Dome Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_766.jpeg",
    "photos": [
      "/products/glownd/glownd_766.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/a357b9d1-524b-44fd-9956-7d38c5c2c5ee.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/45d82871-00e6-4bad-bcea-84ece690e050.png",
      "https://glownd.com/wp-content/uploads/2026/08/2af57ba3-5b82-42e6-80f9-6dd1ab9b347b.png",
      "https://glownd.com/wp-content/uploads/2026/08/4e514b82-b3dc-4de2-8211-e93c38f248ed.png",
      "https://glownd.com/wp-content/uploads/2026/08/a592a677-6c87-480c-8621-664902d60288.png"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Timeless dome silhouette with sturdy top handles & refined finish",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Dome Handbags",
    "description": "The Amélie Dome Bag - Black is a chic and versatile structured handbag featuring a classic dome silhouette, elegant gold-tone hardware, black detailing, and a detachable shoulder strap. Perfect for everyday outings, brunch dates, dinners, shopping, and stylish occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_760",
    "seller_id": "seller_glownd",
    "name": "Amélie Dome Bag - Ivory Cream",
    "size": "Standard",
    "photo": "/products/glownd/glownd_760.png",
    "photos": [
      "/products/glownd/glownd_760.png",
      "https://glownd.com/wp-content/uploads/2026/08/00c1ad6b-ff20-43eb-82c8-f1aecd33f2eb.png",
      "https://glownd.com/wp-content/uploads/2026/08/02e3ba7f-5b61-4105-a02f-4a91f06f5b16.png",
      "https://glownd.com/wp-content/uploads/2026/08/cc811b59-ae37-426f-8f50-e81a692a3791.png",
      "https://glownd.com/wp-content/uploads/2026/08/aa201137-8548-4ee4-8604-6beba6dc9969.png"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Timeless dome silhouette with sturdy top handles & refined finish",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Dome Handbags",
    "description": "The Amélie Dome Bag - Ivory Cream is an elegant structured handbag designed to elevate everyday and occasion looks. Featuring a classic dome shape, ivory cream finish, red piping, gold-tone hardware, top handles, and a detachable shoulder strap, it's the perfect accessory for adding a polished and feminine touch to any outfit.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_755",
    "seller_id": "seller_glownd",
    "name": "Valentina Pearl Dome Bag - Soft Grey",
    "size": "Standard",
    "photo": "/products/glownd/glownd_755.png",
    "photos": [
      "/products/glownd/glownd_755.png",
      "https://glownd.com/wp-content/uploads/2026/08/84c6e1a7-d8df-435d-bb43-85b4c652383d.png",
      "https://glownd.com/wp-content/uploads/2026/08/71d8749b-a808-40b4-836f-7c3306fac6ef.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/39646748-f35d-40f1-ba09-16881d231c61.png",
      "https://glownd.com/wp-content/uploads/2026/08/5aef6567-3f8a-4c22-986e-4437d1b44e0e.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/efa0c7d0-d7ce-4949-ab50-8e94b5081ac9.png"
    ],
    "price": 3000,
    "regular_price": 3400,
    "benefit_line": "Timeless dome silhouette with sturdy top handles & refined finish",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Dome Handbags",
    "description": "The Valentine Pearl Dome Bag - Soft Grey is an elegant everyday handbag featuring a structured dome silhouette, soft grey finish, gold-tone hardware, and a detachable shoulder strap. Perfect for adding a polished touch to both casual and dressy outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_744",
    "seller_id": "seller_glownd",
    "name": "Valentina Pearl Dome Bag - Soft Pink",
    "size": "Standard",
    "photo": "/products/glownd/glownd_744.png",
    "photos": [
      "/products/glownd/glownd_744.png",
      "https://glownd.com/wp-content/uploads/2026/08/0c9e3376-d0e2-4b90-9a63-8a729d682b7e.png",
      "https://glownd.com/wp-content/uploads/2026/08/4f42d9dc-e9b5-4ae9-9c3a-f1dc11875b8e.png",
      "https://glownd.com/wp-content/uploads/2026/08/20d55969-463b-4b7f-a79e-12712fdc6b8b.png",
      "https://glownd.com/wp-content/uploads/2026/08/12250543-e616-4128-94f8-66b6753d91be.png"
    ],
    "price": 3000,
    "regular_price": 3400,
    "benefit_line": "Timeless dome silhouette with sturdy top handles & refined finish",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Dome Handbags",
    "description": "Add a touch of feminine elegance to any outfit with the Valentine Pearl Dome Bag - Soft Pink. Featuring a structured dome silhouette, delicate textured detailing, polished gold-tone hardware, sturdy top handles and a detachable shoulder strap, this versatile pink handbag is perfect for everyday styling, brunch dates, dinners, special occasions and gifting. Pair it with neutrals, denim or elegant evening looks for an effortlessly chic finish.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_743",
    "seller_id": "seller_glownd",
    "name": "Roselle Grace Dome Bag - Blush Pink",
    "size": "Standard",
    "photo": "/products/glownd/glownd_743.png",
    "photos": [
      "/products/glownd/glownd_743.png",
      "https://glownd.com/wp-content/uploads/2026/08/9c7574dc-c721-4572-9f50-610a3f961f62.png",
      "https://glownd.com/wp-content/uploads/2026/08/10f7ed77-6558-41c5-afdf-5c2914a681b7.png"
    ],
    "price": 5000,
    "regular_price": 5700,
    "benefit_line": "Timeless dome silhouette with sturdy top handles & refined finish",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Dome Handbags",
    "description": "The Roselle Grace Dome Bag Blush Pink is a chic, structured handbag featuring a feminine dome silhouette, elegant gold-tone hardware, and a soft blush-pink finish. Perfect for everyday outings, brunches, dates, dinners, and special occasions. Style it with dresses, tailored outfits, jeans, or neutral tones for an effortlessly polished look. It also makes a beautiful gift for birthdays, anniversaries, graduations, or any special woman in your life. 🎀",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_740",
    "seller_id": "seller_glownd",
    "name": "Alora Structured Shoulder Bag - Mocha Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_740.png",
    "photos": [
      "/products/glownd/glownd_740.png",
      "https://glownd.com/wp-content/uploads/2026/08/bf18fad9-eda7-47ab-ae36-5968156bf60e.png",
      "https://glownd.com/wp-content/uploads/2026/08/3d836395-c8e4-4b66-8481-9687b5c6e137.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": true,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "The Alora Structured Shoulder Bag - Mocha Brown is a versatile accessory for brunches, date nights, dinners, shopping days, office looks, and special occasions. Style it with cream, white, black, denim, beige, or earthy tones for an effortlessly polished look. Its timeless design also makes it a beautiful gift for birthdays, anniversaries, graduations, or any special occasion.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_737",
    "seller_id": "seller_glownd",
    "name": "Alora Structured Shoulder Bag - Burgundy",
    "size": "Standard",
    "photo": "/products/glownd/glownd_737.png",
    "photos": [
      "/products/glownd/glownd_737.png",
      "https://glownd.com/wp-content/uploads/2026/08/215ccfec-d6d8-4487-aff3-9955d03bd8ce.png",
      "https://glownd.com/wp-content/uploads/2026/08/bcb2b5a0-4994-4454-8e5e-328ad04ccd41.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "The Alora Structured Shoulder Bag - Burgundy is a sophisticated everyday bag featuring a structured silhouette, elegant flap closure, gold-tone statement hardware, and a rich burgundy finish. Perfect for elevating both casual and dressy outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_734",
    "seller_id": "seller_glownd",
    "name": "Alora Structured Shoulder Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_734.png",
    "photos": [
      "/products/glownd/glownd_734.png",
      "https://glownd.com/wp-content/uploads/2026/08/b6ef89e3-b3f5-40c2-b8f2-1ed5eb29768b.png",
      "https://glownd.com/wp-content/uploads/2026/08/c072eb8e-392e-40dc-b70e-1c6a37114a08.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Elevate your everyday style with the Black Alora Structured Shoulder Bag. Featuring a sleek structured silhouette, curved flap design, elegant gold-tone hardware and a long shoulder strap, this sophisticated black bag is perfect for adding a polished touch to both casual and dressy outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_731",
    "seller_id": "seller_glownd",
    "name": "Coke Heart Mini Top-Handle Bag - Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_731.png",
    "photos": [
      "/products/glownd/glownd_731.png",
      "https://glownd.com/wp-content/uploads/2026/08/b3c3ebf7-fdc7-490c-bda1-8d55a102caff.png",
      "https://glownd.com/wp-content/uploads/2026/08/3c5be02f-186d-4bd6-9e0d-cff73f0f3965.png",
      "https://glownd.com/wp-content/uploads/2026/08/f5d5ee48-05a6-440b-bbfd-322e8cce76e6-1.jpeg"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Add timeless elegance to your look with the Coke Heart Mini Top-Handle Bag - Brown. Featuring a structured design, chic top handle, elegant gold-tone hardware, and a rich brown finish, this classy handbag is perfect for dates, dinners, weddings, brunches, parties, and special occasions. It comes beautifully packaged in a box, making it a perfect gift for anyone special.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_724",
    "seller_id": "seller_glownd",
    "name": "Coke Heart Mini Top-Handle Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_724.png",
    "photos": [
      "/products/glownd/glownd_724.png",
      "https://glownd.com/wp-content/uploads/2026/08/86c776fd-4cf8-4bba-9efc-87841b1770c1.png",
      "https://glownd.com/wp-content/uploads/2026/08/688e889b-a912-4448-9866-aca82e946285.png",
      "https://glownd.com/wp-content/uploads/2026/08/f5d5ee48-05a6-440b-bbfd-322e8cce76e6.jpeg"
    ],
    "price": 4500,
    "regular_price": 5100,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Meet the Coke Heart Mini Top-Handle Bag - Black, a chic and elegant mini handbag featuring a sleek structured design, polished gold-tone hardware, and a stylish top handle. Compact yet sophisticated, it's perfect for dinners, date nights, brunches, parties, events, and special occasions. Beautifully packaged in a box, it also makes a perfect gift for someone special.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_723",
    "seller_id": "seller_glownd",
    "name": "Modern Snake Print Crossbody Chain Bag - Peach",
    "size": "Standard",
    "photo": "/products/glownd/glownd_723.png",
    "photos": [
      "/products/glownd/glownd_723.png",
      "https://glownd.com/wp-content/uploads/2026/08/74582f83-96f2-4492-908f-404b20cdbd70.png",
      "https://glownd.com/wp-content/uploads/2026/08/5c65a98d-04b3-43f2-93b2-c0b8bae264ce.png",
      "https://glownd.com/wp-content/uploads/2026/08/e543f8cd-7e68-4446-a21d-a52fdd34a0bd.png",
      "https://glownd.com/wp-content/uploads/2026/08/7b02df74-01d3-48e0-9d3f-8f69c6492912.jpeg"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "Add a touch of sophisticated style to any outfit with the Modern Snake Print Crossbody Chain Bag - Peach. Featuring a textured snake-print finish, structured silhouette, statement buckle detail and sleek chain strap, this elegant women's handbag is perfect for brunches, date nights, dinners, parties and stylish everyday looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_718",
    "seller_id": "seller_glownd",
    "name": "Modern Snake Print Crossbody Chain Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_718.png",
    "photos": [
      "/products/glownd/glownd_718.png",
      "https://glownd.com/wp-content/uploads/2026/08/15fe680e-8fc7-4c1d-b555-986074d4f377.png",
      "https://glownd.com/wp-content/uploads/2026/08/448b59dc-b46d-4318-9457-6da046a08d01.png",
      "https://glownd.com/wp-content/uploads/2026/08/34835dc8-3c4c-47bb-b14b-b01b99cfb1bb.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Modern Snake Print Crossbody Chain Bag - Black is a chic statement bag featuring a textured snake-print finish, sleek black design, a bold horseshoe-style clasp, and a stylish gunmetal chain strap. Perfect for adding a polished touch to everyday outfits, dinner dates, brunches, parties, and evening occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_711",
    "seller_id": "seller_glownd",
    "name": "Modern Snake Print Crossbody Chain Bag - Red",
    "size": "Standard",
    "photo": "/products/glownd/glownd_711.png",
    "photos": [
      "/products/glownd/glownd_711.png",
      "https://glownd.com/wp-content/uploads/2026/08/7f241f4a-fddd-441a-b724-309ca6e9032a.png",
      "https://glownd.com/wp-content/uploads/2026/08/d7f90902-f2b2-4284-b175-43ad0837bccb.png",
      "https://glownd.com/wp-content/uploads/2026/08/4042f90f-267e-4891-ae64-a94739d4a6d8.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "Make a statement with the Modern Snake Print Crossbody Chain Bag - Red. Featuring a bold textured snake-print finish, structured silhouette, sleek black detailing and a striking statement clasp, this stylish crossbody bag adds an elegant touch to any outfit. The chain strap makes it easy to wear from day to night.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_710",
    "seller_id": "seller_glownd",
    "name": "Sienna Buckle Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_710.png",
    "photos": [
      "/products/glownd/glownd_710.png",
      "https://glownd.com/wp-content/uploads/2026/08/0286c82d-72b5-4c91-9764-c54a197a04ec.png",
      "https://glownd.com/wp-content/uploads/2026/08/9148ec9a-f38e-4d33-a690-1dc1d801b6c2.png",
      "https://glownd.com/wp-content/uploads/2026/08/bb7c23f9-4e7b-4e51-8aa8-e008d38aaad7.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Sienna Buckle Bag - Black is a sophisticated everyday handbag featuring a sleek black finish, croc-embossed texture, elegant gold-tone buckle detailing, and a structured silhouette. Perfect for elevating casual, office, dinner, and evening looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_706",
    "seller_id": "seller_glownd",
    "name": "Sienna Buckle Bag - Ivory",
    "size": "Standard",
    "photo": "/products/glownd/glownd_706.png",
    "photos": [
      "/products/glownd/glownd_706.png",
      "https://glownd.com/wp-content/uploads/2026/08/e1bb5a3c-ee44-4d5f-8fd9-ba6e09e488b7.png",
      "https://glownd.com/wp-content/uploads/2026/08/d61f3c67-8d2b-4645-b151-271fa065f9df.png",
      "https://glownd.com/wp-content/uploads/2026/08/ad9c93b3-970f-423c-ad46-03512a2272da.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Sienna Buckle Bag - Ivory is an elegant structured handbag featuring a soft ivory finish, crocodile-textured detailing, and a statement gold-tone buckle framed with delicate chain accents. Its versatile design is perfect for brunches, date nights, dinners, weddings, birthdays, graduations, parties, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_697",
    "seller_id": "seller_glownd",
    "name": "Chic Clasp Crossbody Bag - White",
    "size": "Standard",
    "photo": "/products/glownd/glownd_697.png",
    "photos": [
      "/products/glownd/glownd_697.png",
      "https://glownd.com/wp-content/uploads/2026/08/bedb2f0b-60a6-451a-8902-3021a563b597.png",
      "https://glownd.com/wp-content/uploads/2026/08/3e54c253-d08f-423c-a688-29711b9c4797.png",
      "https://glownd.com/wp-content/uploads/2026/08/b59bf806-0ebd-472f-bea3-78e19eee1159.png",
      "https://glownd.com/wp-content/uploads/2026/08/8217977e-924f-47c2-bda0-0776d56aab51-1.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The White Chic Clasp Crossbody Bag is an elegant, versatile accessory featuring a crisp white finish, structured design, and distinctive C-shaped gold clasp. Perfect for elevating your look at brunches, weddings, date nights, dinners, birthdays, graduations, parties, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_693",
    "seller_id": "seller_glownd",
    "name": "Chic Clasp Crossbody Bag - Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_693.png",
    "photos": [
      "/products/glownd/glownd_693.png",
      "https://glownd.com/wp-content/uploads/2026/08/22824968-3586-4bea-ac39-5cd1a4ec2d9b-3.png",
      "https://glownd.com/wp-content/uploads/2026/08/5c2c68f8-86ac-4fc8-9db4-dd3e3b104518.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/aee06090-7b55-4027-a777-44fc4dbfee4b.jpeg"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Brown Chic Clasp Crossbody Bag is a timeless and elegant everyday accessory featuring a rich brown finish, structured silhouette, and distinctive C-shaped gold clasp. Perfect for adding a polished touch to casual and dressy outfits, from brunches and shopping days to dinners, weddings, birthdays, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_687",
    "seller_id": "seller_glownd",
    "name": "Chic Clasp Crossbody Bag - Red",
    "size": "Standard",
    "photo": "/products/glownd/glownd_687.png",
    "photos": [
      "/products/glownd/glownd_687.png",
      "https://glownd.com/wp-content/uploads/2026/08/58d55a19-a6fb-4a44-92bf-71ce8f4899e6.png",
      "https://glownd.com/wp-content/uploads/2026/08/1d54be26-f4e2-45ab-85d2-d277e977d531.png",
      "https://glownd.com/wp-content/uploads/2026/08/87a6d580-e6e9-404a-ad97-ed76f5ba7e83-1.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Red Chic Clasp Crossbody Bag is a stylish statement accessory featuring a rich red finish, structured silhouette, and distinctive C-shaped gold clasp. Perfect for adding a chic pop of colour to your look for brunches, date nights, dinners, weddings, parties, birthdays, shopping days, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_682",
    "seller_id": "seller_glownd",
    "name": "Chic Clasp Crossbody Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_682.png",
    "photos": [
      "/products/glownd/glownd_682.png",
      "https://glownd.com/wp-content/uploads/2026/08/ec4fddae-369f-4695-b8cd-296e8f5cc9a4.png",
      "https://glownd.com/wp-content/uploads/2026/08/8031f505-6460-47de-855a-b13a7687c196-1-1.png",
      "https://glownd.com/wp-content/uploads/2026/08/8296dfca-cc36-40dd-8a42-9a53350cfa5e.png",
      "https://glownd.com/wp-content/uploads/2026/08/e879057e-b1ac-44b2-b5cf-1dc9e6dd0ea2.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Versatile hands-free crossbody with adjustable strap & secure closure",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Crossbody Bags",
    "description": "The Chic Clasp Crossbody Bag - Black is a stylish everyday bag featuring a sleek structured design, distinctive C-shaped front clasp, and elegant gold-tone hardware. Its versatile black finish makes it perfect for both casual and dressy looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_675",
    "seller_id": "seller_glownd",
    "name": "Monogram Chain Shoulder Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_675.png",
    "photos": [
      "/products/glownd/glownd_675.png",
      "https://glownd.com/wp-content/uploads/2026/08/4ccbd1fd-869b-492e-a577-bc04bc2a825e.png",
      "https://glownd.com/wp-content/uploads/2026/08/2622f1cb-b581-4a34-98e5-b8a3dc71d6d0.png",
      "https://glownd.com/wp-content/uploads/2026/08/80b7b30c-0059-4e22-b090-0a3371171de7-1.png",
      "https://glownd.com/wp-content/uploads/2026/08/611270a2-7f81-4827-8b2f-8bc14f2cd1f9.png",
      "https://glownd.com/wp-content/uploads/2026/08/1bd11a56-e3c6-4ee0-82e5-d7eaa3c1d73d.png"
    ],
    "price": 2800,
    "regular_price": 3200,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "The Black Monogram Chain Shoulder Bag is a stylish everyday accessory featuring a sleek black monogram design, elegant gold-tone chain detailing, and a signature round clasp. Compact yet practical, it adds a chic, polished touch to both casual and dressy outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_668",
    "seller_id": "seller_glownd",
    "name": "Monogram Chain Shoulder Bag - White",
    "size": "Standard",
    "photo": "/products/glownd/glownd_668.png",
    "photos": [
      "/products/glownd/glownd_668.png",
      "https://glownd.com/wp-content/uploads/2026/08/14809d62-43ec-46b1-aa84-1140ed93cdf3.png",
      "https://glownd.com/wp-content/uploads/2026/08/0d5fe711-574b-4179-bc97-f2a728d4a026.png",
      "https://glownd.com/wp-content/uploads/2026/08/f832130c-cf2d-46e1-820e-58339b7f8bb7.png",
      "https://glownd.com/wp-content/uploads/2026/08/2764db70-0d49-42f6-93e5-5deb30174165.png",
      "https://glownd.com/wp-content/uploads/2026/08/bf89fec9-4485-42b3-b720-3fe86a147812.png"
    ],
    "price": 2800,
    "regular_price": 3200,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Elevate your everyday style with our White Monogram Chain Shoulder Bag, featuring a chic monogram pattern, elegant gold-tone chain detailing, and a versatile design. Perfect for everyday wear, brunch dates, shopping, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_660",
    "seller_id": "seller_glownd",
    "name": "Monogram Chain Shoulder Bag - Pink",
    "size": "Standard",
    "photo": "/products/glownd/glownd_660.png",
    "photos": [
      "/products/glownd/glownd_660.png",
      "https://glownd.com/wp-content/uploads/2026/08/a4851007-0c83-4563-a16c-7a8fe30adf07.png",
      "https://glownd.com/wp-content/uploads/2026/08/0455d17f-72c0-49ee-a905-409bbb4bc391.png",
      "https://glownd.com/wp-content/uploads/2026/08/c6204d6e-b079-4c6a-9f70-5ca65361ee53.png",
      "https://glownd.com/wp-content/uploads/2026/08/6f7c4782-97be-4347-b65a-5106d254ee76.png",
      "https://glownd.com/wp-content/uploads/2026/08/6882c690-c3a7-4413-8a76-f02f8ab257d6.png"
    ],
    "price": 2800,
    "regular_price": 3200,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Add a feminine touch to your everyday style with this Pink Monogram Chain Shoulder Bag. Featuring a stylish monogram pattern, elegant gold-tone chain detailing, and a versatile design, it's perfect for casual outings, brunch dates, shopping, and everyday wear.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_652",
    "seller_id": "seller_glownd",
    "name": "Monogram Chain Shoulder Bag - Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_652.png",
    "photos": [
      "/products/glownd/glownd_652.png",
      "https://glownd.com/wp-content/uploads/2026/08/7e4dbdb7-6f64-4a7c-9bea-6ff5827053fa-1.png",
      "https://glownd.com/wp-content/uploads/2026/08/1ec735cd-bd8a-4bb1-ba60-d855ecc64352.png",
      "https://glownd.com/wp-content/uploads/2026/08/42ad3c86-6266-4d7d-ac78-624c73865f10.png",
      "https://glownd.com/wp-content/uploads/2026/08/ef225a67-eb55-4636-868b-5b37d6e10f20.png",
      "https://glownd.com/wp-content/uploads/2026/08/746f053b-946a-4a0a-972f-818647045437.png"
    ],
    "price": 2800,
    "regular_price": 3200,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Brown Monogram Chain Shoulder Bag - A chic and versatile shoulder bag featuring a stylish monogram design, elegant gold-tone chain detailing, and a structured yet relaxed silhouette. Perfect for adding a polished touch to everyday and evening outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_637",
    "seller_id": "seller_glownd",
    "name": "Luxe Baguette Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_637.png",
    "photos": [
      "/products/glownd/glownd_637.png",
      "https://glownd.com/wp-content/uploads/2026/08/b48ecddb-20a8-4c91-89af-67ad8d777458.png",
      "https://glownd.com/wp-content/uploads/2026/08/92a3044c-147b-4ca8-aac4-76e3368069c4.png",
      "https://glownd.com/wp-content/uploads/2026/08/aa1ceb85-c5b6-4fd6-8b20-660c4d043b25.png",
      "https://glownd.com/wp-content/uploads/2026/08/10b61686-4ceb-40b3-84ff-79c4688a0c0b.png",
      "https://glownd.com/wp-content/uploads/2026/08/e584f3d4-51d0-47fa-a161-f7669ff4a7b7.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Baguette Bags",
    "description": "Elevate your everyday style with the Black Luxe Baguette Bag, featuring a sleek croc-embossed finish, structured silhouette, and elegant gold-tone clasp. A chic statement piece for both casual and dressy looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_636",
    "seller_id": "seller_glownd",
    "name": "Luxe Baguette Bag - Cream",
    "size": "Standard",
    "photo": "/products/glownd/glownd_636.png",
    "photos": [
      "/products/glownd/glownd_636.png",
      "https://glownd.com/wp-content/uploads/2026/08/bdfca959-4adb-4a12-bfd0-8c818ac2f7f4.png",
      "https://glownd.com/wp-content/uploads/2026/08/d3b49b3c-9165-4104-955b-9be4d8f60040.png",
      "https://glownd.com/wp-content/uploads/2026/08/c958d52c-c42b-46d2-b73c-76991075c21e.png",
      "https://glownd.com/wp-content/uploads/2026/08/a325efbb-8efb-47fc-90fc-3d008fc74cf3.png",
      "https://glownd.com/wp-content/uploads/2026/08/8ea83095-f2e5-4319-a4d8-a19ebc4f08f7.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Baguette Bags",
    "description": "The Cream Luxe Baguette Bag is a chic and versatile shoulder bag featuring a soft cream finish, croc-textured design, structured silhouette, and elegant gold-tone clasp. Perfect for adding a sophisticated touch to any outfit.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_630",
    "seller_id": "seller_glownd",
    "name": "Luxe Baguette Bag - Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_630.png",
    "photos": [
      "/products/glownd/glownd_630.png",
      "https://glownd.com/wp-content/uploads/2026/08/28508f12-5a56-431d-8bb8-6f77b47f3ddd.png",
      "https://glownd.com/wp-content/uploads/2026/08/f1351daf-29db-4926-b7c8-622e4a30f454.png",
      "https://glownd.com/wp-content/uploads/2026/08/7f7eda84-f464-44fc-8c0d-b4e484261e51.png",
      "https://glownd.com/wp-content/uploads/2026/08/55eaca98-043b-4e8d-a37c-7f888e54e0a4.png",
      "https://glownd.com/wp-content/uploads/2026/08/3ddb8ff6-b93b-4c08-9df8-ee71346be300.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Baguette Bags",
    "description": "The Brown Luxe Baguette Bag is a chic and timeless shoulder bag featuring a rich brown finish, elegant textured design, structured silhouette, and polished gold-tone clasp. Perfect for elevating everyday, casual, office, and evening looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_624",
    "seller_id": "seller_glownd",
    "name": "Luxe Baguette Bag - Lilac",
    "size": "Standard",
    "photo": "/products/glownd/glownd_624.png",
    "photos": [
      "/products/glownd/glownd_624.png",
      "https://glownd.com/wp-content/uploads/2026/08/5b1aa273-c78d-4f5d-98bb-d8210ff084f8.png",
      "https://glownd.com/wp-content/uploads/2026/08/55b607a9-0904-426c-bd7f-ff409b36e342.png",
      "https://glownd.com/wp-content/uploads/2026/08/853acb32-cd9c-4b96-be66-5c0389918f87.png",
      "https://glownd.com/wp-content/uploads/2026/08/1dea17a9-4d56-41f3-8170-1b674e765b59.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Baguette Bags",
    "description": "The Lilac Luxe Baguette Bag is a stylish statement handbag featuring a beautiful lilac finish, textured embossed design, structured baguette shape, and elegant gold-tone hardware. Perfect for everyday outfits, brunch dates, dinners, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_617",
    "seller_id": "seller_glownd",
    "name": "Croc-Embossed Shoulder Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_617.png",
    "photos": [
      "/products/glownd/glownd_617.png",
      "https://glownd.com/wp-content/uploads/2026/08/ade3cccd-095b-4bfd-8588-fd034b5bdae7.png",
      "https://glownd.com/wp-content/uploads/2026/08/53d42751-002c-4163-901f-cc20d3a8e2be-1.png",
      "https://glownd.com/wp-content/uploads/2026/08/0fff6025-7155-40d2-9738-890f622350f6.png",
      "https://glownd.com/wp-content/uploads/2026/08/504d4e88-64a7-4ddb-967e-435e514af02a.png",
      "https://glownd.com/wp-content/uploads/2026/08/8493f322-98f2-4380-812e-6fe83bb910c9.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Black Croc-Embossed Shoulder Bag - A sleek and stylish black shoulder bag featuring a textured croc-embossed finish, structured silhouette, and adjustable strap. Perfect for elevating everyday outfits, workwear, dinners, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_599",
    "seller_id": "seller_glownd",
    "name": "Croc-Embossed Shoulder Bag - White & Brown",
    "size": "Standard",
    "photo": "/products/glownd/glownd_599.png",
    "photos": [
      "/products/glownd/glownd_599.png",
      "https://glownd.com/wp-content/uploads/2026/08/02645955-acdf-4e74-a8b7-1b09a9d81dab.png",
      "https://glownd.com/wp-content/uploads/2026/08/56eb87b2-9021-45d8-8cb9-81374932c92e.png",
      "https://glownd.com/wp-content/uploads/2026/08/463a3a68-db76-494e-a97f-1c7107009613.png",
      "https://glownd.com/wp-content/uploads/2026/08/e3ae3734-e7e5-4ef8-a1ad-96a017e489e4.png",
      "https://glownd.com/wp-content/uploads/2026/08/4e1c06d9-027b-4c15-b4fa-2ae099b54db1.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "The White & Brown Croc-Embossed Shoulder Bag combines a chic two-tone design with a luxurious crocodile-inspired texture and elegant brown detailing. A versatile statement piece for everyday and dressy looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_598",
    "seller_id": "seller_glownd",
    "name": "Croc-Embossed Shoulder Bag - Beige",
    "size": "Standard",
    "photo": "/products/glownd/glownd_598.png",
    "photos": [
      "/products/glownd/glownd_598.png",
      "https://glownd.com/wp-content/uploads/2026/08/9f33d912-5908-4c63-b38b-dafc66a4f378.png",
      "https://glownd.com/wp-content/uploads/2026/08/0769e5f4-edf9-4d1c-8045-fb70ae6daeba.png",
      "https://glownd.com/wp-content/uploads/2026/08/64a93bae-06e4-4e31-a829-159f31406b49.png",
      "https://glownd.com/wp-content/uploads/2026/08/d0671faf-e691-4ffa-bdd4-7caaff9ec7e0.png",
      "https://glownd.com/wp-content/uploads/2026/08/1f992915-644d-41e9-992d-5dfa3a3a8eee.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Elevate your everyday style with the Beige Croc-Embossed Shoulder Bag, featuring a sophisticated structured design, elegant brown trim, and a luxurious crocodile-inspired texture. Its versatile neutral tone makes it perfect for casual, work, brunch, and evening looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_588",
    "seller_id": "seller_glownd",
    "name": "Croc- Embossed Shoulder Bag - Black & White",
    "size": "Standard",
    "photo": "/products/glownd/glownd_588.png",
    "photos": [
      "/products/glownd/glownd_588.png",
      "https://glownd.com/wp-content/uploads/2026/08/a336df41-cba1-4320-990d-36f1ceda104d.png",
      "https://glownd.com/wp-content/uploads/2026/08/393ef1d0-9d4b-4d1f-8bf5-087d02945ecc.png",
      "https://glownd.com/wp-content/uploads/2026/08/5f8b760b-24c8-4a95-a384-14490babe65b.png",
      "https://glownd.com/wp-content/uploads/2026/08/eb41057b-8025-4068-99e8-0f3320236c0a.png"
    ],
    "price": 4000,
    "regular_price": 4600,
    "benefit_line": "Glossy crocodile-embossed texture with structured silhouette & premium clasp",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Elevate your everyday style with the Black & White Croc-Embossed Bag, a chic two-tone statement bag featuring a textured crocodile-inspired finish, structured silhouette, and elegant gold-tone hardware. Perfect for adding a polished touch to both casual and dressy outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Glossy Croc Texture",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_574",
    "seller_id": "seller_glownd",
    "name": "Sparkle Mini Baguette Shoulder Bag - Gold",
    "size": "Standard",
    "photo": "/products/glownd/glownd_574.png",
    "photos": [
      "/products/glownd/glownd_574.png",
      "https://glownd.com/wp-content/uploads/2026/08/43b135f9-b440-4c25-9ae0-ab5ade9adc77.png",
      "https://glownd.com/wp-content/uploads/2026/08/bb588212-0232-405f-9f71-ade08b126055.png",
      "https://glownd.com/wp-content/uploads/2026/08/da8e3d02-b4b5-438c-abc3-bde6b63164a8.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Add a touch of effortless glamour to your look with the Gold Sparkle Mini Baguette Shoulder Bag. Featuring a soft champagne-gold shimmer, elegant curved silhouette, delicate silver chain detailing, and charming pearl accents, this compact bag is perfect for elevating both casual and dressy outfit",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_573",
    "seller_id": "seller_glownd",
    "name": "Sparkle Mini Baguette Shoulder Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_573.png",
    "photos": [
      "/products/glownd/glownd_573.png",
      "https://glownd.com/wp-content/uploads/2026/08/5a9bfe88-d528-48ae-99e0-332e0fe4b87d.png",
      "https://glownd.com/wp-content/uploads/2026/08/2565cea4-baca-47bc-bd2f-8abd83834f5a.png",
      "https://glownd.com/wp-content/uploads/2026/08/32411908-d48d-4e0a-97ad-e6cd1730afa1.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/dd778b47-2d95-4e49-b342-b13a40f0668f.jpeg"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "The Black Sparkle Mini Baguette Shoulder Bag is a chic, compact accessory featuring a shimmering black finish, curved baguette silhouette, silver chain detailing, and a stylish charm accent. Perfect for adding a touch of sparkle to your look for date nights, parties, dinners, birthdays, events, and evening outings.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_572",
    "seller_id": "seller_glownd",
    "name": "Sparkle Mini Baguette Shoulder Bag - Silver",
    "size": "Standard",
    "photo": "/products/glownd/glownd_572.png",
    "photos": [
      "/products/glownd/glownd_572.png",
      "https://glownd.com/wp-content/uploads/2026/08/3d748db9-8fc9-4402-86bb-c574d7aed140.png",
      "https://glownd.com/wp-content/uploads/2026/08/51e44c6b-dede-4a28-b0bd-534bf4300809.png",
      "https://glownd.com/wp-content/uploads/2026/08/cd5f7808-c486-4a19-951e-1c0751533e07.png"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Add a touch of sparkle to your look with the Silver Sparkle Mini Baguette Shoulder Bag. Designed with a shimmering silver finish, compact baguette shape, statement chain details, and a versatile shoulder strap, it's the perfect accessory for parties, date nights, dinners, events, and stylish evenings out.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_571",
    "seller_id": "seller_glownd",
    "name": "Sparkle Mini Baguette Shoulder Bag - Pink",
    "size": "Standard",
    "photo": "/products/glownd/glownd_571.jpeg",
    "photos": [
      "/products/glownd/glownd_571.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/d01e5e39-1ef6-4432-91ec-fd3a273f54b2.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/c12b11ad-cf20-49b8-84b1-5d4bfe9bb002.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/f8114a49-8ff8-4705-9715-f643244b6e01.jpeg"
    ],
    "price": 2500,
    "regular_price": 2800,
    "benefit_line": "Chic shoulder bag designed to effortlessly elevate day-to-night outfits",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Shoulder Bags",
    "description": "Add a pretty touch of sparkle to your outfit with the Pink Sparkle Mini Baguette Shoulder Bag. Featuring a soft pink shimmer, compact baguette shape, and eye-catching silver details, it's perfect for brunches, date nights, parties, and special occasions.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_566",
    "seller_id": "seller_glownd",
    "name": "Mini Denim Top Handle Bag - Army Green",
    "size": "Standard",
    "photo": "/products/glownd/glownd_566.png",
    "photos": [
      "/products/glownd/glownd_566.png",
      "https://glownd.com/wp-content/uploads/2026/08/2c221f7c-63f0-4f6f-8d8a-8532889fbc4e.png",
      "https://glownd.com/wp-content/uploads/2026/08/ce6fd338-bfef-473c-8abe-cad899e3eda4.png",
      "https://glownd.com/wp-content/uploads/2026/08/028ada85-9ee1-41b8-99c1-975eb2851f64.png"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Add a stylish touch to your everyday looks with the Army Green Mini Denim Top Handle Bag. Featuring a structured mini silhouette, textured denim finish, curved flap, and distinctive knotted rope handles, this versatile bag is perfect for casual outings, brunch, shopping, dates, and everyday styling.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_558",
    "seller_id": "seller_glownd",
    "name": "Mini Denim Top Handle Bag - Light Blue",
    "size": "Standard",
    "photo": "/products/glownd/glownd_558.jpeg",
    "photos": [
      "/products/glownd/glownd_558.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/b4cd8c15-3841-456f-a316-7fd9b4db0327.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/c547e015-e773-4021-a11a-fce11b2535cc.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/874095be-481d-46ba-843f-ec44e09d13f6.jpeg"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "The Light Blue Mini Denim Top Handle Bag is a chic and versatile accessory featuring a structured silhouette, curved flap and unique knotted handle. Its soft light-blue denim finish adds a fresh, casual touch to everyday outfits.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_glownd_557",
    "seller_id": "seller_glownd",
    "name": "Mini Denim Top Handle Bag - Black",
    "size": "Standard",
    "photo": "/products/glownd/glownd_557.jpeg",
    "photos": [
      "/products/glownd/glownd_557.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/0b37df69-8f99-4bee-bfe6-dd3f0cb465e5.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/a810f05b-466b-4ea7-9c15-a632787db166.jpeg",
      "https://glownd.com/wp-content/uploads/2026/08/a37713db-e3d3-429c-aa44-28fee0259993.jpeg"
    ],
    "price": 3500,
    "regular_price": 4000,
    "benefit_line": "Elegantly crafted handbag with timeless appeal and versatile styling",
    "in_stock": true,
    "featured": false,
    "badge": "TRENDING",
    "category": "Handbags & Bags",
    "sub_category": "Luxury Handbags",
    "description": "Black Mini Denim Top Handle Bag is a chic, compact accessory featuring a sleek black finish, structured shape, curved flap, and stylish knotted handle. Complete with a detachable shoulder strap, it's perfect for everyday outings, brunch, shopping, dinners, and casual looks.",
    "highlights": [
      "Premium Craftsmanship",
      "Structured Silhouette",
      "Lipa na M-Pesa Available",
      "Countrywide Fast Dispatch"
    ]
  },
  {
    "id": "prod_moh_bomber_jacket",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Unisex Vintage Warm Fleece Bomber Jacket",
    "size": "M, L, XL, XXL",
    "photo": "/products/moh-bomber-jacket.jpg",
    "photos": [
      "/products/moh-bomber-jacket.jpg",
      "/products/moh-mens-polo.jpg",
      "/products/moh-khaki-pants.jpg"
    ],
    "companion_id": "prod_moh_khaki_pants",
    "price": 2200,
    "regular_price": 2800,
    "benefit_line": "Windproof urban street style with warm quilted inner lining",
    "in_stock": true,
    "featured": true,
    "badge": "New Arrival",
    "category": "Clothes & Fashion",
    "description": "Classic warm unisex bomber jacket perfect for cold evenings and daily streetwear. Heavy brass zipper, reinforced ribbed cuffs and collar, with double side pockets.",
    "highlights": [
      "Wind & Cold Resistant",
      "Premium Heavy Fabric",
      "Unisex Fit",
      "All Sizes Available"
    ]
  },
  {
    "id": "prod_moh_womens_dress",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Women's Elegant Ribbed Bodycon Midi Dress",
    "size": "Free Size (6-14)",
    "photo": "/products/moh-womens-dress.jpg",
    "photos": [
      "/products/moh-womens-dress.jpg",
      "/products/moh-bomber-jacket.jpg"
    ],
    "companion_id": "prod_moh_bomber_jacket",
    "price": 1650,
    "regular_price": 2200,
    "benefit_line": "Flattering stretch ribbed fabric suitable for church, work or dinner",
    "in_stock": true,
    "featured": true,
    "badge": "Trending Dress",
    "category": "Clothes & Fashion",
    "description": "Turn heads with this versatile ribbed knit midi dress. Hugs your curves comfortably with high-grade stretch cotton that never fades or loses shape. Elegant round neck and modest length.",
    "highlights": [
      "Stretches to Fit 6-14",
      "Breathable Cotton Ribbed",
      "Non-See-Through",
      "Countrywide Dispatch"
    ]
  },
  {
    "id": "prod_moh_mens_polo",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Men's Classic Pure Pique Cotton Polo T-Shirt",
    "size": "M, L, XL",
    "photo": "/products/moh-mens-polo.jpg",
    "photos": [
      "/products/moh-mens-polo.jpg",
      "/products/moh-khaki-pants.jpg"
    ],
    "companion_id": "prod_moh_khaki_pants",
    "price": 1200,
    "regular_price": 1600,
    "benefit_line": "100% breathable pique cotton with embroidered chest emblem",
    "in_stock": true,
    "featured": true,
    "badge": "Men's Classic",
    "category": "Clothes & Fashion",
    "description": "Elevate your casual smart look with this timeless pique polo. Pairs perfectly with khakis or jeans. Color-fast dye guaranteed not to shrink or fade in wash.",
    "highlights": [
      "100% Pure Pique Cotton",
      "Reinforced Collar",
      "Classic Smart Fit",
      "Available in 5 Colors"
    ]
  },
  {
    "id": "prod_moh_khaki_pants",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Men's Slim-Fit Stretch Chino Khaki Trousers",
    "size": "Waist 30-38",
    "photo": "/products/moh-khaki-pants.jpg",
    "photos": [
      "/products/moh-khaki-pants.jpg",
      "/products/moh-mens-polo.jpg"
    ],
    "companion_id": "prod_moh_mens_polo",
    "price": 1500,
    "regular_price": 2000,
    "benefit_line": "Smart office & casual khaki with 2% elastane stretch for all-day comfort",
    "in_stock": true,
    "featured": false,
    "badge": "Best Value",
    "category": "Clothes & Fashion",
    "description": "The ultimate daily trouser for the modern Kenyan gentleman. Tailored slim fit with subtle stretch that lets you move freely. Wrinkle-resistant cotton blend that stays crisp from 8am to 8pm.",
    "highlights": [
      "Comfort Stretch Fabric",
      "Wrinkle Resistant",
      "Deep Front & Back Pockets",
      "Waist 30 to 38"
    ]
  },
  {
    "id": "prod_moh_duvet_set",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Heavy Fiber 4-Piece Duvet Bedding Set (6x6 Bed)",
    "size": "6x6 King",
    "photo": "/products/moh-duvet-set.jpg",
    "photos": [
      "/products/moh-duvet-set.jpg",
      "/products/moh-curtains.jpg",
      "/products/moh-fluffy-carpet.jpg"
    ],
    "companion_id": "prod_moh_curtains",
    "price": 2800,
    "regular_price": 3500,
    "benefit_line": "Warm 400GSM micro-fiber duvet + bedsheet + 2 matching pillowcases",
    "in_stock": true,
    "featured": true,
    "badge": "Best Seller",
    "category": "Household & Bedding",
    "description": "Transform your bedroom with this luxury 4-piece duvet set. Includes 1 warm heavy-fiber duvet, 1 fitted bedsheet, and 2 luxury pillowcases. Fade-proof, machine-washable cotton blend.",
    "highlights": [
      "4-Piece Complete Set",
      "Warm 400GSM Fiber",
      "Fits 6x6 Bed",
      "Countrywide Delivery"
    ]
  },
  {
    "id": "prod_moh_fluffy_carpet",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Living Room Microfiber Anti-Slip Fluffy Carpet (5x7)",
    "size": "5x7 Feet",
    "photo": "/products/moh-fluffy-carpet.jpg",
    "photos": [
      "/products/moh-fluffy-carpet.jpg",
      "/products/moh-curtains.jpg"
    ],
    "companion_id": "prod_moh_curtains",
    "price": 4500,
    "regular_price": 5500,
    "benefit_line": "Ultra-soft deep shag pile with rubber dotted non-slip backing",
    "in_stock": true,
    "featured": false,
    "badge": "Home Comfort",
    "category": "Household & Bedding",
    "description": "Sink your feet into pure luxury. High-pile microfiber fluffy carpet with non-slip dotted bottom safe for tiled floors. Does not shed or trap odors. Easy to vacuum and wash.",
    "highlights": [
      "Deep Shag Microfiber",
      "Anti-Slip Dotted Backing",
      "5x7 Living Room Size",
      "Non-Shedding"
    ]
  },
  {
    "id": "prod_moh_curtains",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Luxury Thermal Blackout Eyelet Window Curtains (2-Pack)",
    "size": "2 Panels (Each 2.5m drop)",
    "photo": "/products/moh-curtains.jpg",
    "photos": [
      "/products/moh-curtains.jpg",
      "/products/moh-duvet-set.jpg"
    ],
    "companion_id": "prod_moh_duvet_set",
    "price": 3200,
    "regular_price": 4000,
    "benefit_line": "Heavy jacquard weave blocking 90% sunlight & outside noise",
    "in_stock": true,
    "featured": false,
    "badge": "Top Quality",
    "category": "Household & Bedding",
    "description": "Block harsh morning sunlight and reduce street noise with these premium heavy blackout curtains. Rust-free metal eyelet rings slide effortlessly on standard curtain rods.",
    "highlights": [
      "90% Light Blockout",
      "Heavy Jacquard Fabric",
      "Metal Eyelet Rings Included",
      "Standard 2-Window Pack"
    ]
  },
  {
    "id": "prod_moh_thermal_flask",
    "seller_id": "seller_beauty_bar_kenya",
    "name": "Double-Wall Stainless Steel Vacuum Thermal Flask 1.5L",
    "size": "1.5 Liters",
    "photo": "/products/moh-thermal-flask.jpg",
    "photos": [
      "/products/moh-thermal-flask.jpg"
    ],
    "price": 1400,
    "regular_price": 1800,
    "benefit_line": "Keeps chai or coffee boiling hot for 24 hours guaranteed",
    "in_stock": true,
    "featured": false,
    "badge": "Kitchen Essential",
    "category": "Household & Bedding",
    "description": "Never drink cold tea again. Double-wall insulated 304 food-grade stainless steel flask maintains boiling temperature for 24 hours. Leak-proof push-button spout.",
    "highlights": [
      "24-Hour Heat Retention",
      "1.5 Liter Capacity",
      "Food-Grade Stainless Steel",
      "Leak-Proof Seal"
    ]
  }
];

export const STARTER_PRODUCTS = CURATED_PRODUCTS;
export const SHOE_IN_PRODUCTS = CURATED_PRODUCTS.filter((p) => p.category === 'Sneakers & Kicks' || p.category === "Men's Footwear");
