"""
Generates production-grade PWA and web app icons:
- public/icon-512.png (512x512)
- public/icon-192.png (192x192)
- public/icon-maskable-512.png (512x512 with safe-zone)
- public/icon-maskable-192.png (192x192 with safe-zone)
- public/apple-touch-icon.png (180x180)
- public/favicon-32x32.png (32x32)
- public/favicon-16x16.png (16x16)
- public/favicon.ico (Multi-size icon 16, 32, 48, 64)
- public/app-icon.svg (Scalable vector)
- public/favicon.svg (Vector favicon)
"""

import math
import os
from PIL import Image, ImageDraw, ImageFilter

WORKSPACE = r"I:\ALL THE WEBSITES\seller"
PUBLIC_DIR = os.path.join(WORKSPACE, "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)

# Color Palette: Deep Emerald & Radiant Gold
EMERALD_DARK = (2, 44, 34)       # #022c22
EMERALD_MID = (6, 78, 59)        # #064e3b
EMERALD_LIGHT = (5, 150, 105)    # #059669
EMERALD_BRIGHT = (16, 185, 129)  # #10b981

GOLD_LIGHT = (254, 240, 138)     # #fef08a
GOLD_MAIN = (245, 158, 11)       # #f59e0b
GOLD_DEEP = (180, 83, 9)         # #b45309
GOLD_WARM = (251, 191, 36)       # #fbbf24

WHITE = (255, 255, 255)

def create_svg_icon():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Gradients -->
    <radialGradient id="emeraldRadial" cx="50%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#047857" />
      <stop offset="55%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#022c22" />
    </radialGradient>
    
    <!-- Gold Foil Gradients -->
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="25%" stop-color="#fbbf24" />
      <stop offset="60%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>

    <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.8" />
    </linearGradient>

    <!-- Handle Gradient -->
    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="30%" stop-color="#fbbf24" />
      <stop offset="70%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.45" />
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#f59e0b" flood-opacity="0.3" />
    </filter>

    <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Base Rounded Background Container -->
  <rect width="512" height="512" rx="112" fill="url(#emeraldRadial)" />

  <!-- Subtle Luxury Gold Accent Border -->
  <rect x="14" y="14" width="484" height="484" rx="100" fill="none" stroke="url(#goldBorderGrad)" stroke-width="3" stroke-opacity="0.45" />

  <!-- Subtle Inner Geometric Pattern / Shimmer Arc -->
  <circle cx="256" cy="180" r="190" fill="none" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.12" stroke-dasharray="8 6" />

  <!-- Main Luxury Shopping Bag & Motif Group -->
  <g filter="url(#goldGlow)">
    <!-- Shopping Bag Handle -->
    <path d="M 196 185 C 196 115, 316 115, 316 185" fill="none" stroke="url(#handleGrad)" stroke-width="18" stroke-linecap="round" />
    
    <!-- Bag Handle Mount Anchors -->
    <circle cx="196" cy="185" r="9" fill="#fef08a" stroke="#b45309" stroke-width="3" />
    <circle cx="316" cy="185" r="9" fill="#fef08a" stroke="#b45309" stroke-width="3" />

    <!-- Shopping Bag Body (Crisp Trapezoid with Soft Beveled Corners) -->
    <path d="M 148 200 L 364 200 C 374 200, 381 209, 379 219 L 357 375 C 354 391, 340 404, 323 404 L 189 404 C 172 404, 158 391, 155 375 L 133 219 C 131 209, 138 200, 148 200 Z"
          fill="url(#goldGradient)" />

    <!-- Bag Fold Highlight Accent Line -->
    <path d="M 145 230 L 367 230" fill="none" stroke="#fef08a" stroke-width="3" stroke-opacity="0.6" />

    <!-- Center Monogram / Motif: "DP" / Luxury Emerald Star Crest -->
    <g transform="translate(256, 305)">
      <!-- Dark Emerald Inset Plaque -->
      <circle cx="0" cy="0" r="42" fill="#064e3b" stroke="#fef08a" stroke-width="3" />
      
      <!-- Crown / Diamond Sparkle inside Plaque -->
      <!-- Modern Sparkle / Star (Four-pointed) -->
      <path d="M 0 -26 C 2 -7, 7 -2, 26 0 C 7 2, 2 7, 0 26 C -2 7, -7 2, -26 0 C -7 -2, -2 -7, 0 -26 Z"
            fill="url(#goldGradient)" />
      <circle cx="0" cy="0" r="4" fill="#ffffff" />
    </g>
  </g>

  <!-- Radiant 4-Point Starburst (Top-Right of Bag) -->
  <g transform="translate(375, 150)" filter="url(#starGlow)">
    <path d="M 0 -38 C 3 -10, 10 -3, 38 0 C 10 3, 3 10, 0 38 C -3 10, -10 3, -38 0 C -10 -3, -3 -10, 0 -38 Z"
          fill="#ffffff" />
    <path d="M 0 -28 C 2 -7, 7 -2, 28 0 C 7 2, 2 7, 0 28 C -2 7, -7 2, -28 0 C -7 -2, -2 -7, 0 -28 Z"
          fill="url(#goldGradient)" />
    <circle cx="0" cy="0" r="5" fill="#ffffff" />
  </g>

  <!-- Secondary Tiny Accent Sparkle -->
  <g transform="translate(130, 290)">
    <path d="M 0 -16 C 1 -4, 4 -1, 16 0 C 4 1, 1 4, 0 16 C -1 4, -4 1, -16 0 C -4 -1, -1 -4, 0 -16 Z"
          fill="#fef08a" opacity="0.85" />
  </g>
</svg>"""
    return svg_content

def generate_all_icons():
    # Save SVG vector icons
    svg_data = create_svg_icon()
    svg_path = os.path.join(PUBLIC_DIR, "app-icon.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_data)
    print(f"Generated {svg_path}")

    favicon_svg_path = os.path.join(PUBLIC_DIR, "favicon.svg")
    with open(favicon_svg_path, "w", encoding="utf-8") as f:
        f.write(svg_data)
    print(f"Generated {favicon_svg_path}")

    # For ultra-crisp PNG rendering, we render directly using Pillow supersampling at 4x (2048x2048)
    def render_canvas(size=2048, is_maskable=False):
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Scale factor relative to 512 baseline
        scale = size / 512.0
        
        # When maskable, scale the inner artwork to fit safe-zone (80% circle, safe padding)
        art_scale = scale * 0.72 if is_maskable else scale
        art_offset_x = (size - 512 * art_scale) / 2
        art_offset_y = (size - 512 * art_scale) / 2

        # 1. Background
        if is_maskable:
            # Full bleed square background for maskable
            for y in range(size):
                t = y / size
                r = int(EMERALD_MID[0] * (1 - t) + EMERALD_DARK[0] * t)
                g = int(EMERALD_MID[1] * (1 - t) + EMERALD_DARK[1] * t)
                b = int(EMERALD_MID[2] * (1 - t) + EMERALD_DARK[2] * t)
                draw.line([(0, y), (size, y)], fill=(r, g, b, 255))
        else:
            # Rounded squircle background
            corner_r = int(112 * scale)
            # Create mask for rounded rectangle
            mask = Image.new("L", (size, size), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner_r, fill=255)

            # Gradient background inside mask
            grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
            grad_draw = ImageDraw.Draw(grad)
            center_x = size // 2
            center_y = int(size * 0.35)
            max_dist = size * 0.75
            for y in range(0, size, 2):
                for x in range(0, size, 2):
                    dist = math.hypot(x - center_x, y - center_y) / max_dist
                    dist = min(max(dist, 0.0), 1.0)
                    if dist < 0.4:
                        t = dist / 0.4
                        r = int(EMERALD_LIGHT[0] * (1 - t) + EMERALD_MID[0] * t)
                        g = int(EMERALD_LIGHT[1] * (1 - t) + EMERALD_MID[1] * t)
                        b = int(EMERALD_LIGHT[2] * (1 - t) + EMERALD_MID[2] * t)
                    else:
                        t = (dist - 0.4) / 0.6
                        r = int(EMERALD_MID[0] * (1 - t) + EMERALD_DARK[0] * t)
                        g = int(EMERALD_MID[1] * (1 - t) + EMERALD_DARK[1] * t)
                        b = int(EMERALD_MID[2] * (1 - t) + EMERALD_DARK[2] * t)
                    grad_draw.rectangle([x, y, x + 1, y + 1], fill=(r, g, b, 255))
            
            img.paste(grad, (0, 0), mask)

            # Elegant gold border
            border_r = int(100 * scale)
            border_offset = int(14 * scale)
            border_w = max(int(4 * scale), 2)
            draw.rounded_rectangle(
                [border_offset, border_offset, size - 1 - border_offset, size - 1 - border_offset],
                radius=border_r,
                outline=(245, 158, 11, 130),
                width=border_w
            )

        # 2. Draw Bag Motif
        def tx(x, y):
            return (art_offset_x + x * art_scale, art_offset_y + y * art_scale)

        # Handle arc
        handle_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        h_draw = ImageDraw.Draw(handle_layer)
        h_box = [
            art_offset_x + 196 * art_scale,
            art_offset_y + 115 * art_scale,
            art_offset_x + 316 * art_scale,
            art_offset_y + 245 * art_scale
        ]
        h_width = max(int(18 * art_scale), 3)
        h_draw.arc(h_box, start=180, end=0, fill=(251, 191, 36, 255), width=h_width)

        # Handle studs
        stud_r = int(9 * art_scale)
        s1 = tx(196, 185)
        s2 = tx(316, 185)
        h_draw.ellipse([s1[0] - stud_r, s1[1] - stud_r, s1[0] + stud_r, s1[1] + stud_r], fill=(254, 240, 138, 255), outline=(180, 83, 9, 255), width=int(2 * art_scale))
        h_draw.ellipse([s2[0] - stud_r, s2[1] - stud_r, s2[0] + stud_r, s2[1] + stud_r], fill=(254, 240, 138, 255), outline=(180, 83, 9, 255), width=int(2 * art_scale))

        # Bag Shadow
        shadow_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(shadow_layer)
        bag_poly = [
            tx(148, 200),
            tx(364, 200),
            tx(357, 380),
            tx(323, 404),
            tx(189, 404),
            tx(155, 380),
        ]
        s_poly = [(p[0], p[1] + int(14 * art_scale)) for p in bag_poly]
        s_draw.polygon(s_poly, fill=(0, 0, 0, 100))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=int(12 * art_scale)))

        img.alpha_composite(shadow_layer)
        img.alpha_composite(handle_layer)

        # Bag Body with Gold Gradient
        bag_mask = Image.new("L", (size, size), 0)
        bm_draw = ImageDraw.Draw(bag_mask)
        bm_draw.polygon(bag_poly, fill=255)

        bag_grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        bg_draw = ImageDraw.Draw(bag_grad)
        top_y = int(art_offset_y + 200 * art_scale)
        bot_y = int(art_offset_y + 404 * art_scale)
        height_span = max(bot_y - top_y, 1)

        for y in range(top_y, bot_y + 1):
            t = (y - top_y) / height_span
            r = int(GOLD_LIGHT[0] * (1 - t) * 0.4 + GOLD_MAIN[0] * (1 - t) * 0.6 + GOLD_DEEP[0] * t)
            g = int(GOLD_LIGHT[1] * (1 - t) * 0.4 + GOLD_MAIN[1] * (1 - t) * 0.6 + GOLD_DEEP[1] * t)
            b = int(GOLD_LIGHT[2] * (1 - t) * 0.4 + GOLD_MAIN[2] * (1 - t) * 0.6 + GOLD_DEEP[2] * t)
            bg_draw.line([(0, y), (size, y)], fill=(r, g, b, 255))

        # Fold Line Highlight
        fold_y = int(art_offset_y + 230 * art_scale)
        bg_draw.line([tx(145, 230), tx(367, 230)], fill=(254, 240, 138, 200), width=int(3 * art_scale))

        img.paste(bag_grad, (0, 0), bag_mask)

        # Center Emerald Plaque on Bag
        plaque_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        p_draw = ImageDraw.Draw(plaque_layer)
        pc = tx(256, 305)
        pr = int(42 * art_scale)
        p_draw.ellipse([pc[0] - pr, pc[1] - pr, pc[0] + pr, pc[1] + pr], fill=EMERALD_MID + (255,), outline=(254, 240, 138, 255), width=int(4 * art_scale))

        # 4-point Starburst inside Plaque
        def draw_star(draw_ctx, center, r_outer, r_inner, fill_color):
            cx, cy = center
            pts = []
            for i in range(8):
                angle = i * (math.pi / 4) - (math.pi / 2)
                rad = r_outer if i % 2 == 0 else r_inner
                pts.append((cx + rad * math.cos(angle), cy + rad * math.sin(angle)))
            draw_ctx.polygon(pts, fill=fill_color)

        draw_star(p_draw, pc, int(26 * art_scale), int(7 * art_scale), GOLD_WARM + (255,))
        # Center core dot
        dot_r = max(int(4 * art_scale), 1)
        p_draw.ellipse([pc[0] - dot_r, pc[1] - dot_r, pc[0] + dot_r, pc[1] + dot_r], fill=WHITE + (255,))

        img.alpha_composite(plaque_layer)

        # Top-Right Radiant Sparkle Star
        star_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        st_draw = ImageDraw.Draw(star_layer)
        sc = tx(375, 150)
        draw_star(st_draw, sc, int(38 * art_scale), int(10 * art_scale), WHITE + (255,))
        draw_star(st_draw, sc, int(28 * art_scale), int(7 * art_scale), GOLD_LIGHT + (255,))
        st_draw.ellipse([sc[0] - dot_r, sc[1] - dot_r, sc[0] + dot_r, sc[1] + dot_r], fill=WHITE + (255,))

        # Star Glow
        star_glow = star_layer.filter(ImageFilter.GaussianBlur(radius=int(6 * art_scale)))
        img.alpha_composite(star_glow)
        img.alpha_composite(star_layer)

        # Tiny accent sparkle on left
        acc_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        ac_draw = ImageDraw.Draw(acc_layer)
        ac = tx(130, 290)
        draw_star(ac_draw, ac, int(16 * art_scale), int(4 * art_scale), (254, 240, 138, 220))
        img.alpha_composite(acc_layer)

        return img

    print("Rendering high-res master icon (2048x2048)...")
    master_standard = render_canvas(2048, is_maskable=False)
    master_maskable = render_canvas(2048, is_maskable=True)

    # Export sizes
    sizes_standard = {
        "icon-512.png": 512,
        "icon-192.png": 192,
        "apple-touch-icon.png": 180,
        "favicon-32x32.png": 32,
        "favicon-16x16.png": 16,
    }

    for name, sz in sizes_standard.items():
        out_path = os.path.join(PUBLIC_DIR, name)
        resized = master_standard.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(out_path, "PNG", optimize=True)
        print(f"Generated {out_path} ({sz}x{sz})")

    # Maskable icons
    sizes_maskable = {
        "icon-maskable-512.png": 512,
        "icon-maskable-192.png": 192,
    }

    for name, sz in sizes_maskable.items():
        out_path = os.path.join(PUBLIC_DIR, name)
        resized = master_maskable.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(out_path, "PNG", optimize=True)
        print(f"Generated {out_path} ({sz}x{sz})")

    # Favicon.ico containing 16, 32, 48, 64
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    ico_images = [master_standard.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
    ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    ico_images[1].save(ico_path, format="ICO", sizes=ico_sizes)
    print(f"Generated {ico_path} multi-size ICO")

if __name__ == "__main__":
    generate_all_icons()
