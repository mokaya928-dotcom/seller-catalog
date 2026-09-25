import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WORKSPACE = r"I:\ALL THE WEBSITES\seller"
IMAGE_PATH = os.path.join(WORKSPACE, "image.png")
OUTPUT_A = os.path.join(WORKSPACE, "sample_palette_emerald_unified.png")
OUTPUT_B = os.path.join(WORKSPACE, "sample_palette_luxury_slate.png")

FONTS_DIR = r"C:\Windows\Fonts"
FONT_BOLD = os.path.join(FONTS_DIR, "segoeuib.ttf")
FONT_REG = os.path.join(FONTS_DIR, "segoeui.ttf")

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def get_product_bounds(pil_img):
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
            is_corner = max(abs(p[0] - corner[0]), abs(p[1] - corner[1]), abs(p[2] - corner[2])) < 16
            is_white = p[0] > 246 and p[1] > 246 and p[2] > 246
            if not is_corner and not is_white:
                non_bg_found = True
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
                
    if not non_bg_found or (max_x - min_x < 30) or (max_y - min_y < 30):
        return (0, 0, w, h)
        
    pad_w = int((max_x - min_x) * 0.04)
    pad_h = int((max_y - min_y) * 0.04)
    crop_x = max(0, min_x - pad_w)
    crop_y = max(0, min_y - pad_h)
    crop_w = min(w - crop_x, (max_x - min_x) + pad_w * 2)
    crop_h = min(h - crop_y, (max_y - min_y) + pad_h * 2)
    return (crop_x, crop_y, crop_w, crop_h)

def render_unified(primary_color, accent_color, output_path, style_name):
    WIDTH = 1080
    HEIGHT = 1920
    
    WHITE = (255, 255, 255)
    CANVAS_BG = (248, 250, 252)
    BORDER_COLOR = (226, 232, 240)
    TEXT_DARK = (15, 23, 42)
    TEXT_MUTED = (100, 116, 139)
    
    img = Image.new("RGBA", (WIDTH, HEIGHT), CANVAS_BG + (255,))
    draw = ImageDraw.Draw(img)
    
    # Outer subtle canvas frame
    draw.rectangle([7, 7, WIDTH - 8, HEIGHT - 8], outline=BORDER_COLOR, width=14)
    
    # -------------------------------------------------------------
    # 1. TOP HEADER (Unified Primary Color + Single Gold Trim)
    # -------------------------------------------------------------
    header_h = 165
    draw.rectangle([0, 0, WIDTH, header_h], fill=primary_color)
    draw.rectangle([0, 0, WIDTH, 6], fill=accent_color)
    draw.rectangle([0, header_h - 6, WIDTH, header_h], fill=accent_color)
    
    draw.text((WIDTH // 2, 42), "✦ 100% AUTHENTIC • VERIFIED QUALITY ✦", font=get_font(FONT_BOLD, 17), fill=accent_color, anchor="mm")
    draw.text((WIDTH // 2, 94), "THE BEAUTY BAR KENYA", font=get_font(FONT_BOLD, 36), fill=WHITE, anchor="mm")
    draw.text((WIDTH // 2, 136), "Jamia Mall, Nairobi CBD • Countrywide Dispatch", font=get_font(FONT_REG, 17), fill=(226, 232, 240), anchor="mm")
    
    # -------------------------------------------------------------
    # 2. MAIN PRODUCT SHOWCASE CARD (Dominates canvas)
    # -------------------------------------------------------------
    box_x = 60
    box_w = 960
    box_y = header_h + 25
    box_h = 1080
    card_radius = 28
    
    shadow_card = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ImageDraw.Draw(shadow_card).rounded_rectangle([box_x, box_y + 4, box_x + box_w, box_y + box_h + 6], radius=card_radius, fill=(0, 0, 0, 20))
    shadow_card = shadow_card.filter(ImageFilter.GaussianBlur(12))
    img.alpha_composite(shadow_card)
    
    card = Image.new("RGBA", (box_w, box_h), WHITE + (255,))
    cdraw = ImageDraw.Draw(card)
    cdraw.rounded_rectangle([0, 0, box_w - 1, box_h - 1], radius=card_radius, fill=WHITE, outline=BORDER_COLOR, width=3)
    
    # Size pill uses the exact same primary color
    cdraw.rounded_rectangle([24, 22, 194, 64], radius=12, fill=primary_color)
    cdraw.text((109, 43), "NET 769 ML", font=get_font(FONT_BOLD, 15), fill=WHITE, anchor="mm")
    
    # Hero Product Image
    bottle_orig = Image.open(IMAGE_PATH).convert("RGBA")
    cx, cy, cw, ch = get_product_bounds(bottle_orig)
    bottle_cropped = bottle_orig.crop((cx, cy, cx + cw, cy + ch))
    
    max_w = box_w - 70
    max_h = box_h - 90
    scale = min(max_w / float(cw), max_h / float(ch))
    bw = int(cw * scale)
    bh = int(ch * scale)
    bottle_scaled = bottle_cropped.resize((bw, bh), Image.Resampling.LANCZOS)
    bx = (box_w - bw) // 2
    by = 15 + (box_h - 15 - bh) // 2
    card.alpha_composite(bottle_scaled, (bx, by))
    
    img.alpha_composite(card, (box_x, box_y))
    
    # -------------------------------------------------------------
    # 3. TITLE & BENEFIT (Restrained, elegant typography - NO loud neon text)
    # -------------------------------------------------------------
    title_start_y = box_y + box_h + 38
    f_title = get_font(FONT_BOLD, 42)
    draw.text((WIDTH // 2, title_start_y), "Dove Men+Care Relax Eucalyptus +", font=f_title, fill=TEXT_DARK, anchor="mm")
    draw.text((WIDTH // 2, title_start_y + 48), "Cedar Oil Relaxing Body Wash", font=f_title, fill=TEXT_DARK, anchor="mm")
    
    benefit_y = title_start_y + 48 + 38
    f_benefit = get_font(FONT_REG, 23)
    draw.text((WIDTH // 2, benefit_y), "Plant-based cleansers & moisturizers • 92% natural", font=f_benefit, fill=TEXT_MUTED, anchor="mm")
    
    # -------------------------------------------------------------
    # 4. OFFER POP RECTANGLE (Exact same primary color + gold trim!)
    # -------------------------------------------------------------
    p_badge_w = 560
    p_badge_h = 114
    p_badge_x = (WIDTH - p_badge_w) // 2
    p_badge_y = benefit_y + 30
    
    draw.rounded_rectangle([p_badge_x, p_badge_y, p_badge_x + p_badge_w, p_badge_y + p_badge_h], radius=22, fill=primary_color, outline=accent_color, width=4)
    
    draw.text((WIDTH // 2, p_badge_y + 28), "SPECIAL OFFER PRICE", font=get_font(FONT_BOLD, 15), fill=accent_color, anchor="mm")
    
    f_price = get_font(FONT_BOLD, 64)
    draw.text((WIDTH // 2, p_badge_y + 76), "KES 1,850", font=f_price, fill=WHITE, anchor="mm")
    
    # -------------------------------------------------------------
    # 5. FOOTER (Exact same primary color as header! Zero clashing!)
    # -------------------------------------------------------------
    footer_h = 295
    footer_y = HEIGHT - footer_h
    draw.rectangle([0, footer_y, WIDTH, HEIGHT], fill=primary_color)
    draw.rectangle([0, footer_y, WIDTH, footer_y + 6], fill=accent_color)
    
    draw.text((WIDTH // 2, footer_y + 48), "TO INQUIRE OR ORDER ON WHATSAPP:", font=get_font(FONT_BOLD, 20), fill=accent_color, anchor="mm")
    
    f_wa = get_font(FONT_BOLD, 56)
    draw.text((WIDTH // 2, footer_y + 115), "WhatsApp: +254 728 222 211", font=f_wa, fill=WHITE, anchor="mm")
    
    draw.text((WIDTH // 2, footer_y + 175), "Screenshot this post to order • Countrywide Delivery", font=get_font(FONT_REG, 19), fill=(203, 213, 225), anchor="mm")
    
    # M-Pesa is a refined pill matching the primary & gold palette
    mp_w = 720
    mp_h = 44
    mp_x = (WIDTH - mp_w) // 2
    mp_y = footer_y + 215
    draw.rounded_rectangle([mp_x, mp_y, mp_x + mp_w, mp_y + mp_h], radius=12, fill=primary_color, outline=accent_color, width=2)
    draw.text((WIDTH // 2, mp_y + 22), "Lipa na M-Pesa Buy Goods Till: 582910 • Same-Day Dispatch", font=get_font(FONT_BOLD, 16), fill=WHITE, anchor="mm")
    
    img.save(output_path, "PNG")
    print(f"[OK] Saved {style_name} to: {output_path}")

if __name__ == "__main__":
    # Option A: Deep Emerald & Champagne Gold (2-color unified brand)
    render_unified((6, 78, 59), (245, 158, 11), OUTPUT_A, "Unified Emerald & Gold")
    # Option B: Luxury Minimalist Slate & Champagne Gold (2-color ultra-clean)
    render_unified((15, 23, 42), (217, 119, 6), OUTPUT_B, "Luxury Slate & Gold")
