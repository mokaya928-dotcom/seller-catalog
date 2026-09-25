import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WORKSPACE = r"I:\ALL THE WEBSITES\seller"
IMAGE_PATH = os.path.join(WORKSPACE, "image.png")
OUTPUT_PORTRAIT = os.path.join(WORKSPACE, "retail_price_tag_portrait.png")
OUTPUT_SHELF = os.path.join(WORKSPACE, "retail_shelf_strip_horizontal.png")

ARTIFACT_DIR = r"C:\Users\laure\.gemini\antigravity-cli\brain\02d79c3e-2f0f-4358-96e4-89d31bce1884"
ARTIFACT_PORTRAIT = os.path.join(ARTIFACT_DIR, "retail_price_tag_portrait.png")
ARTIFACT_SHELF = os.path.join(ARTIFACT_DIR, "retail_shelf_strip_horizontal.png")

# Palette strictly derived from the product
TEAL = (46, 143, 132)          # #2E8F84
TEAL_LIGHT = (76, 185, 172)    # Subtle highlight
TEAL_DARK = (24, 88, 80)       # Deep teal pill bg
SLATE_TOP = (72, 75, 78)       # #484B4E
SLATE_BOTTOM = (44, 47, 50)    # #2C2F32
COPPER = (196, 96, 47)         # #C4602F
COPPER_BRIGHT = (220, 118, 55) # Metallic copper sheen
GOLD = (233, 181, 147)         # #E9B593
GOLD_RICH = (224, 175, 136)
OFF_WHITE = (247, 247, 247)    # #F7F7F7
WHITE = (255, 255, 255)
LIGHT_GREY = (203, 213, 225)   # #CBD5E1
MUTED_SLATE = (145, 155, 165)

FONTS_DIR = r"C:\Windows\Fonts"
FONT_GEORGIA_BOLD = os.path.join(FONTS_DIR, "georgiab.ttf")
FONT_GEORGIA_REG = os.path.join(FONTS_DIR, "georgia.ttf")
FONT_SEGOE_BOLD = os.path.join(FONTS_DIR, "segoeuib.ttf")
FONT_SEGOE_REG = os.path.join(FONTS_DIR, "segoeui.ttf")
FONT_SEGOE_SEMIBOLD = os.path.join(FONTS_DIR, "seguisb.ttf")

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def create_horizontal_gradient(width, height, c_left, c_mid, c_right=None):
    if c_right is None:
        c_right = c_left
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    mid_x = width // 2
    for x in range(width):
        if x <= mid_x:
            fac = x / float(mid_x) if mid_x > 0 else 0
            r = int(c_left[0] + (c_mid[0] - c_left[0]) * fac)
            g = int(c_left[1] + (c_mid[1] - c_left[1]) * fac)
            b = int(c_left[2] + (c_mid[2] - c_left[2]) * fac)
        else:
            fac = (x - mid_x) / float(width - mid_x) if width > mid_x else 0
            r = int(c_mid[0] + (c_right[0] - c_mid[0]) * fac)
            g = int(c_mid[1] + (c_right[1] - c_mid[1]) * fac)
            b = int(c_mid[2] + (c_right[2] - c_mid[2]) * fac)
        draw.line([(x, 0), (x, height)], fill=(r, g, b, 255))
    return img

def create_vertical_gradient(width, height, c_top, c_bottom):
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for y in range(height):
        fac = y / float(height - 1) if height > 1 else 0
        r = int(c_top[0] + (c_bottom[0] - c_top[0]) * fac)
        g = int(c_top[1] + (c_bottom[1] - c_top[1]) * fac)
        b = int(c_top[2] + (c_bottom[2] - c_top[2]) * fac)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
    return img

def extract_bottle():
    """Extract bottle from image.png cleanly without altering the product"""
    orig = Image.open(IMAGE_PATH).convert("RGBA")
    w, h = orig.size
    pix = orig.load()
    mask = Image.new("L", (w, h), 255)
    mask_pix = mask.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = pix[x, y]
            diff = max(abs(r - 247), abs(g - 247), abs(b - 247))
            if diff <= 3:
                mask_pix[x, y] = 0
            elif diff <= 9:
                mask_pix[x, y] = int(((diff - 3) / 6.0) * 255)
            else:
                mask_pix[x, y] = 255
    orig.putalpha(mask)
    return orig

def draw_pill_badge_clean(target_img, x, y, text, font_obj, bg_color=COPPER, border_color=GOLD, text_color=WHITE, pad_x=22, pad_y=8, letter_spacing=2):
    """Draws a premium rounded pill badge with clean centered typography and subtle drop shadow"""
    chars = list(text)
    char_widths = []
    total_w = 0
    for c in chars:
        bbox = font_obj.getbbox(c)
        cw = bbox[2] - bbox[0]
        char_widths.append(cw)
        total_w += cw
    total_w += letter_spacing * (len(chars) - 1)
    
    bbox_all = font_obj.getbbox(text)
    text_h = bbox_all[3] - bbox_all[1]
    
    badge_w = total_w + pad_x * 2
    badge_h = text_h + pad_y * 2
    radius = badge_h // 2
    
    # Soft drop shadow
    shadow_img = Image.new("RGBA", (badge_w + 12, badge_h + 12), (0, 0, 0, 0))
    ImageDraw.Draw(shadow_img).rounded_rectangle([4, 6, badge_w + 3, badge_h + 5], radius=radius, fill=(0, 0, 0, 45))
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(3))
    target_img.alpha_composite(shadow_img, (x - 4, y - 4))
    
    pill = Image.new("RGBA", (badge_w, badge_h), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(pill)
    
    # Base rounded rect
    pdraw.rounded_rectangle([0, 0, badge_w - 1, badge_h - 1], radius=radius, fill=bg_color, outline=border_color, width=2)
    
    # Centered letter-spaced text
    cur_x = pad_x
    ty = (badge_h - text_h) // 2 - bbox_all[1]
    for i, c in enumerate(chars):
        pdraw.text((cur_x, ty), c, font=font_obj, fill=text_color)
        cur_x += char_widths[i] + letter_spacing
        
    target_img.alpha_composite(pill, (x, y))
    return badge_w, badge_h

def draw_barcode_clean(draw, x, y, width, height, color):
    """Draws realistic retail barcode"""
    pattern = [2, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 2, 4, 2, 1, 3, 1, 2, 1, 4, 2, 3, 1, 2]
    cur_x = x
    i = 0
    while cur_x < x + width - 6:
        bar_w = pattern[i % len(pattern)]
        draw.rectangle([cur_x, y, cur_x + bar_w - 1, y + height], fill=color)
        space_w = pattern[(i + 1) % len(pattern)]
        cur_x += bar_w + space_w
        i += 2

# =========================================================================
# 1. PORTRAIT RETAIL PRICE TAG (3:4 RATIO - 1200 x 1600)
# =========================================================================
def render_portrait_tag():
    print("Rendering Portrait Price Tag (1200 x 1600)...")
    WIDTH = 1200
    HEIGHT = 1600
    TAG_RADIUS = 44
    
    tag = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    card_mask = Image.new("L", (WIDTH, HEIGHT), 0)
    ImageDraw.Draw(card_mask).rounded_rectangle([0, 0, WIDTH - 1, HEIGHT - 1], radius=TAG_RADIUS, fill=255)
    
    # -------------------------------------------------------------
    # HERO PRODUCT AREA: Height ~60% = 960px
    # Background: #F7F7F7 with subtle radial glow and soft shadow
    # -------------------------------------------------------------
    hero_h = 960
    hero_layer = Image.new("RGBA", (WIDTH, hero_h), OFF_WHITE + (255,))
    
    # Radial Glow behind bottle
    glow = Image.new("RGBA", (WIDTH, hero_h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gcx = WIDTH // 2
    gcy = 510
    for r in range(410, 0, -5):
        alpha = int(90 * (1.0 - (r / 410.0) ** 1.35))
        gdraw.ellipse([gcx - r, gcy - int(r * 0.95), gcx + r, gcy + int(r * 0.95)], fill=(255, 255, 255, alpha))
    hero_layer.alpha_composite(glow)
    
    # Contact Shadow under bottle base
    shadow = Image.new("RGBA", (WIDTH, hero_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    scx = WIDTH // 2
    scy = 905
    for rx in range(175, 0, -4):
        frac = 1.0 - (rx / 175.0)
        ry = int(24 * (rx / 175.0))
        sdraw.ellipse([scx - rx, scy - ry, scx + rx, scy + ry], fill=(35, 40, 45, int(120 * frac)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    hero_layer.alpha_composite(shadow)
    
    # Product Bottle Hero (Clean, completely unaltered)
    bottle = extract_bottle()
    bottle_h = 760
    scale = bottle_h / float(bottle.height)
    bottle_w = int(bottle.width * scale)
    bottle_resized = bottle.resize((bottle_w, bottle_h), Image.Resampling.LANCZOS)
    
    bx = (WIDTH - bottle_w) // 2
    by = 150
    hero_layer.alpha_composite(bottle_resized, (bx, by))
    
    # Small Copper "Relax" pill badge at top right
    f_relax = get_font(FONT_SEGOE_BOLD, 22)
    draw_pill_badge_clean(hero_layer, WIDTH - 220, 135, "RELAX", f_relax, bg_color=COPPER, border_color=GOLD, text_color=WHITE, pad_x=26, pad_y=8, letter_spacing=3)
    
    # Hang Tag Punch Hole at Top Center
    hole_cx = WIDTH // 2
    hole_cy = 65
    hole_r = 18
    grommet_r = 28
    
    grommet = Image.new("RGBA", (WIDTH, hero_h), (0, 0, 0, 0))
    grommet_draw = ImageDraw.Draw(grommet)
    # Metallic grommet ring
    grommet_draw.ellipse([hole_cx - grommet_r, hole_cy - grommet_r, hole_cx + grommet_r, hole_cy + grommet_r], fill=GOLD, outline=COPPER, width=2)
    # Inner rim
    grommet_draw.ellipse([hole_cx - hole_r - 2, hole_cy - hole_r - 2, hole_cx + hole_r + 2, hole_cy + hole_r + 2], fill=COPPER_BRIGHT)
    # Inner cut
    grommet_draw.ellipse([hole_cx - hole_r, hole_cy - hole_r, hole_cx + hole_r, hole_cy + hole_r], fill=(230, 230, 230, 255), outline=(150, 150, 150, 200), width=1)
    
    hero_layer.alpha_composite(grommet)
    tag.paste(hero_layer, (0, 0))
    
    # -------------------------------------------------------------
    # INFO PANEL: Y: 960 -> 1460 (height: 500px)
    # Dark Slate Panel (#484B4E to #2C2F32 gradient)
    # Thin copper-to-gold line across top edge (#C4602F to #E9B593)
    # -------------------------------------------------------------
    panel_y = 960
    panel_h = 500
    slate_panel = create_vertical_gradient(WIDTH, panel_h, SLATE_TOP, SLATE_BOTTOM)
    pdraw = ImageDraw.Draw(slate_panel)
    
    # Top edge: Thin copper-to-gold metallic line (#C4602F to #E9B593)
    top_line = create_horizontal_gradient(WIDTH, 4, COPPER, GOLD, COPPER)
    slate_panel.alpha_composite(top_line, (0, 0))
    
    # 1. Product Name in bold serif type, white
    f_title = get_font(FONT_GEORGIA_BOLD, 52)
    pdraw.text((80, 52), "Dove Men+Care Relax", font=f_title, fill=WHITE)
    
    # 2. One short descriptor line in light grey
    f_desc = get_font(FONT_SEGOE_REG, 26)
    pdraw.text((80, 122), "Eucalyptus + Cedar Oil Body Wash", font=f_desc, fill=LIGHT_GREY)
    
    # 3. Thin gold divider
    gold_divider = create_horizontal_gradient(WIDTH - 160, 2, COPPER, GOLD, COPPER)
    slate_panel.alpha_composite(gold_divider, (80, 185))
    
    # 4. Price & Size
    # Price in very large heavy serif font: KES 1,850
    # Size on the right in gold: 769 ml
    f_kes = get_font(FONT_GEORGIA_BOLD, 36)
    f_price = get_font(FONT_GEORGIA_BOLD, 102)
    f_size = get_font(FONT_GEORGIA_BOLD, 42)
    f_size_sub = get_font(FONT_SEGOE_REG, 20)
    
    price_y = 236
    
    # Gold "KES"
    kes_text = "KES"
    pdraw.text((80, price_y + 46), kes_text, font=f_kes, fill=GOLD)
    kes_bbox = f_kes.getbbox(kes_text)
    kes_w = kes_bbox[2] - kes_bbox[0]
    
    # Price "1,850" in huge bold serif white
    price_text = "1,850"
    pdraw.text((80 + kes_w + 16, price_y), price_text, font=f_price, fill=WHITE)
    
    # Size on the right in gold
    size_text = "769 ml"
    size_bbox = f_size.getbbox(size_text)
    size_w = size_bbox[2] - size_bbox[0]
    size_x = WIDTH - 80 - size_w
    pdraw.text((size_x, price_y + 30), size_text, font=f_size, fill=GOLD)
    
    sub_size = "26 U.S. FL. OZ."
    sub_bbox = f_size_sub.getbbox(sub_size)
    sub_w = sub_bbox[2] - sub_bbox[0]
    pdraw.text((WIDTH - 80 - sub_w, price_y + 82), sub_size, font=f_size_sub, fill=LIGHT_GREY)
    
    # Micro Retail Metadata & Barcode stamp
    f_sku = get_font(FONT_SEGOE_REG, 15)
    pdraw.text((80, 420), "SKU: DVN-769-RLX • VERIFIED AUTHENTIC IMPORT", font=f_sku, fill=MUTED_SLATE)
    draw_barcode_clean(pdraw, WIDTH - 280, 412, 200, 34, (120, 130, 140))
    
    tag.alpha_composite(slate_panel, (0, panel_y))
    
    # -------------------------------------------------------------
    # FOOTER: Y: 1460 -> 1600 (height: 140px)
    # Teal (#2E8F84) footer strip with two short highlights
    # "Vitamin and mineral complex" on left, "92% natural" on right
    # -------------------------------------------------------------
    footer_y = 1460
    footer_h = 140
    footer = Image.new("RGBA", (WIDTH, footer_h), TEAL + (255,))
    fdraw = ImageDraw.Draw(footer)
    
    # Top subtle highlight rim
    fdraw.line([(0, 0), (WIDTH, 0)], fill=TEAL_LIGHT + (255,), width=2)
    
    f_foot = get_font(FONT_SEGOE_BOLD, 26)
    
    # Left highlight
    hl_left = "•  Vitamin & mineral complex"
    fdraw.text((80, 52), hl_left, font=f_foot, fill=WHITE)
    
    # Right highlight
    hl_right = "92% natural  •"
    hl_r_bbox = f_foot.getbbox(hl_right)
    hl_r_w = hl_r_bbox[2] - hl_r_bbox[0]
    fdraw.text((WIDTH - 80 - hl_r_w, 52), hl_right, font=f_foot, fill=WHITE)
    
    tag.alpha_composite(footer, (0, footer_y))
    
    # Die-cut mask
    final = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    final.paste(tag, (0, 0), mask=card_mask)
    ImageDraw.Draw(final).rounded_rectangle([0, 0, WIDTH - 1, HEIGHT - 1], radius=TAG_RADIUS, outline=(170, 175, 180, 140), width=3)
    
    final.save(OUTPUT_PORTRAIT, "PNG")
    final.save(ARTIFACT_PORTRAIT, "PNG")
    print(f"[OK] Saved Portrait Tag to {OUTPUT_PORTRAIT}")


# =========================================================================
# 2. SLIM HORIZONTAL SHELF STRIP VERSION (1800 x 420)
# =========================================================================
def render_shelf_strip():
    print("Rendering Slim Horizontal Shelf Strip (1800 x 420)...")
    WIDTH = 1800
    HEIGHT = 420
    STRIP_RADIUS = 20
    
    strip = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    strip_mask = Image.new("L", (WIDTH, HEIGHT), 0)
    ImageDraw.Draw(strip_mask).rounded_rectangle([0, 0, WIDTH - 1, HEIGHT - 1], radius=STRIP_RADIUS, fill=255)
    
    # -------------------------------------------------------------
    # LEFT SECTION: Small bottle thumbnail (Width: 320px)
    # Off-white (#F7F7F7) background with subtle glow and shadow
    # -------------------------------------------------------------
    thumb_w = 320
    thumb_h = HEIGHT - 44
    thumb_layer = Image.new("RGBA", (thumb_w, thumb_h), OFF_WHITE + (255,))
    
    # Glow
    glow = Image.new("RGBA", (thumb_w, thumb_h), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gcx = thumb_w // 2
    gcy = thumb_h // 2 + 10
    for r in range(150, 0, -4):
        alpha = int(90 * (1.0 - (r / 150.0) ** 1.3))
        gdraw.ellipse([gcx - r, gcy - r, gcx + r, gcy + r], fill=(255, 255, 255, alpha))
    thumb_layer.alpha_composite(glow)
    
    # Shadow
    shadow = Image.new("RGBA", (thumb_w, thumb_h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.ellipse([gcx - 70, thumb_h - 32, gcx + 70, thumb_h - 10], fill=(35, 40, 45, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    thumb_layer.alpha_composite(shadow)
    
    # Small bottle thumbnail
    bottle = extract_bottle()
    thumb_h_target = 310
    scale = thumb_h_target / float(bottle.height)
    thumb_w_target = int(bottle.width * scale)
    thumb_bottle = bottle.resize((thumb_w_target, thumb_h_target), Image.Resampling.LANCZOS)
    
    bx = (thumb_w - thumb_w_target) // 2
    by = (thumb_h - thumb_h_target) // 2 - 4
    thumb_layer.alpha_composite(thumb_bottle, (bx, by))
    
    # Small Relax pill badge
    f_relax_sm = get_font(FONT_SEGOE_BOLD, 15)
    draw_pill_badge_clean(thumb_layer, thumb_w - 98, 16, "RELAX", f_relax_sm, bg_color=COPPER, border_color=GOLD, text_color=WHITE, pad_x=12, pad_y=4, letter_spacing=2)
    
    strip.paste(thumb_layer, (0, 0))
    
    # Vertical Copper-to-Gold divider
    v_line = create_vertical_gradient(3, thumb_h, COPPER, GOLD)
    strip.alpha_composite(v_line, (thumb_w - 2, 0))
    
    # -------------------------------------------------------------
    # MAIN SLATE INFO & PRICE SECTION (X: 320 -> 1800, Y: 0 -> 376)
    # Total width available inside slate = 1480px
    # Zone 1: Product Name, Descriptor, Highlights (X: 40 -> 640)
    # Divider 1 at X = 670
    # Zone 2: Price "KES 1,850" (X: 700 -> 1060)
    # Divider 2 at X = 1080
    # Zone 3: Size "769 ml" & Barcode (X: 1110 -> 1440)
    # -------------------------------------------------------------
    info_w = WIDTH - thumb_w
    info_h = thumb_h
    slate = create_vertical_gradient(info_w, info_h, SLATE_TOP, SLATE_BOTTOM)
    sdraw = ImageDraw.Draw(slate)
    
    # Top edge: copper-to-gold metallic line
    top_line = create_horizontal_gradient(info_w, 4, COPPER, GOLD, COPPER)
    slate.alpha_composite(top_line, (0, 0))
    
    # Zone 1: Product Details
    f_title = get_font(FONT_GEORGIA_BOLD, 38)
    sdraw.text((45, 42), "Dove Men+Care Relax", font=f_title, fill=WHITE)
    
    f_desc = get_font(FONT_SEGOE_REG, 22)
    sdraw.text((45, 98), "Eucalyptus + Cedar Oil Body Wash", font=f_desc, fill=LIGHT_GREY)
    
    # Mini gold divider
    h_div = create_horizontal_gradient(580, 2, COPPER, GOLD, COPPER)
    slate.alpha_composite(h_div, (45, 144))
    
    # Highlight pills
    f_feat = get_font(FONT_SEGOE_BOLD, 15)
    draw_pill_badge_clean(slate, 45, 168, "• Vitamin & Mineral Complex", f_feat, bg_color=TEAL_DARK, border_color=TEAL, pad_x=14, pad_y=6, letter_spacing=1)
    draw_pill_badge_clean(slate, 335, 168, "• 92% Naturally Derived", f_feat, bg_color=TEAL_DARK, border_color=TEAL, pad_x=14, pad_y=6, letter_spacing=1)
    
    f_meta = get_font(FONT_SEGOE_REG, 13)
    sdraw.text((45, 235), "PREMIUM RETAIL SHELF FIXTURE COMPLIANT • 38mm STANDARD", font=f_meta, fill=MUTED_SLATE)
    
    # Divider 1 (between product details & price)
    sdraw.line([(660, 30), (660, info_h - 30)], fill=(80, 85, 90, 160), width=1)
    
    # Zone 2: Price Block
    f_kes = get_font(FONT_GEORGIA_BOLD, 30)
    f_price = get_font(FONT_GEORGIA_BOLD, 92)
    
    price_x = 700
    price_y = 65
    
    # Gold "KES"
    sdraw.text((price_x, price_y + 44), "KES", font=f_kes, fill=GOLD)
    kes_bbox = f_kes.getbbox("KES")
    kes_w = kes_bbox[2] - kes_bbox[0]
    
    # "1,850" in huge bold serif
    sdraw.text((price_x + kes_w + 14, price_y), "1,850", font=f_price, fill=WHITE)
    
    # Divider 2 (between price & size/barcode)
    sdraw.line([(1060, 30), (1060, info_h - 30)], fill=(80, 85, 90, 160), width=1)
    
    # Zone 3: Size & Barcode Block (Clean, spacious, zero overlap!)
    f_size = get_font(FONT_GEORGIA_BOLD, 38)
    f_size_sub = get_font(FONT_SEGOE_REG, 18)
    
    size_x = 1100
    sdraw.text((size_x, 56), "769 ml", font=f_size, fill=GOLD)
    sdraw.text((size_x, 104), "26 U.S. FL. OZ.", font=f_size_sub, fill=LIGHT_GREY)
    
    # Barcode on far right
    draw_barcode_clean(sdraw, 1280, 52, 130, 78, (125, 135, 145))
    sdraw.text((1280, 140), "SKU: DVN-769-RLX", font=get_font(FONT_SEGOE_REG, 13), fill=MUTED_SLATE)
    
    strip.alpha_composite(slate, (thumb_w, 0))
    
    # -------------------------------------------------------------
    # CONTINUOUS BOTTOM TEAL FOOTER STRIP (Height: 44px)
    # -------------------------------------------------------------
    footer_h = 44
    footer_y = HEIGHT - footer_h
    footer = Image.new("RGBA", (WIDTH, footer_h), TEAL + (255,))
    ft_draw = ImageDraw.Draw(footer)
    ft_draw.line([(0, 0), (WIDTH, 0)], fill=TEAL_LIGHT + (255,), width=2)
    
    f_foot = get_font(FONT_SEGOE_BOLD, 17)
    ft_draw.text((40, 12), "• PREMIUM RETAIL SHELF STRIP", font=f_foot, fill=WHITE)
    ft_draw.text((560, 12), "• PLANT-BASED CLEANSER & MOISTURIZERS", font=f_foot, fill=(225, 245, 240))
    ft_draw.text((1200, 12), "• VERIFIED BOTANICAL INGREDIENTS •", font=f_foot, fill=WHITE)
    
    strip.alpha_composite(footer, (0, footer_y))
    
    # Mask & Border
    final = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    final.paste(strip, (0, 0), mask=strip_mask)
    ImageDraw.Draw(final).rounded_rectangle([0, 0, WIDTH - 1, HEIGHT - 1], radius=STRIP_RADIUS, outline=(150, 155, 160, 150), width=2)
    
    final.save(OUTPUT_SHELF, "PNG")
    final.save(ARTIFACT_SHELF, "PNG")
    print(f"[OK] Saved Shelf Strip to {OUTPUT_SHELF}")

if __name__ == "__main__":
    render_portrait_tag()
    render_shelf_strip()
    print("All renders completed successfully!")
