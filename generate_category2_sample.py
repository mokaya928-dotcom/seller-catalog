"""
Renders a Category 2 (Household & Bedding) flyer to verify the unified architecture:
- Product: Heavy Fiber 4-Piece Duvet Bedding Set
- Size badge: 6X6 KING
- Category 2 dedicated layout & styling
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WORKSPACE = r"I:\ALL THE WEBSITES\seller"
IMAGE_PATH = os.path.join(WORKSPACE, "public", "products", "moh-duvet-set.jpg")
OUTPUT_SAMPLE = os.path.join(WORKSPACE, "sample_category2_household_post.png")

BRAND_COLOR = (4, 120, 87)       # #047857
GOLD_ACCENT = (245, 158, 11)     # #F59E0B
DARK_SLATE = (15, 23, 42)        # #0F172A
CANVAS_BG = (248, 250, 252)      # #F8FAFC
BORDER_COLOR = (226, 232, 240)   # #E2E8F0
TEXT_DARK = (15, 23, 42)
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

def render_category2():
    WIDTH = 1080
    HEIGHT = 1920
    
    img = Image.new("RGBA", (WIDTH, HEIGHT), CANVAS_BG + (255,))
    draw = ImageDraw.Draw(img)
    
    # Outer canvas frame border
    draw.rectangle([7, 7, WIDTH - 8, HEIGHT - 8], outline=BORDER_COLOR, width=14)
    
    # -------------------------------------------------------------
    # 1. TOP HEADER BAR
    # -------------------------------------------------------------
    header_h = 170
    draw.rectangle([0, 0, WIDTH, header_h], fill=BRAND_COLOR)
    draw.rectangle([0, 0, WIDTH, 8], fill=GOLD_ACCENT)
    draw.rectangle([0, header_h - 8, WIDTH, header_h], fill=GOLD_ACCENT)
    
    draw.text((WIDTH // 2, 45), "✦ CATEGORY 2 • HOUSEHOLD & BEDDING ✦", font=get_font(FONT_BOLD, 20), fill=(209, 250, 229), anchor="mm")
    draw.text((WIDTH // 2, 98), "THE BEAUTY BAR KENYA", font=get_font(FONT_BOLD, 38), fill=WHITE, anchor="mm")
    draw.text((WIDTH // 2, 140), "Owira's Luxury Home Collection • Countrywide Dispatch", font=get_font(FONT_REG, 18), fill=(167, 243, 208), anchor="mm")
    
    # -------------------------------------------------------------
    # 2. MAIN PRODUCT SHOWCASE CARD (ONE LARGE RECTANGLE)
    # -------------------------------------------------------------
    box_x = 60
    box_w = 960
    box_y = header_h + 25
    box_h = 1080
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
    
    # Size / Category pill badge top-left
    cdraw.rounded_rectangle([24, 22, 204, 64], radius=12, fill=DARK_SLATE)
    cdraw.text((114, 43), "NET 6X6 KING", font=get_font(FONT_BOLD, 15), fill=WHITE, anchor="mm")
    
    # Product Image
    duvet_img = Image.open(IMAGE_PATH).convert("RGBA")
    dw, dh = duvet_img.size
    scale = min((box_w - 60) / float(dw), (box_h - 100) / float(dh))
    scaled_w = int(dw * scale)
    scaled_h = int(dh * scale)
    duvet_scaled = duvet_img.resize((scaled_w, scaled_h), Image.Resampling.LANCZOS)
    
    bx = (box_w - scaled_w) // 2
    by = 15 + (box_h - 15 - scaled_h) // 2
    card.alpha_composite(duvet_scaled, (bx, by))
    
    img.alpha_composite(card, (box_x, box_y))
    
    # -------------------------------------------------------------
    # 3. PRODUCT TITLE & BENEFIT (Clean spacing, 2 lines max, no ellipsis)
    # -------------------------------------------------------------
    title_start_y = box_y + box_h + 40
    f_title = get_font(FONT_BOLD, 40)
    draw.text((WIDTH // 2, title_start_y), "Heavy Fiber 4-Piece Duvet Bedding", font=f_title, fill=TEXT_DARK, anchor="mm")
    draw.text((WIDTH // 2, title_start_y + 48), "Set (Warm 6x6 King Bed)", font=f_title, fill=TEXT_DARK, anchor="mm")
    
    benefit_y = title_start_y + 48 + 42
    f_benefit = get_font(FONT_BOLD, 22)
    draw.text((WIDTH // 2, benefit_y), "✔ Warm 400GSM micro-fiber duvet + bedsheet + 2 pillowcases", font=f_benefit, fill=EMERALD_TEXT, anchor="mm")
    
    # -------------------------------------------------------------
    # 4. OFFER POP RECTANGLE
    # -------------------------------------------------------------
    p_badge_w = 580
    p_badge_h = 114
    p_badge_x = (WIDTH - p_badge_w) // 2
    p_badge_y = benefit_y + 30
    
    draw.rounded_rectangle([p_badge_x - 3, p_badge_y - 3, p_badge_x + p_badge_w + 3, p_badge_y + p_badge_h + 3], radius=24, fill=(245, 158, 11, 40))
    draw.rounded_rectangle([p_badge_x, p_badge_y, p_badge_x + p_badge_w, p_badge_y + p_badge_h], radius=22, fill=DARK_SLATE, outline=GOLD_ACCENT, width=4)
    
    draw.text((WIDTH // 2, p_badge_y + 28), "✦ SPECIAL OFFER PRICE • IN STOCK ✦", font=get_font(FONT_BOLD, 16), fill=GOLD_ACCENT, anchor="mm")
    draw.text((WIDTH // 2, p_badge_y + 76), "KES 2,800", font=get_font(FONT_BOLD, 64), fill=WHITE, anchor="mm")
    
    # -------------------------------------------------------------
    # 5. BOTTOM WHATSAPP FOOTER PANEL
    # -------------------------------------------------------------
    footer_h = 300
    footer_y = HEIGHT - footer_h
    draw.rectangle([0, footer_y, WIDTH, HEIGHT], fill=DARK_SLATE)
    draw.rectangle([0, footer_y, WIDTH, footer_y + 10], fill=GOLD_ACCENT)
    
    draw.text((WIDTH // 2, footer_y + 52), "⚡ TO INQUIRE OR ORDER ON WHATSAPP:", font=get_font(FONT_BOLD, 22), fill=GOLD_ACCENT, anchor="mm")
    draw.text((WIDTH // 2, footer_y + 125), "WhatsApp: +254 728 222 211", font=get_font(FONT_BOLD, 58), fill=WHITE, anchor="mm")
    draw.text((WIDTH // 2, footer_y + 185), "Screenshot this post to order • Countrywide Delivery", font=get_font(FONT_REG, 20), fill=(148, 163, 184), anchor="mm")
    draw.text((WIDTH // 2, footer_y + 245), "🟢 Lipa na M-Pesa Buy Goods Till: 582910 • Same-Day Dispatch", font=get_font(FONT_BOLD, 19), fill=(52, 211, 153), anchor="mm")
    
    img.save(OUTPUT_SAMPLE, "PNG")
    print(f"[OK] Category 2 flyer rendered to: {OUTPUT_SAMPLE}")

if __name__ == "__main__":
    render_category2()
