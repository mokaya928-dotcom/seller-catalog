import os
import urllib.request
import io
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WORKSPACE = r"I:\ALL THE WEBSITES\seller"
OUTPUT_DIR = os.path.join(WORKSPACE, "orewa_sample")
PUBLIC_DIR = os.path.join(WORKSPACE, "public", "orewa_sample")
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

FONTS_DIR = r"C:\Windows\Fonts"
FONT_BOLD = os.path.join(FONTS_DIR, "segoeuib.ttf")
FONT_REG = os.path.join(FONTS_DIR, "segoeui.ttf")
FONT_ARIAL_BD = os.path.join(FONTS_DIR, "arialbd.ttf")

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_round_rect(draw, box, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def download_image(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return Image.open(io.BytesIO(resp.read())).convert("RGBA")

def create_orewa_flyer(product, output_name):
    # Dimensions: 1080 x 1920 (9:16 WhatsApp Status & IG Story)
    W, H = 1080, 1920
    
    # 1. Base Canvas - Deep Luxury Teal Gradient
    img = Image.new("RGBA", (W, H), (10, 31, 38, 255))
    draw = ImageDraw.Draw(img)

    for y in range(H):
        ratio = y / H
        r = int(7 + ratio * 15)
        g = int(25 + ratio * 32)
        b = int(31 + ratio * 38)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Glow circle behind product card
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([W//2 - 380, 480, W//2 + 380, 1200], fill=(229, 169, 59, 32))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    img.alpha_composite(glow)
    draw = ImageDraw.Draw(img)

    # 2. Outer Border Frame
    draw_round_rect(draw, [32, 32, W - 32, H - 32], radius=24, outline=(229, 169, 59, 80), width=2)

    # Header Section
    f_brand = get_font(FONT_ARIAL_BD, 44)
    f_sub = get_font(FONT_REG, 21)
    f_tag = get_font(FONT_BOLD, 20)

    # Brand Title
    brand_title = "O R E W A   L I M I T E D"
    draw.text((W // 2, 85), brand_title, fill=(245, 190, 85), font=f_brand, anchor="mm")
    
    tagline = "Official Store: orewa.co.ke  •  Woodvale Centre, Westlands, Nairobi"
    draw.text((W // 2, 132), tagline, fill=(185, 215, 222), font=f_sub, anchor="mm")

    # Express Delivery Banner
    banner_box = [65, 162, W - 65, 220]
    draw_round_rect(draw, banner_box, radius=29, fill=(14, 62, 74), outline=(229, 169, 59), width=2)
    banner_text = "EXPRESS 2-HOUR NAIROBI DELIVERY  •  PAY ON DELIVERY AVAILABLE"
    draw.text((W // 2, 191), banner_text, fill=(255, 255, 255), font=f_tag, anchor="mm")

    # Deal Badge
    f_deal = get_font(FONT_ARIAL_BD, 24)
    deal_box = [W // 2 - 240, 240, W // 2 + 240, 296]
    draw_round_rect(draw, deal_box, radius=12, fill=(229, 169, 59), outline=(255, 255, 255), width=2)
    draw.text((W // 2, 268), product.get('badge_headline', 'FEATURED DEAL • TODAY ONLY'), fill=(10, 31, 38), font=f_deal, anchor="mm")

    # 3. Product Image Card (Hero Showcase)
    card_box = [65, 315, W - 65, 1120]
    draw_round_rect(draw, card_box, radius=28, fill=(255, 255, 255), outline=(229, 169, 59, 140), width=3)

    # 100% Original badge (top left of card)
    orig_badge = [85, 335, 395, 385]
    draw_round_rect(draw, orig_badge, radius=25, fill=(14, 94, 111), outline=(229, 169, 59), width=2)
    f_badge = get_font(FONT_BOLD, 17)
    draw.text((240, 360), "100% ORIGINAL IMPORT", fill=(255, 255, 255), font=f_badge, anchor="mm")

    # Stock badge (top right of card)
    stock_badge = [W - 275, 335, W - 85, 385]
    draw_round_rect(draw, stock_badge, radius=25, fill=(22, 101, 52), outline=(134, 239, 172), width=1)
    # small circle dot
    draw.ellipse([W - 258, 354, W - 246, 366], fill=(134, 239, 172))
    draw.text((W - 170, 360), "IN STOCK CBD", fill=(255, 255, 255), font=f_badge, anchor="mm")

    # Load and scale product photo
    print(f"Downloading product photo: {product['photo']}")
    prod_img = download_image(product['photo'])
    
    max_pw, max_ph = 800, 680
    pw, ph = prod_img.size
    ratio = min(max_pw / pw, max_ph / ph)
    new_size = (int(pw * ratio), int(ph * ratio))
    prod_img = prod_img.resize(new_size, Image.Resampling.LANCZOS)

    px = (W - new_size[0]) // 2
    py = 395 + (max_ph - new_size[1]) // 2
    img.alpha_composite(prod_img, (px, py))
    draw = ImageDraw.Draw(img)

    # 4. Product Details Section
    f_title = get_font(FONT_ARIAL_BD, 40)
    f_bullet = get_font(FONT_BOLD, 22)

    title = product['name']
    words = title.split()
    line1, line2 = title, ""
    if len(title) > 34:
        mid = len(words) // 2
        line1 = " ".join(words[:mid+1])
        line2 = " ".join(words[mid+1:])

    draw.text((W // 2, 1165), line1, fill=(255, 255, 255), font=f_title, anchor="mm")
    if line2:
        draw.text((W // 2, 1215), line2, fill=(255, 255, 255), font=f_title, anchor="mm")
        benefit_y = 1265
    else:
        benefit_y = 1225

    # 3 Key Feature Bullets with gold bullet dots
    bullets = product.get('bullets', [
        "Genuine Brand Formulation — Sourced via Authorized Channels",
        "Visible Fast Results for Radiant, Healthy Glow",
        "Safe for All Skin / Hair Types • Dermatologist Approved"
    ])
    
    by = benefit_y
    for b in bullets:
        # Draw gold dot
        text_bbox = draw.textbbox((W // 2, by), b, font=f_bullet, anchor="mm")
        dot_x = text_bbox[0] - 22
        draw.ellipse([dot_x, by - 5, dot_x + 10, by + 5], fill=(229, 169, 59))
        draw.text((W // 2, by), b, fill=(230, 245, 250), font=f_bullet, anchor="mm")
        by += 40

    # 5. Price Pop Offer Container (Increased height and proper margins)
    price_box = [65, 1400, W - 65, 1590]
    draw_round_rect(draw, price_box, radius=22, fill=(14, 52, 63), outline=(229, 169, 59), width=3)

    # Left: Was Price
    was_price = product.get('was_price', int(product['price'] * 1.25))
    f_was_lbl = get_font(FONT_REG, 19)
    f_was_num = get_font(FONT_BOLD, 28)
    draw.text((115, 1435), "REGULAR PRICE:", fill=(165, 190, 200), font=f_was_lbl)
    was_text = f"KES {was_price:,}"
    draw.text((115, 1468), was_text, fill=(248, 113, 113), font=f_was_num)
    
    # Strike-through line on regular price
    bbox = draw.textbbox((115, 1468), was_text, font=f_was_num)
    mid_y = (bbox[1] + bbox[3]) // 2
    draw.line([(bbox[0] - 4, mid_y), (bbox[2] + 4, mid_y)], fill=(239, 68, 68), width=3)

    # Right: Huge Deal Price in Gold/White
    f_deal_lbl = get_font(FONT_BOLD, 20)
    draw.text((W - 115, 1435), "SPECIAL OFFER TODAY", fill=(229, 169, 59), font=f_deal_lbl, anchor="ra")
    deal_text = f"KES {product['price']:,}"
    f_price = get_font(FONT_ARIAL_BD, 60)
    draw.text((W - 115, 1465), deal_text, fill=(255, 255, 255), font=f_price, anchor="ra")

    # Clean divider line
    draw.line([(95, 1530), (W - 95, 1530)], fill=(229, 169, 59, 100), width=1)
    offer_note = "FREE DELIVERY FOR ORDERS ABOVE KES 2,500  •  2-HR BODA IN NAIROBI"
    draw.text((W // 2, 1558), offer_note, fill=(254, 240, 138), font=get_font(FONT_BOLD, 18), anchor="mm")

    # 6. Sticky WhatsApp Order CTA (Bottom)
    wa_box = [65, 1620, W - 65, 1775]
    draw_round_rect(draw, wa_box, radius=24, fill=(37, 211, 102), outline=(255, 255, 255), width=3)
    
    # Draw WhatsApp phone circle badge
    draw.ellipse([110, 1655, 190, 1735], fill=(255, 255, 255))
    draw.text((150, 1695), "WA", fill=(22, 101, 52), font=get_font(FONT_ARIAL_BD, 26), anchor="mm")

    f_cta_main = get_font(FONT_ARIAL_BD, 36)
    f_cta_sub = get_font(FONT_BOLD, 24)

    draw.text((W // 2 + 30, 1668), "TAP TO ORDER ON WHATSAPP", fill=(10, 35, 20), font=f_cta_main, anchor="mm")
    draw.text((W // 2 + 30, 1720), "+254 118 926 934  •  Woodvale Centre, Westlands", fill=(10, 35, 20), font=f_cta_sub, anchor="mm")

    # 7. Footer
    f_foot = get_font(FONT_REG, 20)
    draw.text((W // 2, 1815), "Orewa Limited • 100% Original Products Guaranteed • Open Mon - Sat", fill=(165, 200, 210), font=f_foot, anchor="mm")

    # Save
    out_path = os.path.join(OUTPUT_DIR, output_name)
    pub_path = os.path.join(PUBLIC_DIR, output_name)
    img_rgb = img.convert("RGB")
    img_rgb.save(out_path, "PNG", quality=95)
    img_rgb.save(pub_path, "PNG", quality=95)
    print(f"Generated: {out_path}")
    return out_path

# Product 1: L'Oreal Absolut Repair Oil 30ml
p1 = {
    "name": "L'Oreal Serie Expert Absolut Repair Oil (30ml)",
    "price": 2330,
    "was_price": 2850,
    "photo": "https://orewa.co.ke/wp-content/uploads/2026/09/LOreal-Absolut-Repair-Oil-30ml.png",
    "badge_headline": "BESTSELLER RESTOCK ALERT",
    "bullets": [
        "10-in-1 Leave-in Lightweight Nourishing Treatment",
        "Instantly Restores Dry & Heat-Damaged Hair Cuticles",
        "Leaves Zero Greasy Residue • Ultra Mirror Shine"
    ]
}

# Product 2: Garnier Vitamin C Serum Cleanser 100ml
p2 = {
    "name": "Garnier Even & Bright Vitamin C Serum Cleanser 100ml",
    "price": 950,
    "was_price": 1250,
    "photo": "https://orewa.co.ke/wp-content/uploads/2026/08/Garnier-Even-Bright-Vitamin-C-Serum-Cleanser-100ml.png",
    "badge_headline": "GLOW & EVEN TONE SPECIAL",
    "bullets": [
        "Enriched with Pure Vitamin C + Lemon Essence",
        "Deeply Cleanses, Fades Dark Spots & Restores Glow",
        "Gentle Daily Formula Suitable for Sensitive Skin"
    ]
}

create_orewa_flyer(p1, "orewa_loreal_absolut_repair_flyer.png")
create_orewa_flyer(p2, "orewa_garnier_vitamin_c_flyer.png")
