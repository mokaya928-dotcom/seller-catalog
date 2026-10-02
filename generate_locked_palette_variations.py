"""
Locked Default Catalogue Post Template - 5 Palette Variations Generator
Strictly adheres to:
1. ONE locked template architecture (1080x1920, #F8FAFC light background, centered glass card, exact layout coordinates).
2. ONLY 5 theme variables change:
   - --band: header and footer background
   - --stripe: accent line color
   - --price-bg: price box background
   - --badge: corner badge color
   - --subtext: description text color
3. Zero emojis / symbols that render as empty boxes.
4. Bold sans-serif typography throughout (no serif, no neon, no glow).
5. No fake or risky claims (e.g. drop '100% AUTHENTIC' on luxury items).
6. Auto-wrapping title and bounds-fitted product image with aspect ratio preserved.
"""

import os
import html
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WORKSPACE = r"I:\ALL THE WEBSITES\seller"
FONTS_DIR = r"C:\Windows\Fonts"
FONT_BOLD = os.path.join(FONTS_DIR, "segoeuib.ttf")
FONT_REG = os.path.join(FONTS_DIR, "segoeui.ttf")

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def clean_text(text):
    if not text:
        return ""
    # Unescape HTML entities e.g. &#038; -> &, &#8220; -> "
    s = html.unescape(str(text))
    # Strip dangerous emojis / symbols that turn into empty tofu boxes in standard fonts
    tofu_chars = ["✦", "⚡", "🔥", "🎁", "⏰", "“", "”", "⚠️", "✨", "🟢", "✔", "★", "⭐", "💅", "💄", "👜", "📦"]
    for ch in tofu_chars:
        s = s.replace(ch, "")
    # Clean up double spaces
    return " ".join(s.split()).strip()

def get_product_bounds(pil_img):
    """
    Accurately detects non-background product boundaries to avoid huge blank margins.
    """
    rgb_img = pil_img.convert("RGB")
    w, h = rgb_img.size
    corner = rgb_img.getpixel((0, 0))
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    non_bg_found = False
    
    step = 2
    for y in range(0, h, step):
        for x in range(0, w, step):
            p = rgb_img.getpixel((x, y))
            is_corner = max(abs(p[0] - corner[0]), abs(p[1] - corner[1]), abs(p[2] - corner[2])) < 18
            is_white = p[0] > 245 and p[1] > 245 and p[2] > 245
            if not is_corner and not is_white:
                non_bg_found = True
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    if not non_bg_found or (max_x - min_x < 30) or (max_y - min_y < 30):
        return (0, 0, w, h)
        
    pad_w = int((max_x - min_x) * 0.03)
    pad_h = int((max_y - min_y) * 0.03)
    crop_x = max(0, min_x - pad_w)
    crop_y = max(0, min_y - pad_h)
    crop_w = min(w - crop_x, (max_x - min_x) + pad_w * 2)
    crop_h = min(h - crop_y, (max_y - min_y) + pad_h * 2)
    return (crop_x, crop_y, crop_w, crop_h)

def wrap_text(text, font, max_width, draw):
    words = text.split()
    if not words:
        return []
    lines = []
    current_line = words[0]
    for word in words[1:]:
        test_line = current_line + " " + word
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if (bbox[2] - bbox[0]) <= max_width:
            current_line = test_line
        else:
            lines.push(current_line) if hasattr(lines, 'push') else lines.append(current_line)
            current_line = word
    lines.append(current_line)
    return lines

def render_locked_template(
    product_image_path,
    product_title,
    description_text,
    price_text,
    size_badge_text,
    promo_badge_text,
    theme_colors,
    output_path
):
    """
    Renders the STRICTLY LOCKED catalogue post template.
    Only theme_colors change:
      --band
      --stripe
      --price-bg
      --badge
      --subtext
    """
    WIDTH = 1080
    HEIGHT = 1920
    
    # Locked canvas base colors
    CANVAS_BG = (248, 250, 252)    # #F8FAFC (Never dark)
    BORDER_COLOR = (226, 232, 240) # #E2E8F0
    TEXT_DARK = (15, 23, 42)       # #0F172A
    WHITE = (255, 255, 255)
    
    # Theme color variables
    band_color = theme_colors["band"]
    stripe_color = theme_colors["stripe"]
    price_bg = theme_colors["price_bg"]
    badge_color = theme_colors["badge"]
    subtext_color = theme_colors["subtext"]
    
    img = Image.new("RGBA", (WIDTH, HEIGHT), CANVAS_BG + (255,))
    draw = ImageDraw.Draw(img)
    
    # Locked outer frame border
    draw.rectangle([7, 7, WIDTH - 8, HEIGHT - 8], outline=BORDER_COLOR, width=14)
    
    # -------------------------------------------------------------
    # 1. TOP HEADER BAND (170px)
    # Locked positions:
    # - Height 170px
    # - Double accent stripes: 8px on top (0..8), 8px on bottom (162..170)
    # - Kicker at Y=44
    # - Title at Y=94
    # - Location at Y=136
    # -------------------------------------------------------------
    header_h = 170
    draw.rectangle([0, 0, WIDTH, header_h], fill=band_color)
    draw.rectangle([0, 0, WIDTH, 8], fill=stripe_color)
    draw.rectangle([0, header_h - 8, WIDTH, header_h], fill=stripe_color)
    
    # Kicker (Clean typography, no emojis/tofu)
    draw.text((WIDTH // 2, 44), "PREMIUM QUALITY • VERIFIED SELECTION", font=get_font(FONT_BOLD, 18), fill=stripe_color, anchor="mm")
    # Brand Name (Bold sans-serif, white)
    draw.text((WIDTH // 2, 94), "THE BEAUTY BAR KENYA", font=get_font(FONT_BOLD, 36), fill=WHITE, anchor="mm")
    # Location
    draw.text((WIDTH // 2, 136), "Jamia Mall, Nairobi CBD • Countrywide Dispatch", font=get_font(FONT_REG, 17), fill=(226, 232, 240), anchor="mm")
    
    # -------------------------------------------------------------
    # 2. MAIN PRODUCT SHOWCASE CARD (LOCKED GLASS CARD)
    # Locked positions:
    # - X=60, Y=195, W=960, H=1080 (Y: 195 -> 1275)
    # - Corner radius: 28px
    # - White fill, soft shadow, thin border #E2E8F0
    # -------------------------------------------------------------
    box_x = 60
    box_w = 960
    box_y = header_h + 25  # 195px
    box_h = 1080           # ends at 1275px
    card_radius = 28
    
    # Drop shadow
    shadow_card = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ImageDraw.Draw(shadow_card).rounded_rectangle(
        [box_x, box_y + 4, box_x + box_w, box_y + box_h + 6],
        radius=card_radius,
        fill=(0, 0, 0, 20)
    )
    shadow_card = shadow_card.filter(ImageFilter.GaussianBlur(12))
    img.alpha_composite(shadow_card)
    
    # White card surface
    card = Image.new("RGBA", (box_w, box_h), WHITE + (255,))
    cdraw = ImageDraw.Draw(card)
    cdraw.rounded_rectangle(
        [0, 0, box_w - 1, box_h - 1],
        radius=card_radius,
        fill=WHITE,
        outline=BORDER_COLOR,
        width=3
    )
    
    # Top-Left Corner Badge (Size tag)
    # Sized dynamically based on actual text to PREVENT OVERFLOW
    clean_size = clean_text(size_badge_text or "STANDARD")
    f_badge = get_font(FONT_BOLD, 15)
    size_bbox = cdraw.textbbox((0, 0), clean_size, font=f_badge)
    size_txt_w = size_bbox[2] - size_bbox[0]
    badge_w = max(160, size_txt_w + 40)
    
    cdraw.rounded_rectangle([24, 22, 24 + badge_w, 64], radius=12, fill=badge_color)
    cdraw.text((24 + badge_w // 2, 43), clean_size, font=f_badge, fill=WHITE, anchor="mm")
    
    # Top-Right Optional Promo Badge
    if promo_badge_text:
        clean_promo = clean_text(promo_badge_text)
        promo_bbox = cdraw.textbbox((0, 0), clean_promo, font=f_badge)
        promo_txt_w = promo_bbox[2] - promo_bbox[0]
        promo_w = max(160, promo_txt_w + 40)
        promo_x = box_w - promo_w - 24
        cdraw.rounded_rectangle([promo_x, 22, promo_x + promo_w, 64], radius=12, fill=stripe_color)
        cdraw.text((promo_x + promo_w // 2, 43), clean_promo, font=f_badge, fill=WHITE, anchor="mm")
        
    # Product Image Centering (Strictly preserved aspect ratio, bounds cropped)
    if os.path.exists(product_image_path):
        prod_orig = Image.open(product_image_path).convert("RGBA")
        cx, cy, cw, ch = get_product_bounds(prod_orig)
        prod_cropped = prod_orig.crop((cx, cy, cx + cw, cy + ch))
        
        max_w = box_w - 70
        max_h = box_h - 100
        scale = min(max_w / float(cw), max_h / float(ch))
        bw = int(cw * scale)
        bh = int(ch * scale)
        
        prod_scaled = prod_cropped.resize((bw, bh), Image.Resampling.LANCZOS)
        bx = (box_w - bw) // 2
        by = 20 + (box_h - 20 - bh) // 2
        card.alpha_composite(prod_scaled, (bx, by))
        
    img.alpha_composite(card, (box_x, box_y))
    
    # -------------------------------------------------------------
    # 3. PRODUCT TITLE (Bold sans-serif, wrapped to max 2 lines cleanly)
    # Locked start Y: 1315px
    # -------------------------------------------------------------
    clean_title = clean_text(product_title)
    title_start_y = box_y + box_h + 38  # 1313px
    f_title = get_font(FONT_BOLD, 40)
    
    # Wrap title within max card width (960px)
    title_lines = wrap_text(clean_title, f_title, box_w, draw)
    if len(title_lines) > 2:
        # Scale down slightly if needed for very long titles
        f_title = get_font(FONT_BOLD, 34)
        title_lines = wrap_text(clean_title, f_title, box_w, draw)
        if len(title_lines) > 2:
            title_lines = [title_lines[0], " ".join(title_lines[1:])]
            
    line_h = 48
    for i, line in enumerate(title_lines[:2]):
        draw.text((WIDTH // 2, title_start_y + i * line_h), line, font=f_title, fill=TEXT_DARK, anchor="mm")
        
    title_end_y = title_start_y + (len(title_lines[:2]) - 1) * line_h
    
    # -------------------------------------------------------------
    # 4. ONE-LINE DESCRIPTION (Harmonized subtext color, plain text)
    # Locked Y offset: title_end_y + 40
    # -------------------------------------------------------------
    clean_desc = clean_text(description_text)
    benefit_y = title_end_y + 40
    f_desc = get_font(FONT_REG, 23)
    
    # Auto-shrink if description is very long
    desc_bbox = draw.textbbox((0, 0), clean_desc, font=f_desc)
    desc_w = desc_bbox[2] - desc_bbox[0]
    if desc_w > box_w:
        f_desc = get_font(FONT_REG, 20)
        
    draw.text((WIDTH // 2, benefit_y), clean_desc, font=f_desc, fill=subtext_color, anchor="mm")
    
    # -------------------------------------------------------------
    # 5. DEDICATED PRICE BOX / OFFER POP RECTANGLE
    # Locked size: 560 x 114 px
    # Locked position: Y = benefit_y + 32
    # -------------------------------------------------------------
    p_badge_w = 560
    p_badge_h = 114
    p_badge_x = (WIDTH - p_badge_w) // 2
    p_badge_y = benefit_y + 32
    
    # Soft outline accent
    draw.rounded_rectangle(
        [p_badge_x, p_badge_y, p_badge_x + p_badge_w, p_badge_y + p_badge_h],
        radius=22,
        fill=price_bg,
        outline=stripe_color,
        width=4
    )
    
    # Price box kicker
    draw.text(
        (WIDTH // 2, p_badge_y + 28),
        "SPECIAL OFFER PRICE • IN STOCK",
        font=get_font(FONT_BOLD, 15),
        fill=stripe_color,
        anchor="mm"
    )
    
    # Price amount
    clean_price = clean_text(price_text)
    draw.text(
        (WIDTH // 2, p_badge_y + 76),
        clean_price,
        font=get_font(FONT_BOLD, 64),
        fill=WHITE,
        anchor="mm"
    )
    
    # -------------------------------------------------------------
    # 6. BOTTOM FOOTER BAND (300px)
    # Locked positions:
    # - Height 300px (1620 -> 1920)
    # - Double accent stripes: 8px top (1620..1628), 8px bottom (1912..1920)
    # - CTA Prompt at Y=1666
    # - WhatsApp Contact at Y=1734
    # - Delivery Guarantee at Y=1794
    # - M-Pesa Till Container at Y=1840
    # -------------------------------------------------------------
    footer_h = 300
    footer_y = HEIGHT - footer_h # 1620px
    
    draw.rectangle([0, footer_y, WIDTH, HEIGHT], fill=band_color)
    draw.rectangle([0, footer_y, WIDTH, footer_y + 8], fill=stripe_color)
    draw.rectangle([0, HEIGHT - 8, WIDTH, HEIGHT], fill=stripe_color)
    
    # CTA Kicker
    draw.text(
        (WIDTH // 2, footer_y + 46),
        "TO INQUIRE OR ORDER ON WHATSAPP:",
        font=get_font(FONT_BOLD, 20),
        fill=stripe_color,
        anchor="mm"
    )
    
    # WhatsApp Phone
    draw.text(
        (WIDTH // 2, footer_y + 114),
        "WhatsApp: +254 728 222 211",
        font=get_font(FONT_BOLD, 56),
        fill=WHITE,
        anchor="mm"
    )
    
    # Delivery Info
    draw.text(
        (WIDTH // 2, footer_y + 172),
        "Screenshot this post to order • Countrywide Delivery",
        font=get_font(FONT_REG, 19),
        fill=(203, 213, 225),
        anchor="mm"
    )
    
    # M-Pesa Till Pill
    mp_w = 740
    mp_h = 46
    mp_x = (WIDTH - mp_w) // 2
    mp_y = footer_y + 218
    draw.rounded_rectangle([mp_x, mp_y, mp_x + mp_w, mp_y + mp_h], radius=12, fill=price_bg, outline=stripe_color, width=2)
    draw.text(
        (WIDTH // 2, mp_y + 23),
        "Lipa na M-Pesa Buy Goods Till: 582910 • Same-Day Dispatch",
        font=get_font(FONT_BOLD, 16),
        fill=WHITE,
        anchor="mm"
    )
    
    # Save output
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"[OK] Generated: {output_path}")

def main():
    # 5 Master Harmonized Palettes
    PALETTES = {
        "1_forest_green_amber": {
            "name": "Forest Green + Amber (Default / Organic & Wellness)",
            "colors": {
                "band": (6, 78, 59),          # #064E3B Forest Green
                "stripe": (245, 158, 11),     # #F59E0B Warm Amber Gold
                "price_bg": (6, 78, 59),      # #064E3B
                "badge": (15, 23, 42),        # #0F172A Dark Slate
                "subtext": (4, 120, 87)       # #047857 Emerald Subtext
            },
            "product": {
                "image": os.path.join(WORKSPACE, "public", "products", "bbk-cliganic-rosehip.jpg"),
                "title": "Cliganic 100% Pure Organic Rosehip Oil",
                "desc": "Cold-pressed virgin botanical oil for face & body glow",
                "price": "KES 2,400",
                "size": "NET 30 ML",
                "promo": "IN STOCK"
            }
        },
        "2_deep_teal_gold": {
            "name": "Deep Teal + Gold (Body Care & Dove)",
            "colors": {
                "band": (14, 94, 111),        # #0E5E6F Deep Teal
                "stripe": (229, 169, 59),     # #E5A93B Warm Gold
                "price_bg": (14, 94, 111),    # #0E5E6F Deep Teal
                "badge": (14, 94, 111),       # #0E5E6F
                "subtext": (15, 118, 110)     # #0F766E Teal Subtext
            },
            "product": {
                "image": os.path.join(WORKSPACE, "image.png"),
                "title": "Dove Men+Care Relax Eucalyptus + Cedar Wash",
                "desc": "Plant-based cleansers & moisturizers • 92% natural",
                "price": "KES 1,850",
                "size": "NET 769 ML",
                "promo": "SPECIAL OFFER"
            }
        },
        "3_midnight_navy_amber": {
            "name": "Midnight Navy + Amber (Bags & Luxury Bedding)",
            "colors": {
                "band": (15, 23, 42),         # #0F172A Midnight Navy
                "stripe": (217, 119, 6),      # #D97706 Amber
                "price_bg": (15, 23, 42),     # #0F172A
                "badge": (30, 41, 59),        # #1E293B Slate Badge
                "subtext": (71, 85, 105)      # #475569 Slate Subtext
            },
            "product": {
                "image": os.path.join(WORKSPACE, "public", "products", "glownd", "glownd_1022.png"),
                "title": "The Valenne Structured Statement Bag",
                "desc": "Timeless vegan leather silhouette • Gold-tone hardware",
                "price": "KES 4,000",
                "size": "STANDARD SIZE",
                "promo": "LIMITED PIECES"
            }
        },
        "4_burgundy_gold": {
            "name": "Burgundy + Gold (Lipsticks & Glosses)",
            "colors": {
                "band": (91, 20, 37),         # #5B1425 Rich Burgundy
                "stripe": (234, 179, 8),      # #EAB308 Champagne Gold
                "price_bg": (91, 20, 37),     # #5B1425
                "badge": (91, 20, 37),        # #5B1425
                "subtext": (131, 24, 67)      # #831843 Deep Rose Subtext
            },
            "product": {
                "image": os.path.join(WORKSPACE, "public", "products", "bbk-bellazuri-lipstick.jpg"),
                "title": "BELLAZURI Velvet Matte Liquid Lipstick",
                "desc": "16HR long-wear velvety lip color • Non-drying formula",
                "price": "KES 1,800",
                "size": "NET 5 ML",
                "promo": "HOT SHADE"
            }
        },
        "5_dusty_rose_charcoal": {
            "name": "Dusty Rose + Charcoal (Pink & Soft Cosmetics)",
            "colors": {
                "band": (136, 48, 78),        # #88304E Dusty Rose
                "stripe": (244, 194, 209),    # #F4C2D1 Soft Blush Gold
                "price_bg": (51, 65, 85),     # #334155 Charcoal
                "badge": (51, 65, 85),        # #334155 Charcoal
                "subtext": (100, 116, 139)    # #64748B Muted Charcoal Subtext
            },
            "product": {
                "image": os.path.join(WORKSPACE, "public", "products", "bbk-saltair-lip-oil.jpg"),
                "title": "Saltair Nourishing Lip Oil Hydrating Balm",
                "desc": "Enriched with botanical oils • Sheer conditioning shine",
                "price": "KES 1,800",
                "size": "NET 10 ML",
                "promo": "BEST SELLER"
            }
        }
    }
    
    out_dir = os.path.join(WORKSPACE, "palette_variations")
    os.makedirs(out_dir, exist_ok=True)
    
    print("--- GENERATING 5 LOCKED PALETTE VARIATIONS ---")
    for key, data in PALETTES.items():
        out_path = os.path.join(out_dir, f"variation_{key}.png")
        render_locked_template(
            product_image_path=data["product"]["image"],
            product_title=data["product"]["title"],
            description_text=data["product"]["desc"],
            price_text=data["product"]["price"],
            size_badge_text=data["product"]["size"],
            promo_badge_text=data["product"]["promo"],
            theme_colors=data["colors"],
            output_path=out_path
        )
        
    print("\n[SUCCESS] All 5 locked palette variations generated successfully!")

if __name__ == "__main__":
    main()
