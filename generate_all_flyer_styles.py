"""
Generates visual samples for all 4 flyer styles:
1. Flash Sales (flash_sale)
2. Customer Reviews (customer_reviews)
3. Product Bundles (product_bundles)
4. Restock Alerts (restock_alerts)
"""

import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WORKSPACE = r"I:\ALL THE WEBSITES\seller"
IMG_SOURCE = os.path.join(WORKSPACE, "image.png")

# Palette: Emerald & Gold
EMERALD_DARK = (6, 78, 59)       # #064e3b
EMERALD_DEEP = (2, 44, 34)       # #022c22
GOLD_ACCENT = (245, 158, 11)     # #f59e0b
GOLD_LIGHT = (254, 240, 138)     # #fef08a
CRIMSON = (220, 38, 38)          # #dc2626
CANVAS_BG = (248, 250, 252)      # #f8fafc
BORDER_COLOR = (226, 232, 240)   # #e2e8f0
TEXT_DARK = (15, 23, 42)         # #0f172a
TEXT_MUTED = (71, 85, 105)       # #475569
WHITE = (255, 255, 255)

FONTS_DIR = r"C:\Windows\Fonts"
FONT_BOLD = os.path.join(FONTS_DIR, "segoeuib.ttf")
FONT_REG = os.path.join(FONTS_DIR, "segoeui.ttf")

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_round_rect(draw, box, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def get_product_bounds(pil_img):
    rgb = pil_img.convert("RGB")
    w, h = rgb.size
    corner = rgb.getpixel((0, 0))
    min_x, max_x = w, 0
    min_y, max_y = h, 0
    found = False
    step = 2
    for y in range(0, h, step):
        for x in range(0, w, step):
            p = rgb.getpixel((x, y))
            is_corner = max(abs(p[0] - corner[0]), abs(p[1] - corner[1]), abs(p[2] - corner[2])) < 16
            is_white = p[0] > 246 and p[1] > 246 and p[2] > 246
            if not is_corner and not is_white:
                found = True
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y
    if not found or (max_x - min_x < 30) or (max_y - min_y < 30):
        return (0, 0, w, h)
    pad_w = int((max_x - min_x) * 0.04)
    pad_h = int((max_y - min_y) * 0.04)
    return (max(0, min_x - pad_w), max(0, min_y - pad_h), min(w, max_x + pad_w), min(h, max_y + pad_h))

def render_sample(style_id, output_filename):
    W, H = 1080, 1920
    canvas = Image.new("RGBA", (W, H), CANVAS_BG)
    draw = ImageDraw.Draw(canvas)

    # Outer border
    draw.rectangle([7, 7, W - 7, H - 7], outline=BORDER_COLOR, width=14)

    # 1. Header
    header_h = 165
    draw.rectangle([0, 0, W, header_h], fill=EMERALD_DARK)
    draw.rectangle([0, 0, W, 8], fill=GOLD_ACCENT)
    draw.rectangle([0, header_h - 8, W, header_h], fill=GOLD_ACCENT)

    f_sub = get_font(FONT_BOLD, 18)
    f_shop = get_font(FONT_BOLD, 36)
    f_loc = get_font(FONT_REG, 17)

    header_subtitles = {
        'flash_sale': '⚡ 24-HOUR FLASH SALE • SPECIAL PRICE DROP ⚡',
        'customer_reviews': '✦ VERIFIED BUYER FAVORITE • 5-STAR RATED ✦',
        'product_bundles': '✦ 2-IN-1 ROUTINE COMBO • BUNDLE & SAVE ✦',
        'restock_alerts': '⚡ JUST RESTOCKED • FRESH SHIPMENT LANDED ⚡'
    }
    sub_text = header_subtitles.get(style_id, '✦ 100% AUTHENTIC • VERIFIED QUALITY ✦')

    draw.text((W // 2, 44), sub_text, fill=GOLD_ACCENT, font=f_sub, anchor="mm")
    draw.text((W // 2, 94), "THE BEAUTY BAR KENYA", fill=WHITE, font=f_shop, anchor="mm")
    draw.text((W // 2, 136), "Jamia Mall, Shop F47, Nairobi CBD • Same-Day Dispatch", fill=(226, 232, 240), font=f_loc, anchor="mm")

    # 2. Hero Card
    card_x, card_y = 60, header_h + 25
    card_w, card_h = 960, 1080
    corner_r = 26

    # Card shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    draw_round_rect(s_draw, [card_x, card_y + 8, card_x + card_w, card_y + card_h + 8], corner_r, fill=(0, 0, 0, 25))
    shadow = shadow.filter(ImageFilter.GaussianBlur(14))
    canvas = Image.alpha_composite(canvas, shadow)
    draw = ImageDraw.Draw(canvas)

    # Card background & border
    draw_round_rect(draw, [card_x, card_y, card_x + card_w, card_y + card_h], corner_r, fill=WHITE, outline=BORDER_COLOR, width=3)

    # Badges
    f_badge = get_font(FONT_BOLD, 15)

    # Top-Left Category Badge
    cat_text = "SKINCARE & FACE"
    cat_w = 200
    draw_round_rect(draw, [card_x + 22, card_y + 20, card_x + 22 + cat_w, card_y + 62], 12, fill=EMERALD_DARK)
    draw.text((card_x + 22 + cat_w // 2, card_y + 41), cat_text, fill=WHITE, font=f_badge, anchor="mm")

    # Top-Right Style Badge
    style_badges = {
        'flash_sale': ('🔥 FLASH SALE • TODAY ONLY', (220, 38, 38)),
        'customer_reviews': ('★★★★★ 4.9 RATING', (245, 158, 11)),
        'product_bundles': ('🎁 BUNDLE & SAVE', (16, 185, 129)),
        'restock_alerts': ('⚡ JUST RESTOCKED', (5, 150, 105))
    }
    badge_title, badge_color = style_badges.get(style_id, ('✦ AUTHENTIC', EMERALD_DARK))
    badge_w = 240
    badge_x = card_x + card_w - badge_w - 22
    draw_round_rect(draw, [badge_x, card_y + 20, badge_x + badge_w, card_y + 62], 12, fill=badge_color)
    draw.text((badge_x + badge_w // 2, card_y + 41), badge_title, fill=WHITE, font=f_badge, anchor="mm")

    # Load Hero Product Image
    if os.path.exists(IMG_SOURCE):
        src_img = Image.open(IMG_SOURCE).convert("RGBA")
        bx1, by1, bx2, by2 = get_product_bounds(src_img)
        cropped = src_img.crop((bx1, by1, bx2, by2))

        if style_id == 'product_bundles':
            # Dual Product Showcase: Main Product + Companion Product
            p_w = 380
            p_h = 750
            # Left product
            scale1 = min(p_w / cropped.width, p_h / cropped.height)
            cw1, ch1 = int(cropped.width * scale1), int(cropped.height * scale1)
            r1 = cropped.resize((cw1, ch1), Image.Resampling.LANCZOS)
            canvas.paste(r1, (card_x + 60 + (p_w - cw1) // 2, card_y + 90 + (p_h - ch1) // 2), r1)

            # Center PLUS icon
            plus_cx, plus_cy = card_x + card_w // 2, card_y + 465
            draw_round_rect(draw, [plus_cx - 26, plus_cy - 26, plus_cx + 26, plus_cy + 26], 26, fill=GOLD_ACCENT, outline=WHITE, width=3)
            draw.text((plus_cx, plus_cy), "+", fill=WHITE, font=get_font(FONT_BOLD, 34), anchor="mm")

            # Right companion product
            canvas.paste(r1, (card_x + card_w - 60 - p_w + (p_w - cw1) // 2, card_y + 90 + (p_h - ch1) // 2), r1)

            # Dual labels below images
            f_lbl = get_font(FONT_BOLD, 15)
            draw_round_rect(draw, [card_x + 80, card_y + 880, card_x + 420, card_y + 920], 10, fill=(241, 245, 249))
            draw.text((card_x + 250, card_y + 900), "1. Niacinamide 10% Serum", fill=TEXT_DARK, font=f_lbl, anchor="mm")

            draw_round_rect(draw, [card_x + card_w - 420, card_y + 880, card_x + card_w - 80, card_y + 920], 10, fill=(241, 245, 249))
            draw.text((card_x + card_w - 250, card_y + 900), "2. Hyaluronic Acid 2% + B5", fill=TEXT_DARK, font=f_lbl, anchor="mm")
        else:
            # Single hero image
            max_w, max_h = card_w - 70, card_h - 180
            scale = min(max_w / cropped.width, max_h / cropped.height)
            dw, dh = int(cropped.width * scale), int(cropped.height * scale)
            resized = cropped.resize((dw, dh), Image.Resampling.LANCZOS)
            canvas.paste(resized, (card_x + (card_w - dw) // 2, card_y + 80 + (max_h - dh) // 2), resized)

    # Style-specific Inset Banners on the Hero Card
    if style_id == 'flash_sale':
        # Urgency countdown bar at bottom of card
        draw_round_rect(draw, [card_x + 80, card_y + card_h - 75, card_x + card_w - 80, card_y + card_h - 25], 14, fill=(254, 242, 242), outline=(239, 68, 68), width=2)
        draw.text((card_x + card_w // 2, card_y + card_h - 50), "⏰ OFFER ENDS AT MIDNIGHT • LIMITED UNITS AT THIS PRICE", fill=CRIMSON, font=get_font(FONT_BOLD, 15), anchor="mm")

    elif style_id == 'customer_reviews':
        # Frosted Testimonial Quote Bubble
        q_box = [card_x + 40, card_y + card_h - 145, card_x + card_w - 40, card_y + card_h - 20]
        draw_round_rect(draw, q_box, 18, fill=(255, 255, 255, 245), outline=GOLD_ACCENT, width=2)
        draw.text((q_box[0] + 30, q_box[1] + 25), "“", fill=GOLD_ACCENT, font=get_font(FONT_BOLD, 46), anchor="mm")
        quote_txt = "“Cleared my dark spots in 2 weeks! Original product kabisa, 100% repurchasing.”"
        draw.text((q_box[0] + 65, q_box[1] + 35), quote_txt, fill=TEXT_DARK, font=get_font(FONT_BOLD, 18))
        draw.text((q_box[0] + 65, q_box[1] + 75), "— Stacy M., Kilimani • Verified Buyer ✓ (5/5 Stars)", fill=EMERALD_DARK, font=get_font(FONT_BOLD, 15))

    elif style_id == 'restock_alerts':
        # Scarcity Meter
        draw_round_rect(draw, [card_x + 80, card_y + card_h - 75, card_x + card_w - 80, card_y + card_h - 25], 14, fill=(254, 243, 199), outline=GOLD_ACCENT, width=2)
        draw.text((card_x + card_w // 2, card_y + card_h - 50), "⚠️ ONLY 4 PIECES REMAINING IN STOCK • SELLING FAST", fill=(180, 83, 9), font=get_font(FONT_BOLD, 16), anchor="mm")

    elif style_id == 'product_bundles':
        # Bundle savings ribbon
        draw_round_rect(draw, [card_x + 80, card_y + card_h - 75, card_x + card_w - 80, card_y + card_h - 25], 14, fill=(236, 253, 245), outline=(16, 185, 129), width=2)
        draw.text((card_x + card_w // 2, card_y + card_h - 50), "✨ 2-STEP COMPLETE ROUTINE FOR FASTER GLOW RESULTS", fill=EMERALD_DARK, font=get_font(FONT_BOLD, 15), anchor="mm")

    # 3. Product Title & Benefit
    title_y = card_y + card_h + 45
    f_title = get_font(FONT_BOLD, 38)
    f_ben = get_font(FONT_BOLD, 22)

    if style_id == 'product_bundles':
        draw.text((W // 2, title_y), "The Ordinary Niacinamide + HA 2% Combo", fill=TEXT_DARK, font=f_title, anchor="mm")
        draw.text((W // 2, title_y + 45), "✔ Perfect 2-Step Daily Glow Routine • Fades Spots & Hydrates", fill=TEXT_MUTED, font=f_ben, anchor="mm")
    elif style_id == 'customer_reviews':
        draw.text((W // 2, title_y), "The Ordinary Niacinamide 10% + Zinc 1%", fill=TEXT_DARK, font=f_title, anchor="mm")
        draw.text((W // 2, title_y + 45), "★★★★★ 120+ Verified 5-Star Reviews from Kenyan Shoppers", fill=(180, 83, 9), font=f_ben, anchor="mm")
    else:
        draw.text((W // 2, title_y), "The Ordinary Niacinamide 10% + Zinc 1%", fill=TEXT_DARK, font=f_title, anchor="mm")
        draw.text((W // 2, title_y + 45), "✔ Clears blemishes, fades dark spots & refines pores", fill=TEXT_MUTED, font=f_ben, anchor="mm")

    # 4. Dedicated Offer Pop Rectangle
    offer_w, offer_h = 620, 128
    offer_x = (W - offer_w) // 2
    offer_y = title_y + 75

    box_fill = (127, 29, 29) if style_id == 'flash_sale' else EMERALD_DARK
    box_border = GOLD_ACCENT

    draw_round_rect(draw, [offer_x, offer_y, offer_x + offer_w, offer_y + offer_h], 22, fill=box_fill, outline=box_border, width=4)

    f_off_sub = get_font(FONT_BOLD, 15)
    f_price = get_font(FONT_BOLD, 58)

    if style_id == 'flash_sale':
        draw.text((W // 2, offer_y + 28), "✦ FLASH DEAL PRICE • SAVE KES 550 ✦", fill=GOLD_LIGHT, font=f_off_sub, anchor="mm")
        # Strikethrough + Big Price
        draw.text((W // 2 - 120, offer_y + 80), "WAS ~2,450~", fill=(254, 202, 202), font=get_font(FONT_BOLD, 26), anchor="mm")
        draw.text((W // 2 + 100, offer_y + 80), "KES 1,900", fill=WHITE, font=f_price, anchor="mm")
    elif style_id == 'product_bundles':
        draw.text((W // 2, offer_y + 28), "✦ 2-IN-1 COMBO DEAL • SAVE KES 700 ✦", fill=GOLD_LIGHT, font=f_off_sub, anchor="mm")
        draw.text((W // 2, offer_y + 80), "KES 3,800 BUNDLE", fill=WHITE, font=get_font(FONT_BOLD, 52), anchor="mm")
    elif style_id == 'customer_reviews':
        draw.text((W // 2, offer_y + 28), "✦ TOP-RATED CUSTOMER FAVORITE • IN STOCK ✦", fill=GOLD_LIGHT, font=f_off_sub, anchor="mm")
        draw.text((W // 2, offer_y + 80), "KES 2,200", fill=WHITE, font=f_price, anchor="mm")
    elif style_id == 'restock_alerts':
        draw.text((W // 2, offer_y + 28), "✦ BACK BY POPULAR DEMAND • READY TO DISPATCH ✦", fill=GOLD_LIGHT, font=f_off_sub, anchor="mm")
        draw.text((W // 2, offer_y + 80), "KES 2,200", fill=WHITE, font=f_price, anchor="mm")

    # 5. Footer Panel
    footer_h = 300
    footer_y = H - footer_h
    draw.rectangle([0, footer_y, W, H], fill=EMERALD_DARK)
    draw.rectangle([0, footer_y, W, footer_y + 8], fill=GOLD_ACCENT)

    footer_ctas = {
        'flash_sale': '⚡ CLAIM THIS FLASH SALE DEAL ON WHATSAPP:',
        'customer_reviews': '⚡ TO ORDER THIS 5-STAR FAVORITE ON WHATSAPP:',
        'product_bundles': '⚡ CLAIM THIS 2-IN-1 BUNDLE ON WHATSAPP:',
        'restock_alerts': '⚡ GRAB YOURS BEFORE IT SELLS OUT AGAIN:'
    }
    cta_title = footer_ctas.get(style_id, '⚡ TO INQUIRE OR ORDER ON WHATSAPP:')

    draw.text((W // 2, footer_y + 48), cta_title, fill=GOLD_ACCENT, font=get_font(FONT_BOLD, 22), anchor="mm")
    draw.text((W // 2, footer_y + 116), "WhatsApp: 0728 222 211", fill=WHITE, font=get_font(FONT_BOLD, 58), anchor="mm")
    draw.text((W // 2, footer_y + 174), "Screenshot this post to order • Countrywide Delivery", fill=(203, 213, 225), font=get_font(FONT_REG, 20), anchor="mm")

    # M-Pesa Till Pill
    mpesa_w, mpesa_h = 760, 48
    mpesa_x = (W - mpesa_w) // 2
    mpesa_y = footer_y + 212
    draw_round_rect(draw, [mpesa_x, mpesa_y, mpesa_x + mpesa_w, mpesa_y + mpesa_h], 14, fill=EMERALD_DARK, outline=GOLD_ACCENT, width=2)
    draw.text((W // 2, mpesa_y + 24), "Lipa na M-Pesa Buy Goods Till: 582910 • Same-Day Dispatch", fill=WHITE, font=get_font(FONT_BOLD, 18), anchor="mm")

    out_path = os.path.join(WORKSPACE, output_filename)
    canvas.save(out_path, "PNG")
    print(f"Generated {out_path}")

if __name__ == "__main__":
    render_sample("flash_sale", "sample_flyer_flash_sale.png")
    render_sample("customer_reviews", "sample_flyer_customer_reviews.png")
    render_sample("product_bundles", "sample_flyer_product_bundles.png")
    render_sample("restock_alerts", "sample_flyer_restock_alerts.png")
