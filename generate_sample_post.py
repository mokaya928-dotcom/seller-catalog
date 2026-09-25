"""
Renders the Unified Brand Post Template with:
- ONE large product card (the border shape rectangle that holds/clips the product, but LARGER)
- Clean, non-truncated 2-line title and benefit line below with clear spacing
- Dedicated High-Impact OFFER POP RECTANGLE (Gold-bordered dark pill where the offer pops!)
- Large WhatsApp footer at the bottom
- ZERO double giant rectangles!
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WORKSPACE = r"I:\ALL THE WEBSITES\seller"
IMAGE_PATH = os.path.join(WORKSPACE, "image.png")
OUTPUT_SAMPLE = os.path.join(WORKSPACE, "sample_unified_product_post.png")

BRAND_COLOR = (4, 120, 87)       # #047857
GOLD_ACCENT = (245, 158, 11)     # #F59E0B
DARK_SLATE = (15, 23, 42)        # #0F172A
CANVAS_BG = (248, 250, 252)      # #F8FAFC
BORDER_COLOR = (226, 232, 240)   # #E2E8F0
TEXT_DARK = (15, 23, 42)
TEXT_MUTED = (71, 85, 105)
EMERALD_TEXT = (4, 120, 87)
WHITE = (255, 255, 255)

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

def render_sample(badge_text=None, badge_color=None):
    WIDTH = 1080
    HEIGHT = 1920
    
    img = Image.new("RGBA", (WIDTH, HEIGHT), CANVAS_BG + (255,))
    draw = ImageDraw.Draw(img)
    
    # Outer canvas frame border
    draw.rectangle([7, 7, WIDTH - 8, HEIGHT - 8], outline=BORDER_COLOR, width=14)
    
    # -------------------------------------------------------------
    # 1. TOP HEADER BAR (170px)
    # -------------------------------------------------------------
    header_h = 170
    draw.rectangle([0, 0, WIDTH, header_h], fill=BRAND_COLOR)
    draw.rectangle([0, 0, WIDTH, 8], fill=GOLD_ACCENT)
    draw.rectangle([0, header_h - 8, WIDTH, header_h], fill=GOLD_ACCENT)
    
    draw.text((WIDTH // 2, 45), "✦ 100% AUTHENTIC • VERIFIED QUALITY ✦", font=get_font(FONT_BOLD, 20), fill=(209, 250, 229), anchor="mm")
    draw.text((WIDTH // 2, 98), "THE BEAUTY BAR KENYA", font=get_font(FONT_BOLD, 38), fill=WHITE, anchor="mm")
    draw.text((WIDTH // 2, 140), "Jamia Mall, Nairobi CBD • Countrywide Dispatch", font=get_font(FONT_REG, 18), fill=(167, 243, 208), anchor="mm")
    
    # -------------------------------------------------------------
    # 2. THE MAIN PRODUCT SHOWCASE CARD (THE SINGLE BORDER SHAPE RECTANGLE - LARGER!)
    # W: 960, H: 1080 (Fills ~65% of the card height, dominates post)
    # -------------------------------------------------------------
    box_x = 60
    box_w = 960
    box_y = header_h + 25 # Y: 195
    box_h = 1080          # Y: 195 -> 1275
    card_radius = 28
    
    # Drop shadow
    shadow_card = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ImageDraw.Draw(shadow_card).rounded_rectangle([box_x, box_y + 4, box_x + box_w, box_y + box_h + 6], radius=card_radius, fill=(0, 0, 0, 25))
    shadow_card = shadow_card.filter(ImageFilter.GaussianBlur(12))
    img.alpha_composite(shadow_card)
    
    # Card surface
    card = Image.new("RGBA", (box_w, box_h), WHITE + (255,))
    cdraw = ImageDraw.Draw(card)
    cdraw.rounded_rectangle([0, 0, box_w - 1, box_h - 1], radius=card_radius, fill=WHITE, outline=BORDER_COLOR, width=3)
    
    # Size / Authentic pill badge top-left
    cdraw.rounded_rectangle([24, 22, 184, 64], radius=12, fill=DARK_SLATE)
    cdraw.text((104, 43), "NET 769 ML", font=get_font(FONT_BOLD, 15), fill=WHITE, anchor="mm")
    
    # Rule 8: Promo badge top-right ONLY if turned on
    if badge_text and badge_color:
        cdraw.rounded_rectangle([box_w - 244, 22, box_w - 24, 64], radius=12, fill=badge_color)
        cdraw.text((box_w - 134, 43), badge_text, font=get_font(FONT_BOLD, 15), fill=WHITE, anchor="mm")
        
    # Hero Product Image - Auto-detected bounds so it fills ~80% to 85% of this large card!
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
    # 3. PRODUCT TITLE & BENEFIT (Clear spacing, wraps to 2 lines without "...")
    # -------------------------------------------------------------
    title_start_y = box_y + box_h + 40 # 1315px
    f_title = get_font(FONT_BOLD, 42)
    draw.text((WIDTH // 2, title_start_y), "Dove Men+Care Relax Eucalyptus +", font=f_title, fill=TEXT_DARK, anchor="mm")
    draw.text((WIDTH // 2, title_start_y + 48), "Cedar Oil Relaxing Body Wash", font=f_title, fill=TEXT_DARK, anchor="mm")
    
    benefit_y = title_start_y + 48 + 42 # 1405px
    f_benefit = get_font(FONT_BOLD, 23)
    draw.text((WIDTH // 2, benefit_y), "✔ Plant-based cleansers & moisturizers • 92% natural", font=f_benefit, fill=EMERALD_TEXT, anchor="mm")
    
    # -------------------------------------------------------------
    # 4. THE OFFER POP RECTANGLE (Rectangle design so the offer POPS!)
    # -------------------------------------------------------------
    p_badge_w = 560
    p_badge_h = 114
    p_badge_x = (WIDTH - p_badge_w) // 2
    p_badge_y = benefit_y + 34 # 1439px -> ends at 1553px
    
    # Glow & bold gold outline
    draw.rounded_rectangle([p_badge_x - 3, p_badge_y - 3, p_badge_x + p_badge_w + 3, p_badge_y + p_badge_h + 3], radius=24, fill=(245, 158, 11, 40))
    draw.rounded_rectangle([p_badge_x, p_badge_y, p_badge_x + p_badge_w, p_badge_y + p_badge_h], radius=22, fill=DARK_SLATE, outline=GOLD_ACCENT, width=4)
    
    # Inside Offer Badge
    draw.text((WIDTH // 2, p_badge_y + 28), "✦ SPECIAL OFFER PRICE • IN STOCK ✦", font=get_font(FONT_BOLD, 16), fill=GOLD_ACCENT, anchor="mm")
    
    f_price = get_font(FONT_BOLD, 64)
    draw.text((WIDTH // 2, p_badge_y + 76), "KES 1,850", font=f_price, fill=WHITE, anchor="mm")
    
    # -------------------------------------------------------------
    # 5. BOTTOM WHATSAPP FOOTER PANEL (Fills 1620 -> 1920)
    # -------------------------------------------------------------
    footer_h = 300
    footer_y = HEIGHT - footer_h # 1620px
    draw.rectangle([0, footer_y, WIDTH, HEIGHT], fill=DARK_SLATE)
    draw.rectangle([0, footer_y, WIDTH, footer_y + 10], fill=GOLD_ACCENT)
    
    draw.text((WIDTH // 2, footer_y + 52), "⚡ TO INQUIRE OR ORDER ON WHATSAPP:", font=get_font(FONT_BOLD, 22), fill=GOLD_ACCENT, anchor="mm")
    
    f_wa = get_font(FONT_BOLD, 58)
    draw.text((WIDTH // 2, footer_y + 125), "WhatsApp: +254 728 222 211", font=f_wa, fill=WHITE, anchor="mm")
    
    draw.text((WIDTH // 2, footer_y + 185), "Screenshot this post to order • Countrywide Delivery", font=get_font(FONT_REG, 20), fill=(148, 163, 184), anchor="mm")
    draw.text((WIDTH // 2, footer_y + 245), "🟢 Lipa na M-Pesa Buy Goods Till: 582910 • Same-Day Dispatch", font=get_font(FONT_BOLD, 19), fill=(52, 211, 153), anchor="mm")
    
    img.save(OUTPUT_SAMPLE, "PNG")
    print("[OK] Saved clean post: ONE large card + Offer POP rectangle!")

if __name__ == "__main__":
    render_sample("🔥 FLASH SALE", (220, 38, 38))
