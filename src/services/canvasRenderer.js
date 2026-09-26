/**
 * Production-Grade Master Canvas Renderer
 * 
 * High-Converting Commercial Flyer Templates for Kenyan WhatsApp Status & Groups:
 * 1. Brand Master ('unified_brand'): High-impact retail layout with category pill & offer container
 * 2. Flash Sales ('flash_sale'): High-urgency deal with strikethrough price, savings pill & countdown ribbon
 * 3. Customer Reviews ('customer_reviews'): Top customer rating, verified buyer quote bubble & social proof
 * 4. Product Bundles ('product_bundles'): 2-in-1 routine combo with side-by-side showcase & bundle discount
 * 5. Restock Alerts ('restock_alerts'): Fresh batch announcement with scarcity meter ("Only X left")
 * 
 * Design Standards:
 * - Clean, bold, authentic retail store typography (NO AI sparkle stars or emoji clutter).
 * - Full 1080x1920 (Status 9:16) and 1080x1350 (Group 4:5) canvas support without distortion.
 * - Product images auto-trimmed with bounds detection to fill card big and sharp.
 * - 2-color brand architecture: Option A (Emerald & Gold) vs Option B (Luxury Slate & Gold).
 * - Straight edges with rounded corners only. No slanted cuts.
 * - Titles wrap up to 2 lines cleanly without ellipsis "...".
 * - Price is prominently displayed in dedicated high-impact container.
 * - WhatsApp number & Lipa na M-Pesa till clearly stated in footer.
 */

function loadImage(src, timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);

    let targetSrc = src;
    const isHttp = typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'));
    const isSameOrigin = typeof window !== 'undefined' && isHttp && src.startsWith(window.location.origin);

    if (isHttp && !isSameOrigin && !src.includes('images.weserv.nl')) {
      targetSrc = `https://images.weserv.nl/?url=${encodeURIComponent(src)}`;
    }

    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        console.warn(`Image load timed out: ${src}`);
        resolve(null);
      }
    }, timeoutMs);

    const finish = (result) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(result);
      }
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => finish(img);

    img.onerror = () => {
      // If CORS proxy failed, attempt direct load as fallback
      if (targetSrc !== src && !settled) {
        const directImg = new Image();
        directImg.crossOrigin = 'anonymous';
        directImg.onload = () => finish(directImg);
        directImg.onerror = () => {
          console.warn(`Failed to load image: ${src}`);
          finish(null);
        };
        directImg.src = src;
        return;
      }
      console.warn(`Failed to load image at: ${src}`);
      finish(null);
    };

    img.src = targetSrc;
  });
}

/**
 * Robust image loader for canvas: Loads candidate photo,
 * and if unavailable falls back to alternate photos so the flyer never has an empty void.
 */
async function loadProductImage(product, primarySrc) {
  const candidate = primarySrc || product?.photo || product?.image_url;
  let img = await loadImage(candidate);
  if (img) return img;

  // Fallback 1: Try alternate photos in product.photos
  if (Array.isArray(product?.photos)) {
    for (const alt of product.photos) {
      if (alt && alt !== candidate) {
        img = await loadImage(alt);
        if (img) return img;
      }
    }
  }

  // Fallback 2: Try product.image_url
  if (product?.image_url && product.image_url !== candidate) {
    img = await loadImage(product.image_url);
    if (img) return img;
  }

  // Fallback 3: Reliable local fallback image
  return await loadImage('/products/bbk-vaseline-lip.jpg');
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x + radius, y);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Auto-detect actual product bounding box to trim excessive white/empty margins.
 */
function getProductBounds(img) {
  try {
    const canvas = document.createElement('canvas');
    const sampleW = Math.min(img.width, 320);
    const sampleH = Math.round((img.height * sampleW) / img.width);
    if (!sampleW || !sampleH) {
      return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };
    }

    canvas.width = sampleW;
    canvas.height = sampleH;
    const sCtx = canvas.getContext('2d');
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(img, 0, 0, sampleW, sampleH);

    const imgData = sCtx.getImageData(0, 0, sampleW, sampleH).data;

    const cornerR = imgData[0];
    const cornerG = imgData[1];
    const cornerB = imgData[2];

    let minX = sampleW, maxX = 0, minY = sampleH, maxY = 0;
    let nonBgCount = 0;

    for (let y = 0; y < sampleH; y++) {
      for (let x = 0; x < sampleW; x++) {
        const idx = (y * sampleW + x) * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        const a = imgData[idx + 3];

        if (a < 20) continue;

        const isCornerBg = (
          Math.abs(r - cornerR) < 18 &&
          Math.abs(g - cornerG) < 18 &&
          Math.abs(b - cornerB) < 18
        );
        const isWhiteBg = (r > 246 && g > 246 && b > 246);

        if (!isCornerBg && !isWhiteBg) {
          nonBgCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const contentW = maxX - minX;
    const contentH = maxY - minY;
    if (nonBgCount < 100 || contentW < 30 || contentH < 30) {
      return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };
    }

    const scaleX = img.width / sampleW;
    const scaleY = img.height / sampleH;
    const padW = Math.round(contentW * 0.04);
    const padH = Math.round(contentH * 0.04);

    const cropX = Math.max(0, Math.round((minX - padW) * scaleX));
    const cropY = Math.max(0, Math.round((minY - padH) * scaleY));
    const cropW = Math.min(img.width - cropX, Math.round((contentW + padW * 2) * scaleX));
    const cropH = Math.min(img.height - cropY, Math.round((contentH + padH * 2) * scaleY));

    return { sx: cropX, sy: cropY, sWidth: cropW, sHeight: cropH };
  } catch {
    return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };
  }
}

/**
 * Smart Title Wrapper that wraps to at most 2 lines without truncation.
 */
function drawWrappedTitleWithoutTruncation(ctx, text, centerX, startY, maxWidth, initialSize, minSize = 22) {
  const cleanText = String(text || '').trim();
  if (!cleanText) return { endY: startY, totalHeight: 0, fontSize: initialSize, linesCount: 0 };

  const fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  let fontSize = initialSize;
  let lines = [];
  const words = cleanText.split(/\s+/);

  while (fontSize >= minSize) {
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    if (lines.length <= 2) break;
    fontSize -= 2;
  }

  while (lines.length > 2 && fontSize > 14) {
    fontSize -= 2;
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
    lines = [];
    let currentLine = words[0] || '';
    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      if (ctx.measureText(testLine).width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
  }

  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.font = `900 ${fontSize}px ${fontFamily}`;

  const lineHeight = Math.round(fontSize * 1.25);
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });

  const totalHeight = lines.length * lineHeight;
  return {
    fontSize,
    linesCount: lines.length,
    totalHeight,
    endY: startY + (lines.length - 1) * lineHeight
  };
}

function drawStarburst(ctx, cx, cy, spikes, outerRadius, innerRadius, fillStyle, strokeStyle) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

export const POST_STYLES = [
  {
    id: 'unified_brand',
    name: 'Brand Master (Default)',
    tag: 'Flagship',
    badgeText: 'AUTHENTIC ORIGINAL',
    desc: 'Clean unified retail layout with category tag & offer pill',
    icon: 'ShieldCheck',
    accentColor: '#064e3b'
  },
  {
    id: 'luxury_editorial',
    name: 'Luxury Vogue Editorial',
    tag: 'High Fashion',
    badgeText: 'SIGNATURE EDIT',
    desc: 'Deep obsidian & champagne gold frame with luxury serif typography',
    icon: 'Sparkles',
    accentColor: '#d4af37'
  },
  {
    id: 'flash_sale',
    name: '24H Flash Sale',
    tag: 'Urgency',
    badgeText: 'FLASH SALE • TODAY ONLY',
    desc: 'High-urgency banner, strikethrough price & instant savings badge',
    icon: 'Flame',
    accentColor: '#ef4444'
  },
  {
    id: 'minimalist_clean',
    name: 'Studio Minimalist',
    tag: 'Clean Aesthetic',
    badgeText: 'STUDIO EDITION',
    desc: 'Airy white aesthetic, generous negative space & floating drop shadow',
    icon: 'Maximize2',
    accentColor: '#334155'
  },
  {
    id: 'neon_bold',
    name: 'Neon Streetwear Drop',
    tag: 'High Energy',
    badgeText: 'STREET DROP',
    desc: 'Jet black background with glowing electric neon & bold street typography',
    icon: 'Zap',
    accentColor: '#10b981'
  },
  {
    id: 'customer_reviews',
    name: 'Verified Customer Review',
    tag: 'Social Proof',
    badgeText: 'RATED 4.9 / 5.0',
    desc: '5-star gold rating bar, quote bubble & verified buyer social proof',
    icon: 'Star',
    accentColor: '#f59e0b'
  },
  {
    id: 'polaroid_snap',
    name: 'Polaroid Instant Snap',
    tag: 'Lifestyle',
    badgeText: 'DAILY PICK ✨',
    desc: 'Warm parchment Polaroid photo frame with handwritten lifestyle notes',
    icon: 'Camera',
    accentColor: '#b45309'
  },
  {
    id: 'restock_alerts',
    name: 'Fresh Restock Alert',
    tag: 'Scarcity',
    badgeText: 'JUST RESTOCKED',
    desc: 'Fresh shipment announcement with limited stock urgency meter',
    icon: 'PackageCheck',
    accentColor: '#0284c7'
  },
  {
    id: 'product_bundles',
    name: 'Routine Combo Bundle',
    tag: '2-in-1 Value',
    badgeText: 'BUNDLE & SAVE',
    desc: '2-in-1 combo routine pairing two items with package savings',
    icon: 'Layers',
    accentColor: '#8b5cf6'
  },
  {
    id: 'clearance_deal',
    name: 'Clearance Starburst Deal',
    tag: 'Hot Discount',
    badgeText: 'HOT DEAL • SAVE BIG',
    desc: 'Vibrant retail starburst clearance badge with maximum price contrast',
    icon: 'Tag',
    accentColor: '#dc2626'
  }
];

export const UNIFIED_PALETTES = {
  emerald: {
    id: 'emerald',
    name: 'Emerald & Gold',
    label: 'Option A: Emerald & Gold',
    primary: '#064e3b',        // Pure Deep Emerald
    accent: '#f59e0b',         // Warm Champagne Gold
    accentBorder: '#f59e0b',
    headerSubtext: '#fef3c7',
    locationText: '#e2e8f0',
    benefitText: '#475569',
    glow: 'rgba(245, 158, 11, 0.22)',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#064e3b',
    mpesaBorder: '#f59e0b',
    mpesaText: '#ffffff'
  },
  slate: {
    id: 'slate',
    name: 'Luxury Slate & Gold',
    label: 'Option B: Luxury Slate & Gold',
    primary: '#0f172a',        // Deep Onyx Slate
    accent: '#d97706',         // Warm Gold / Amber Accent
    accentBorder: '#d97706',
    headerSubtext: '#e2e8f0',
    locationText: '#94a3b8',
    benefitText: '#64748b',
    glow: 'rgba(217, 119, 6, 0.22)',
    footerSubtext: '#cbd5e1',
    mpesaBg: '#0f172a',
    mpesaBorder: '#d97706',
    mpesaText: '#ffffff'
  }
};

function resolvePalette(seller, override) {
  const key = override || (seller && seller.palette) || 'emerald';
  return UNIFIED_PALETTES[key] || UNIFIED_PALETTES.emerald;
}

function getCategorySizeText(product) {
  const isClothes = product.category && (
    product.category.toLowerCase().includes('clothes') ||
    product.category.toLowerCase().includes('clothing') ||
    product.category.toLowerCase().includes('fashion') ||
    product.category.toLowerCase().includes('dress')
  );
  const isHousehold = product.category && (
    product.category.toLowerCase().includes('household') ||
    product.category.toLowerCase().includes('bedding') ||
    product.category.toLowerCase().includes('kitchen')
  );

  if (product.sizes) return `SIZES: ${String(product.sizes).toUpperCase()}`;
  if (product.size) {
    if (isClothes) return `SIZE: ${String(product.size).toUpperCase()}`;
    if (isHousehold) return String(product.size).toUpperCase();
    return `NET ${String(product.size).toUpperCase()}`;
  }
  if (isClothes) return 'SIZES: S • M • L • XL';
  if (product.category) return String(product.category).toUpperCase();
  return 'AUTHENTIC';
}

function drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, subtitle) {
  ctx.fillStyle = palette.primary;
  ctx.fillRect(0, 0, width, headerH);

  // Top & Bottom Gold Rules
  ctx.fillStyle = palette.accent;
  ctx.fillRect(0, 0, width, 8);
  ctx.fillRect(0, headerH - 8, width, 8);

  // Subtitle (Clean Bold Retail Typography - No AI Stars)
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = '900 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(subtitle, width / 2, isStatus ? 44 : 36);

  // Shop Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(shopName, width / 2, isStatus ? 94 : 80);

  // Location
  ctx.font = '600 17px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = palette.locationText;
  ctx.fillText(location, width / 2, isStatus ? 136 : 112);
}

function drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, mpesaTill, ctaHeader) {
  const footerY = height - footerH;

  ctx.fillStyle = palette.primary;
  ctx.fillRect(0, footerY, width, footerH);

  // Gold Top Separator Line
  ctx.fillStyle = palette.accent;
  ctx.fillRect(0, footerY, width, 8);

  // CTA Header (Clean Bold Retail Typography)
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = `900 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(ctaHeader, width / 2, footerY + (isStatus ? 48 : 34));

  // Large WhatsApp Number
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 58 : 44}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 116 : 84));

  // Screenshot helper
  ctx.fillStyle = palette.footerSubtext;
  ctx.font = `600 ${isStatus ? 20 : 15}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('Screenshot this post to order • Countrywide Delivery', width / 2, footerY + (isStatus ? 174 : 124));

  // M-Pesa Pill
  const mpesaW = isStatus ? 760 : 660;
  const mpesaH = isStatus ? 48 : 38;
  const mpesaX = (width - mpesaW) / 2;
  const mpesaY = footerY + (isStatus ? 212 : 150);

  ctx.fillStyle = palette.mpesaBg;
  roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
  ctx.fill();

  ctx.strokeStyle = palette.mpesaBorder;
  ctx.lineWidth = 2;
  roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
  ctx.stroke();

  ctx.fillStyle = palette.mpesaText;
  ctx.font = `700 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
  const mpesaText = mpesaTill
    ? `Lipa na M-Pesa Buy Goods Till: ${mpesaTill} • Same-Day Dispatch`
    : 'Lipa na M-Pesa Available • Same-Day Dispatch Across Kenya';
  ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));
}

function drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight, cornerRadius = 26) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, cornerRadius);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, cornerRadius);
  ctx.stroke();
}

export const canvasRenderer = {
  /**
   * Main render entry point - Dispatches dynamically to the chosen flyer style
   */
  async renderPost(product, seller, ratio = 'status', style = 'unified_brand', companionProduct = null, paletteOverride = null) {
    const s = String(style || '').toLowerCase().trim();

    if (s === 'flash_sale' || s === 'price_drop') {
      return this.renderFlashSalePost(product, seller, ratio, paletteOverride);
    }
    if (s === 'customer_reviews' || s === 'review_spotlight') {
      return this.renderCustomerReviewPost(product, seller, ratio, paletteOverride);
    }
    if (s === 'product_bundles' || s === 'bundle_offer') {
      return this.renderProductBundlePost(product, companionProduct, seller, ratio, paletteOverride);
    }
    if (s === 'restock_alerts' || s === 'restocked' || s === 'back_in_stock' || s === 'limited_stock') {
      return this.renderRestockAlertPost(product, seller, ratio, paletteOverride);
    }
    if (s === 'luxury_editorial' || s === 'editorial' || s === 'vogue') {
      return this.renderLuxuryEditorialPost(product, seller, ratio, paletteOverride);
    }
    if (s === 'neon_bold' || s === 'streetwear' || s === 'neon') {
      return this.renderNeonBoldPost(product, seller, ratio, paletteOverride);
    }
    if (s === 'minimalist_clean' || s === 'minimal' || s === 'studio_clean') {
      return this.renderMinimalistPost(product, seller, ratio, paletteOverride);
    }
    if (s === 'polaroid_snap' || s === 'polaroid' || s === 'retro_snap') {
      return this.renderPolaroidPost(product, seller, ratio, paletteOverride);
    }
    if (s === 'clearance_deal' || s === 'hot_deal' || s === 'supermarket') {
      return this.renderClearanceDealPost(product, seller, ratio, paletteOverride);
    }

    // Default Brand Master layout ('unified_brand')
    return this.renderUnifiedPost(product, seller, ratio, style, paletteOverride);
  },

  /**
   * 1. Brand Master Flyer ('unified_brand')
   */
  async renderUnifiedPost(product, seller, ratio = 'status', overrideStyle = null, paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const palette = resolvePalette(seller, paletteOverride);
    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD • Countrywide Dispatch';
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Base background & frame
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Header (Bold Retail Typography - No Stars)
    const headerH = isStatus ? 165 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, '100% AUTHENTIC • VERIFIED QUALITY');

    // 2. Hero Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight);

    // Category / Size Pill (Top-Left)
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catTextW = ctx.measureText(sizeText).width;
    const catBadgeW = Math.max(160, Math.round(catTextW + 34));
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 22, boxY + 20, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 22 + catBadgeW / 2, boxY + 47);

    // Top-Right Promo Badge if enabled (Bold Clean Text)
    if (product.badge || product.promo_tag) {
      const badgeTxt = String(product.badge || product.promo_tag).replace(/[✦★✨⭐]/g, '').trim().toUpperCase();
      if (badgeTxt) {
        ctx.fillStyle = palette.accent;
        const bW = Math.max(160, Math.round(ctx.measureText(badgeTxt).width + 36));
        roundRect(ctx, boxX + boxWidth - bW - 22, boxY + 20, bW, 42, 12);
        ctx.fill();
        ctx.fillStyle = '#064e3b';
        ctx.font = '900 14px system-ui, -apple-system, sans-serif';
        ctx.fillText(badgeTxt, boxX + boxWidth - bW / 2 - 22, boxY + 47);
      }
    }

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const pad = isStatus ? 35 : 20;
      const maxW = boxWidth - pad * 2;
      const maxH = boxHeight - pad * 2 - 15;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 15 + Math.round((boxHeight - 15 - dh) / 2),
        dw, dh);
    }

    // 3. Title & Benefit
    const titleStartY = boxY + boxHeight + (isStatus ? 42 : 30);
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, product.name, width / 2, titleStartY, boxWidth - 40, isStatus ? 40 : 32, 18);
    const cleanBenefit = product.benefit_line ? `✔ ${product.benefit_line}` : '✔ 100% Genuine Quality • Certified Original';
    const benefitY = titleResult.endY + (isStatus ? 38 : 26);
    ctx.fillStyle = palette.benefitText;
    ctx.textAlign = 'center';
    ctx.font = `700 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(cleanBenefit, width / 2, benefitY);

    // 4. Offer Pop Container (Bold Subtitle - No Stars)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 114 : 92;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 30 : 20);

    ctx.save();
    ctx.fillStyle = palette.glow;
    roundRect(ctx, offerX - 4, offerY - 4, offerW + 8, offerH + 8, 22);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = palette.primary;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.fill();
    ctx.strokeStyle = palette.accentBorder;
    ctx.lineWidth = 4;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('SPECIAL OFFER PRICE • IN STOCK', width / 2, offerY + (isStatus ? 30 : 24));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 64 : 48}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(formattedPrice, width / 2, offerY + (isStatus ? 84 : 68));

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 260;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, seller.mpesa_till, 'TO INQUIRE OR ORDER ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 2. Flash Sale Flyer ('flash_sale')
   * High-urgency deal with strikethrough price, savings pill & countdown ribbon
   */
  async renderFlashSalePost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const palette = resolvePalette(seller, paletteOverride);
    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD • Same-Day Dispatch';
    const sizeText = getCategorySizeText(product);

    const priceNum = Number(product.price || 0);
    const regPrice = product.regular_price && Number(product.regular_price) > priceNum
      ? Number(product.regular_price)
      : Math.round((priceNum * 1.3) / 50) * 50;
    const savings = Math.max(300, regPrice - priceNum);
    const discountPct = Math.round((savings / regPrice) * 100);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Header (Clean Bold Text - No Lightning Emojis)
    const headerH = isStatus ? 165 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, '24-HOUR FLASH SALE • SPECIAL PRICE DROP');

    // 2. Hero Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight);

    // Top-Left Category Pill
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 34));
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 22, boxY + 20, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 22 + catBadgeW / 2, boxY + 47);

    // Top-Right Flash Sale Pill (Crisp Bold Typography)
    const flashW = 240;
    ctx.fillStyle = '#dc2626';
    roundRect(ctx, boxX + boxWidth - flashW - 22, boxY + 20, flashW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 15px system-ui, -apple-system, sans-serif';
    ctx.fillText('FLASH SALE • TODAY ONLY', boxX + boxWidth - flashW / 2 - 22, boxY + 47);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const pad = isStatus ? 35 : 20;
      const maxW = boxWidth - pad * 2;
      const maxH = boxHeight - (isStatus ? 160 : 100);
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 50 + Math.round((maxH - dh) / 2),
        dw, dh);
    }

    // Inset Countdown Urgency Ribbon at bottom of hero card (Clean Bold Text)
    const ribbonH = isStatus ? 50 : 38;
    const ribbonY = boxY + boxHeight - ribbonH - (isStatus ? 20 : 12);
    const ribbonW = boxWidth - (isStatus ? 120 : 60);
    const ribbonX = boxX + (boxWidth - ribbonW) / 2;

    ctx.fillStyle = '#fef2f2';
    roundRect(ctx, ribbonX, ribbonY, ribbonW, ribbonH, 14);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    roundRect(ctx, ribbonX, ribbonY, ribbonW, ribbonH, 14);
    ctx.stroke();

    ctx.fillStyle = '#b91c1c';
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('LIMITED TIME DEAL • ENDS AT MIDNIGHT', width / 2, ribbonY + ribbonH / 2 + (isStatus ? 5 : 4));

    // 3. Title & Benefit
    const titleStartY = boxY + boxHeight + (isStatus ? 42 : 30);
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, product.name, width / 2, titleStartY, boxWidth - 40, isStatus ? 40 : 32, 18);
    const benefitY = titleResult.endY + (isStatus ? 38 : 26);
    ctx.fillStyle = palette.benefitText;
    ctx.textAlign = 'center';
    ctx.font = `700 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('✔ 100% Genuine • Sealed Original Packaging', width / 2, benefitY);

    // 4. Flash Offer Container (Deep Crimson Box with Strikethrough & Big Price - No Stars)
    const offerW = isStatus ? 640 : 540;
    const offerH = isStatus ? 126 : 100;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 30 : 20);

    ctx.save();
    ctx.fillStyle = 'rgba(220, 38, 38, 0.25)';
    roundRect(ctx, offerX - 4, offerY - 4, offerW + 8, offerH + 8, 22);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#7f1d1d';
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.fill();
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 4;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = `900 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`FLASH SALE PRICE • SAVE KES ${savings.toLocaleString()} (${discountPct}% OFF)`, width / 2, offerY + (isStatus ? 28 : 22));

    // Dual Price: Strikethrough Regular + Huge Flash Price
    const wasText = `WAS KES ${regPrice.toLocaleString()}`;
    const nowText = `KES ${priceNum.toLocaleString()}`;

    ctx.font = `800 ${isStatus ? 24 : 18}px system-ui, -apple-system, sans-serif`;
    const wasW = ctx.measureText(wasText).width;
    ctx.font = `900 ${isStatus ? 58 : 44}px system-ui, -apple-system, sans-serif`;
    const nowW = ctx.measureText(nowText).width;

    const priceGap = isStatus ? 36 : 24;
    const totalW = wasW + priceGap + nowW;
    const startX = (width - totalW) / 2;

    const wasX = startX + wasW / 2;
    const priceBaseline = offerY + (isStatus ? 84 : 68);
    ctx.fillStyle = '#fca5a5';
    ctx.font = `800 ${isStatus ? 24 : 18}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(wasText, wasX, priceBaseline - 4);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX, priceBaseline - 12);
    ctx.lineTo(startX + wasW, priceBaseline - 12);
    ctx.stroke();

    const nowX = startX + wasW + priceGap + nowW / 2;
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 58 : 44}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(nowText, nowX, priceBaseline);

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 260;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, seller.mpesa_till, 'CLAIM THIS FLASH SALE DEAL ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 3. Customer Reviews Flyer ('customer_reviews')
   * Top customer rating, verified buyer quote bubble & social proof
   */
  async renderCustomerReviewPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const palette = resolvePalette(seller, paletteOverride);
    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD • Countrywide Dispatch';
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Header (Clean Bold Text - No Stars)
    const headerH = isStatus ? 165 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, 'VERIFIED BUYER FAVORITE • RATED 4.9 / 5.0');

    // 2. Hero Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight);

    // Top-Left Category Pill
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 34));
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 22, boxY + 20, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 22 + catBadgeW / 2, boxY + 47);

    // Top-Right Rating Pill (Clean Bold Text - No Stars)
    const starW = 200;
    ctx.fillStyle = '#f59e0b';
    roundRect(ctx, boxX + boxWidth - starW - 22, boxY + 20, starW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#064e3b';
    ctx.font = '900 15px system-ui, -apple-system, sans-serif';
    ctx.fillText('RATED 4.9 / 5.0', boxX + boxWidth - starW / 2 - 22, boxY + 47);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const pad = isStatus ? 35 : 20;
      const maxW = boxWidth - pad * 2;
      const maxH = boxHeight - (isStatus ? 220 : 150);
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 50 + Math.round((maxH - dh) / 2),
        dw, dh);
    }

    // Inset Testimonial Quote Bubble
    const qBoxH = isStatus ? 130 : 92;
    const qBoxY = boxY + boxHeight - qBoxH - (isStatus ? 20 : 12);
    const qBoxW = boxWidth - (isStatus ? 60 : 36);
    const qBoxX = boxX + (boxWidth - qBoxW) / 2;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    roundRect(ctx, qBoxX, qBoxY, qBoxW, qBoxH, 16);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 2.5;
    roundRect(ctx, qBoxX, qBoxY, qBoxW, qBoxH, 16);
    ctx.stroke();

    // Quotation Mark
    ctx.fillStyle = palette.accent;
    ctx.font = `900 ${isStatus ? 48 : 34}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillText('“', qBoxX + (isStatus ? 35 : 26), qBoxY + (isStatus ? 48 : 34));

    // Dynamic review quote based on category
    const cat = (product.category || '').toLowerCase();
    const isClothes = cat.includes('clothes') || cat.includes('clothing') || cat.includes('dress');
    const isHousehold = cat.includes('household') || cat.includes('bedding') || cat.includes('kitchen');

    const quoteTxt = isClothes
      ? '“True to size, breathable fabric and top quality stitching! Delivery was same-day.”'
      : (isHousehold
          ? '“Received exactly what was pictured, heavy quality and vibrant colors!”'
          : '“Cleared my dark spots in 2 weeks! Original product kabisa, 100% repurchasing.”');

    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.font = `700 ${isStatus ? 18 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(quoteTxt, qBoxX + (isStatus ? 65 : 48), qBoxY + (isStatus ? 42 : 30));

    ctx.fillStyle = palette.primary;
    ctx.font = `800 ${isStatus ? 14 : 11}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('— Stacy M., Kilimani • Verified Buyer (Rated 5/5)', qBoxX + (isStatus ? 65 : 48), qBoxY + (isStatus ? 85 : 62));

    // 3. Title & Benefit (Clean Bold Text - No Stars)
    const titleStartY = boxY + boxHeight + (isStatus ? 42 : 30);
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, product.name, width / 2, titleStartY, boxWidth - 40, isStatus ? 40 : 32, 18);
    const benefitY = titleResult.endY + (isStatus ? 38 : 26);
    ctx.fillStyle = '#b45309';
    ctx.textAlign = 'center';
    ctx.font = `900 ${isStatus ? 22 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Rated 4.9 / 5.0 by 120+ Verified Kenyan Shoppers', width / 2, benefitY);

    // 4. Offer Container (Clean Bold Text - No Stars)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 114 : 92;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 30 : 20);

    ctx.save();
    ctx.fillStyle = palette.glow;
    roundRect(ctx, offerX - 4, offerY - 4, offerW + 8, offerH + 8, 22);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = palette.primary;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.fill();
    ctx.strokeStyle = palette.accentBorder;
    ctx.lineWidth = 4;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('TOP-RATED CUSTOMER PICK • IN STOCK', width / 2, offerY + (isStatus ? 30 : 24));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 64 : 48}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(formattedPrice, width / 2, offerY + (isStatus ? 84 : 68));

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 260;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, seller.mpesa_till, 'ORDER THIS TOP-RATED PICK ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 4. Product Bundle Flyer ('product_bundles')
   * 2-in-1 combo routine showcase with bundle discount
   */
  async renderProductBundlePost(product, companionProduct, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const palette = resolvePalette(seller, paletteOverride);
    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD • Countrywide Dispatch';

    const price1 = Number(product.price || 0);
    const compPrice = companionProduct ? Number(companionProduct.price || 0) : Math.round(price1 * 0.85);
    const combinedTotal = price1 + compPrice;
    const savings = Math.max(400, Math.round((combinedTotal * 0.15) / 50) * 50);
    const bundlePrice = combinedTotal - savings;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Header (Clean Bold Text - No Stars)
    const headerH = isStatus ? 165 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, '2-IN-1 ROUTINE COMBO • BUNDLE & SAVE');

    // 2. Hero Card (Dual Product Presentation)
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight);

    // Top-Left Category Pill
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = 200;
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 22, boxY + 20, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('2-IN-1 ROUTINE', boxX + 22 + catBadgeW / 2, boxY + 47);

    // Top-Right Bundle Savings Pill (Bold Clean Text)
    const bW = 190;
    ctx.fillStyle = '#10b981';
    roundRect(ctx, boxX + boxWidth - bW - 22, boxY + 20, bW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 15px system-ui, -apple-system, sans-serif';
    ctx.fillText('BUNDLE & SAVE', boxX + boxWidth - bW / 2 - 22, boxY + 47);

    // Load Images (Main + Companion)
    const heroImg = await loadProductImage(product, product.photo);
    const compImg = companionProduct ? await loadProductImage(companionProduct, companionProduct.photo) : null;

    if (heroImg && compImg) {
      const sideW = Math.round((boxWidth - 140) / 2);
      const sideH = isStatus ? 720 : 420;

      // Left Image (Main)
      const b1 = getProductBounds(heroImg);
      const scale1 = Math.min((sideW - 30) / b1.sWidth, (sideH - 30) / b1.sHeight);
      const dw1 = Math.round(b1.sWidth * scale1);
      const dh1 = Math.round(b1.sHeight * scale1);
      ctx.drawImage(heroImg, b1.sx, b1.sy, b1.sWidth, b1.sHeight,
        boxX + 40 + Math.round((sideW - dw1) / 2),
        boxY + 70 + Math.round((sideH - dh1) / 2),
        dw1, dh1);

      // Center PLUS Badge
      const plusCx = boxX + boxWidth / 2;
      const plusCy = boxY + 70 + sideH / 2;
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(plusCx, plusCy, isStatus ? 28 : 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = `900 ${isStatus ? 32 : 24}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('+', plusCx, plusCy + (isStatus ? 10 : 8));

      // Right Image (Companion)
      const b2 = getProductBounds(compImg);
      const scale2 = Math.min((sideW - 30) / b2.sWidth, (sideH - 30) / b2.sHeight);
      const dw2 = Math.round(b2.sWidth * scale2);
      const dh2 = Math.round(b2.sHeight * scale2);
      ctx.drawImage(compImg, b2.sx, b2.sy, b2.sWidth, b2.sHeight,
        boxX + boxWidth - 40 - sideW + Math.round((sideW - dw2) / 2),
        boxY + 70 + Math.round((sideH - dh2) / 2),
        dw2, dh2);

      // Dual labels below each image
      const lblY = boxY + 80 + sideH;
      const lblH = isStatus ? 40 : 32;

      ctx.fillStyle = '#f1f5f9';
      roundRect(ctx, boxX + 40, lblY, sideW, lblH, 10);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = `800 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
      ctx.fillText(`1. ${product.name.slice(0, 24)}`, boxX + 40 + sideW / 2, lblY + lblH / 2 + 5);

      ctx.fillStyle = '#f1f5f9';
      roundRect(ctx, boxX + boxWidth - 40 - sideW, lblY, sideW, lblH, 10);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`2. ${companionProduct.name.slice(0, 24)}`, boxX + boxWidth - 40 - sideW / 2, lblY + lblH / 2 + 5);
    } else if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const maxW = boxWidth - 80;
      const maxH = boxHeight - (isStatus ? 160 : 100);
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 60 + Math.round((maxH - dh) / 2),
        dw, dh);
    }

    // Bottom of card ribbon (Clean Bold Text - No Stars)
    const ribbonH = isStatus ? 50 : 38;
    const ribbonY = boxY + boxHeight - ribbonH - (isStatus ? 20 : 12);
    const ribbonW = boxWidth - (isStatus ? 100 : 60);
    const ribbonX = boxX + (boxWidth - ribbonW) / 2;

    ctx.fillStyle = '#ecfdf5';
    roundRect(ctx, ribbonX, ribbonY, ribbonW, ribbonH, 14);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    roundRect(ctx, ribbonX, ribbonY, ribbonW, ribbonH, 14);
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('2-STEP COMPLETE ROUTINE FOR MAXIMUM GLOW RESULTS', width / 2, ribbonY + ribbonH / 2 + (isStatus ? 5 : 4));

    // 3. Title & Benefit
    const comboTitle = companionProduct
      ? `${product.name} + ${companionProduct.name} Duo`
      : `${product.name} 2-in-1 Combo Routine`;
    const titleStartY = boxY + boxHeight + (isStatus ? 42 : 30);
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, comboTitle, width / 2, titleStartY, boxWidth - 40, isStatus ? 36 : 28, 16);
    const benefitY = titleResult.endY + (isStatus ? 38 : 26);
    ctx.fillStyle = palette.benefitText;
    ctx.textAlign = 'center';
    ctx.font = `700 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`✔ Save KES ${savings.toLocaleString()} when you buy both products together today!`, width / 2, benefitY);

    // 4. Bundle Offer Container (Clean Bold Text - No Stars)
    const offerW = isStatus ? 640 : 540;
    const offerH = isStatus ? 126 : 100;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 30 : 20);

    ctx.save();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
    roundRect(ctx, offerX - 4, offerY - 4, offerW + 8, offerH + 8, 22);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = palette.primary;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.fill();
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 4;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    ctx.font = `900 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`SPECIAL 2-IN-1 COMBO DEAL • SAVE KES ${savings.toLocaleString()}`, width / 2, offerY + (isStatus ? 28 : 22));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 54 : 42}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`KES ${bundlePrice.toLocaleString()} BUNDLE`, width / 2, offerY + (isStatus ? 84 : 68));

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 260;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, seller.mpesa_till, 'CLAIM THIS 2-IN-1 BUNDLE ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 5. Restock Alert Flyer ('restock_alerts')
   * Fresh batch announcement with FOMO scarcity meter
   */
  async renderRestockAlertPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const palette = resolvePalette(seller, paletteOverride);
    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD • Same-Day Dispatch';
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    const remainingCount = product.remaining || product.stock_qty || 4;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, width - 14, height - 14);

    // 1. Header (Clean Bold Text - No Stars or Emojis)
    const headerH = isStatus ? 165 : 135;
    drawSharedHeader(ctx, width, headerH, isStatus, palette, shopName, location, 'JUST RESTOCKED • FRESH SHIPMENT LANDED');

    // 2. Hero Card
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 25 : 15);
    const boxHeight = isStatus ? 1080 : 680;
    drawHeroCardBase(ctx, boxX, boxY, boxWidth, boxHeight);

    // Top-Left Category Pill
    ctx.font = '800 15px system-ui, -apple-system, sans-serif';
    const catBadgeW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 34));
    ctx.fillStyle = palette.primary;
    roundRect(ctx, boxX + 22, boxY + 20, catBadgeW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 22 + catBadgeW / 2, boxY + 47);

    // Top-Right Restock Pill (Clean Bold Text)
    const restockW = 200;
    ctx.fillStyle = '#059669';
    roundRect(ctx, boxX + boxWidth - restockW - 22, boxY + 20, restockW, 42, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 15px system-ui, -apple-system, sans-serif';
    ctx.fillText('JUST RESTOCKED', boxX + boxWidth - restockW / 2 - 22, boxY + 47);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const pad = isStatus ? 35 : 20;
      const maxW = boxWidth - pad * 2;
      const maxH = boxHeight - (isStatus ? 160 : 100);
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 50 + Math.round((maxH - dh) / 2),
        dw, dh);
    }

    // Inset Scarcity Urgency Stamp at bottom of hero card (Clean Bold Text)
    const ribbonH = isStatus ? 50 : 38;
    const ribbonY = boxY + boxHeight - ribbonH - (isStatus ? 20 : 12);
    const ribbonW = boxWidth - (isStatus ? 100 : 60);
    const ribbonX = boxX + (boxWidth - ribbonW) / 2;

    ctx.fillStyle = '#fef3c7';
    roundRect(ctx, ribbonX, ribbonY, ribbonW, ribbonH, 14);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    roundRect(ctx, ribbonX, ribbonY, ribbonW, ribbonH, 14);
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`ONLY ${remainingCount} PIECES REMAINING IN STOCK • SELLING FAST`, width / 2, ribbonY + ribbonH / 2 + (isStatus ? 5 : 4));

    // 3. Title & Benefit
    const titleStartY = boxY + boxHeight + (isStatus ? 42 : 30);
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, product.name, width / 2, titleStartY, boxWidth - 40, isStatus ? 40 : 32, 18);
    const benefitY = titleResult.endY + (isStatus ? 38 : 26);
    ctx.fillStyle = palette.benefitText;
    ctx.textAlign = 'center';
    ctx.font = `700 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('✔ Fresh Direct Manufacturer Batch • Sealed & Authentic', width / 2, benefitY);

    // 4. Offer Container (Clean Bold Text - No Stars)
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 114 : 92;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 30 : 20);

    ctx.save();
    ctx.fillStyle = palette.glow;
    roundRect(ctx, offerX - 4, offerY - 4, offerW + 8, offerH + 8, 22);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = palette.primary;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.fill();
    ctx.strokeStyle = palette.accentBorder;
    ctx.lineWidth = 4;
    roundRect(ctx, offerX, offerY, offerW, offerH, 20);
    ctx.stroke();

    ctx.fillStyle = palette.accent;
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('BACK BY POPULAR DEMAND • READY TO DISPATCH', width / 2, offerY + (isStatus ? 30 : 24));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 64 : 48}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(formattedPrice, width / 2, offerY + (isStatus ? 84 : 68));

    // 5. Footer (Bold Retail CTA)
    const footerH = isStatus ? 300 : 260;
    drawSharedFooter(ctx, width, height, footerH, isStatus, palette, phone, seller.mpesa_till, 'ORDER BEFORE IT SELLS OUT ON WHATSAPP:');

    return canvas.toDataURL('image/png');
  },

  /**
   * 6. Luxury Vogue Editorial Flyer ('luxury_editorial')
   */
  async renderLuxuryEditorialPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Jamia Mall Shop F47, Nairobi CBD';
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Deep Obsidian / Noir Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, width, height);

    // Double Gold Foil Border Frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(32, 32, width - 64, height - 64);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // Decorative corner accents
    const cornerSize = 28;
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(24, 24 + cornerSize); ctx.lineTo(24, 24); ctx.lineTo(24 + cornerSize, 24); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width - 24 - cornerSize, 24); ctx.lineTo(width - 24, 24); ctx.lineTo(width - 24, 24 + cornerSize); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(24, height - 24 - cornerSize); ctx.lineTo(24, height - 24); ctx.lineTo(24 + cornerSize, height - 24); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width - 24 - cornerSize, height - 24); ctx.lineTo(width - 24, height - 24); ctx.lineTo(width - 24, height - 24 - cornerSize); ctx.stroke();

    // 1. Luxury Header
    const headerH = isStatus ? 180 : 145;
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.font = '700 15px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillText('• THE SIGNATURE COLLECTION •', width / 2, isStatus ? 80 : 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 38px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillText(shopName, width / 2, isStatus ? 128 : 108);

    ctx.font = '500 15px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(location, width / 2, isStatus ? 162 : 136);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 160, headerH + 5);
    ctx.lineTo(width / 2 + 160, headerH + 5);
    ctx.stroke();

    // 2. Hero Luxury Card
    const boxX = 65;
    const boxWidth = width - 130;
    const boxY = headerH + (isStatus ? 24 : 14);
    const boxHeight = isStatus ? 1040 : 660;

    ctx.save();
    ctx.fillStyle = '#101624';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.15)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 22);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 22);
    ctx.stroke();

    // Gold category pill top-left
    ctx.font = '700 14px "Cinzel", Georgia, serif';
    const catBadgeW = Math.max(170, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = 'rgba(212, 175, 55, 0.18)';
    roundRect(ctx, boxX + 22, boxY + 20, catBadgeW, 38, 10);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    roundRect(ctx, boxX + 22, boxY + 20, catBadgeW, 38, 10);
    ctx.stroke();
    ctx.fillStyle = '#fef3c7';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 22 + catBadgeW / 2, boxY + 44);

    // Top-right Luxury Edition tag
    const editionW = 190;
    ctx.fillStyle = '#d4af37';
    roundRect(ctx, boxX + boxWidth - editionW - 22, boxY + 20, editionW, 38, 10);
    ctx.fill();
    ctx.fillStyle = '#080c14';
    ctx.font = '900 13px system-ui, -apple-system, sans-serif';
    ctx.fillText('100% AUTHENTIC', boxX + boxWidth - editionW / 2 - 22, boxY + 44);

    // Radial gold aura glow behind product
    const heroImg = await loadProductImage(product, product.photo);
    const cx = boxX + boxWidth / 2;
    const cy = boxY + boxHeight / 2;
    const aura = ctx.createRadialGradient(cx, cy, 40, cx, cy, boxWidth * 0.42);
    aura.addColorStop(0, 'rgba(212, 175, 55, 0.18)');
    aura.addColorStop(0.7, 'rgba(212, 175, 55, 0.05)');
    aura.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(boxX + 10, boxY + 10, boxWidth - 20, boxHeight - 20);

    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const pad = isStatus ? 40 : 25;
      const maxW = boxWidth - pad * 2;
      const maxH = boxHeight - pad * 2 - 20;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 25 + Math.round((boxHeight - 25 - dh) / 2),
        dw, dh);
    }

    // 3. Product Title & Subtitle in Luxury Serif
    const titleStartY = boxY + boxHeight + (isStatus ? 44 : 32);
    ctx.fillStyle = '#ffffff';
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, product.name, width / 2, titleStartY, boxWidth - 40, isStatus ? 40 : 32, 18);
    const benefitY = titleResult.endY + (isStatus ? 36 : 24);
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.font = `600 ${isStatus ? 20 : 16}px "Cinzel", "Playfair Display", Georgia, serif`;
    ctx.fillText(`✦ ${product.benefit_line || 'Certified Original Formulation • Import Quality'} ✦`, width / 2, benefitY);

    // 4. Luxury Price Plaque
    const offerW = isStatus ? 580 : 480;
    const offerH = isStatus ? 116 : 94;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 28 : 20);

    ctx.fillStyle = '#101624';
    roundRect(ctx, offerX, offerY, offerW, offerH, 18);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    roundRect(ctx, offerX, offerY, offerW, offerH, 18);
    ctx.stroke();

    ctx.fillStyle = '#d4af37';
    ctx.font = `700 ${isStatus ? 15 : 12}px "Cinzel", Georgia, serif`;
    ctx.fillText('—  CURATED EXCLUSIVE PRICE  —', width / 2, offerY + (isStatus ? 32 : 26));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 64 : 48}px "Cinzel", "Playfair Display", Georgia, serif`;
    ctx.fillText(formattedPrice, width / 2, offerY + (isStatus ? 86 : 70));

    // 5. Luxury Footer
    const footerH = isStatus ? 290 : 250;
    const footerY = height - footerH;

    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, footerY, width, footerH);
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(0, footerY, width, 4);

    ctx.fillStyle = '#d4af37';
    ctx.font = `800 ${isStatus ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('VIP CONCIERGE ORDERING VIA WHATSAPP:', width / 2, footerY + (isStatus ? 50 : 36));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 56 : 42}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 116 : 84));

    ctx.fillStyle = '#94a3b8';
    ctx.font = `600 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Dispatched via Wells Fargo / G4S / Boda • Same-Day Nairobi', width / 2, footerY + (isStatus ? 172 : 124));

    const mpesaW = isStatus ? 760 : 660;
    const mpesaH = isStatus ? 48 : 38;
    const mpesaX = (width - mpesaW) / 2;
    const mpesaY = footerY + (isStatus ? 210 : 150);

    ctx.fillStyle = '#101624';
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 12);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1.5;
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 12);
    ctx.stroke();

    ctx.fillStyle = '#fef3c7';
    ctx.font = `700 ${isStatus ? 17 : 13}px system-ui, -apple-system, sans-serif`;
    const mpesaText = seller.mpesa_till
      ? `Lipa na M-Pesa Buy Goods Till: ${seller.mpesa_till} • Certified Payment`
      : 'Lipa na M-Pesa Available • Official Receipt Issued';
    ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));

    return canvas.toDataURL('image/png');
  },

  /**
   * 7. Neon Streetwear Drop Flyer ('neon_bold')
   */
  async renderNeonBoldPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD • Boda Express';
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Pure Matte Jet Black Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    // Top Electric Neon Hazard Bar
    const topBarH = isStatus ? 56 : 44;
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, width, topBarH);

    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.font = `900 ${isStatus ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('⚡ HIGH DEMAND DROP // OFFICIAL STREET RELEASE ⚡', width / 2, isStatus ? 36 : 28);

    // Header Content
    const headerH = isStatus ? 180 : 145;
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 42 : 34}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(shopName, width / 2, isStatus ? 116 : 94);

    ctx.fillStyle = '#10b981';
    ctx.font = `800 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`// ${location.toUpperCase()} //`, width / 2, isStatus ? 154 : 124);

    // Hero Container with Electric Neon Glow
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 20 : 12);
    const boxHeight = isStatus ? 1050 : 660;

    ctx.save();
    ctx.fillStyle = '#141418';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 28;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 18);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3.5;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 18);
    ctx.stroke();

    // Top-Left Neon Street Tag
    ctx.fillStyle = '#10b981';
    const tagW = Math.max(180, Math.round(ctx.measureText(sizeText).width + 40));
    roundRect(ctx, boxX + 20, boxY + 20, tagW, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '900 15px system-ui, -apple-system, sans-serif';
    ctx.fillText(`STREET // ${sizeText}`, boxX + 20 + tagW / 2, boxY + 45);

    // Top-Right Cyber Yellow Tag
    const rightTagW = 180;
    ctx.fillStyle = '#facc15';
    roundRect(ctx, boxX + boxWidth - rightTagW - 20, boxY + 20, rightTagW, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '900 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('100% AUTHENTIC', boxX + boxWidth - rightTagW / 2 - 20, boxY + 45);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const pad = isStatus ? 35 : 20;
      const maxW = boxWidth - pad * 2;
      const maxH = boxHeight - pad * 2 - 15;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 20 + Math.round((boxHeight - 20 - dh) / 2),
        dw, dh);
    }

    // Title & Benefit
    const titleStartY = boxY + boxHeight + (isStatus ? 42 : 30);
    ctx.fillStyle = '#ffffff';
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, product.name, width / 2, titleStartY, boxWidth - 40, isStatus ? 40 : 32, 18);
    const benefitY = titleResult.endY + (isStatus ? 36 : 24);

    ctx.fillStyle = '#a1a1aa';
    ctx.textAlign = 'center';
    ctx.font = `800 ${isStatus ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`⚡ ${product.benefit_line || 'Verified Original Stock • Express Same-Day Pickup'}`, width / 2, benefitY);

    // Massive Neon Price Banner
    const offerW = isStatus ? 600 : 500;
    const offerH = isStatus ? 116 : 94;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 28 : 20);

    ctx.save();
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 25;
    roundRect(ctx, offerX, offerY, offerW, offerH, 16);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#000000';
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('// FAST MOVING ITEM • COP BEFORE SOLD OUT //', width / 2, offerY + (isStatus ? 32 : 26));

    ctx.fillStyle = '#000000';
    ctx.font = `900 ${isStatus ? 68 : 52}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(formattedPrice, width / 2, offerY + (isStatus ? 88 : 72));

    // Footer
    const footerH = isStatus ? 290 : 250;
    const footerY = height - footerH;

    ctx.fillStyle = '#141418';
    ctx.fillRect(0, footerY, width, footerH);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, footerY, width, 5);

    ctx.fillStyle = '#10b981';
    ctx.font = `900 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('TAP TO COP ON WHATSAPP NOW:', width / 2, footerY + (isStatus ? 48 : 36));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 58 : 44}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 116 : 84));

    ctx.fillStyle = '#a1a1aa';
    ctx.font = `700 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Express Dispatch Across Nairobi • Send Screenshot to Lock Order', width / 2, footerY + (isStatus ? 172 : 124));

    const mpesaW = isStatus ? 760 : 660;
    const mpesaH = isStatus ? 48 : 38;
    const mpesaX = (width - mpesaW) / 2;
    const mpesaY = footerY + (isStatus ? 210 : 150);

    ctx.fillStyle = '#09090b';
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 12);
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 12);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = `800 ${isStatus ? 17 : 13}px system-ui, -apple-system, sans-serif`;
    const mpesaText = seller.mpesa_till
      ? `Lipa na M-Pesa Buy Goods: ${seller.mpesa_till} • Instant Confirmation`
      : 'Lipa na M-Pesa Buy Goods Available • Instant Dispatch';
    ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));

    return canvas.toDataURL('image/png');
  },

  /**
   * 8. Studio Minimalist Flyer ('minimalist_clean')
   */
  async renderMinimalistPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD • Jamia Mall';
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Pure White Studio Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Subtle 1.5px Hairline Framing
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(24, 24, width - 48, height - 48);

    // 1. Spacious Minimalist Header
    const headerH = isStatus ? 160 : 130;
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.font = '800 32px system-ui, -apple-system, sans-serif';
    ctx.fillText(shopName, width / 2, isStatus ? 90 : 75);

    ctx.fillStyle = '#64748b';
    ctx.font = '600 15px system-ui, -apple-system, sans-serif';
    ctx.fillText(`${location.toUpperCase()}  •  AUTHENTIC BEAUTY`, width / 2, isStatus ? 130 : 105);

    // Fine divider line
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, headerH);
    ctx.lineTo(width - 80, headerH);
    ctx.stroke();

    // 2. Floating Hero Product Area with Soft Contact Shadow
    const heroH = isStatus ? 1040 : 660;
    const heroY = headerH + (isStatus ? 20 : 10);
    const cx = width / 2;
    const shadowY = heroY + heroH - (isStatus ? 80 : 50);

    // Minimal floating category chip top-center
    ctx.font = '700 13px system-ui, -apple-system, sans-serif';
    const catW = Math.max(160, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = '#f8fafc';
    roundRect(ctx, cx - catW / 2, heroY + 20, catW, 36, 18);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    roundRect(ctx, cx - catW / 2, heroY + 20, catW, 36, 18);
    ctx.stroke();
    ctx.fillStyle = '#475569';
    ctx.fillText(sizeText, cx, heroY + 43);

    // Radial contact shadow
    const shadowW = 320;
    ctx.save();
    ctx.translate(cx, shadowY);
    ctx.scale(1, 0.22);
    ctx.beginPath();
    ctx.arc(0, 0, shadowW, 0, Math.PI * 2);
    const sGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, shadowW);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
    sGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.06)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sGrad;
    ctx.fill();
    ctx.restore();

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const maxW = width - 240;
      const maxH = heroH - (isStatus ? 140 : 90);
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        cx - Math.round(dw / 2),
        heroY + 60 + Math.round((maxH - dh) / 2),
        dw, dh);
    }

    // 3. Title & Benefit
    const titleStartY = heroY + heroH + (isStatus ? 30 : 20);
    ctx.fillStyle = '#0f172a';
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, product.name, width / 2, titleStartY, width - 200, isStatus ? 38 : 30, 18);
    const benefitY = titleResult.endY + (isStatus ? 32 : 22);

    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.font = `600 ${isStatus ? 19 : 15}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(product.benefit_line || '100% Authentic Quality • Guaranteed Genuine Formulation', width / 2, benefitY);

    // 4. Modern Minimalist Price Pill
    const offerW = isStatus ? 540 : 440;
    const offerH = isStatus ? 104 : 86;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 26 : 18);

    ctx.fillStyle = '#0f172a';
    roundRect(ctx, offerX, offerY, offerW, offerH, 18);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = `700 ${isStatus ? 14 : 12}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('IN STOCK  •  AUTHENTIC ORIGINAL', width / 2, offerY + (isStatus ? 30 : 24));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 58 : 46}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(formattedPrice, width / 2, offerY + (isStatus ? 78 : 64));

    // 5. Minimalist Clean Footer
    const footerH = isStatus ? 280 : 240;
    const footerY = height - footerH;

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, footerY);
    ctx.lineTo(width - 80, footerY);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = `800 ${isStatus ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('ORDER DIRECT VIA WHATSAPP:', width / 2, footerY + (isStatus ? 48 : 36));

    ctx.fillStyle = '#059669';
    ctx.font = `900 ${isStatus ? 54 : 42}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 110 : 82));

    ctx.fillStyle = '#64748b';
    ctx.font = `600 ${isStatus ? 17 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Same-Day Nairobi Dispatch • Nationwide Courier Delivery', width / 2, footerY + (isStatus ? 164 : 120));

    const mpesaW = isStatus ? 720 : 620;
    const mpesaH = isStatus ? 44 : 36;
    const mpesaX = (width - mpesaW) / 2;
    const mpesaY = footerY + (isStatus ? 200 : 144);

    ctx.fillStyle = '#f8fafc';
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 12);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 12);
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.font = `700 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    const mpesaText = seller.mpesa_till
      ? `Lipa na M-Pesa Buy Goods Till: ${seller.mpesa_till}`
      : 'Lipa na M-Pesa Available • Official Store Receipt';
    ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 28 : 23));

    return canvas.toDataURL('image/png');
  },

  /**
   * 9. Polaroid Instant Snap Flyer ('polaroid_snap')
   */
  async renderPolaroidPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Nairobi CBD • Jamia Mall';
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    // Warm aesthetic cream/latte paper background
    ctx.fillStyle = '#f6f2ec';
    ctx.fillRect(0, 0, width, height);

    // Boutique Header
    const headerH = isStatus ? 170 : 140;
    ctx.fillStyle = '#92400e';
    ctx.textAlign = 'center';
    ctx.font = '800 16px system-ui, -apple-system, sans-serif';
    ctx.fillText('✨ TODAY\'S HANDPICKED FAVORITE ✨', width / 2, isStatus ? 75 : 60);

    ctx.fillStyle = '#451a03';
    ctx.font = '900 36px system-ui, -apple-system, sans-serif';
    ctx.fillText(shopName, width / 2, isStatus ? 122 : 100);

    ctx.fillStyle = '#78350f';
    ctx.font = '600 15px system-ui, -apple-system, sans-serif';
    ctx.fillText(location, width / 2, isStatus ? 156 : 128);

    // The Polaroid Instant Photo Card
    const polaroidW = width - 140;
    const polaroidH = isStatus ? 1040 : 660;
    const polaroidX = 70;
    const polaroidY = headerH + (isStatus ? 24 : 14);

    // Soft drop shadow
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(69, 26, 3, 0.16)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 12;
    roundRect(ctx, polaroidX, polaroidY, polaroidW, polaroidH, 16);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#e7e0d6';
    ctx.lineWidth = 2;
    roundRect(ctx, polaroidX, polaroidY, polaroidW, polaroidH, 16);
    ctx.stroke();

    // Simulated Washi Tape at Top-Center of Polaroid
    const tapeW = 180;
    const tapeH = 34;
    ctx.save();
    ctx.translate(width / 2, polaroidY);
    ctx.rotate(-0.02);
    ctx.fillStyle = 'rgba(217, 195, 170, 0.85)';
    roundRect(ctx, -tapeW / 2, -tapeH / 2, tapeW, tapeH, 4);
    ctx.fill();
    ctx.strokeStyle = 'rgba(180, 150, 120, 0.4)';
    ctx.lineWidth = 1;
    roundRect(ctx, -tapeW / 2, -tapeH / 2, tapeW, tapeH, 4);
    ctx.stroke();
    ctx.restore();

    // Inner Image Frame inside Polaroid
    const pad = 36;
    const innerPhotoW = polaroidW - pad * 2;
    const innerPhotoH = polaroidH - (isStatus ? 200 : 130);
    const innerPhotoX = polaroidX + pad;
    const innerPhotoY = polaroidY + pad;

    ctx.fillStyle = '#fdfbf9';
    roundRect(ctx, innerPhotoX, innerPhotoY, innerPhotoW, innerPhotoH, 8);
    ctx.fill();
    ctx.strokeStyle = '#ede4d8';
    ctx.lineWidth = 1.5;
    roundRect(ctx, innerPhotoX, innerPhotoY, innerPhotoW, innerPhotoH, 8);
    ctx.stroke();

    // Hero image centered in inner photo cutout
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const scale = Math.min((innerPhotoW - 40) / bounds.sWidth, (innerPhotoH - 40) / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        innerPhotoX + Math.round((innerPhotoW - dw) / 2),
        innerPhotoY + Math.round((innerPhotoH - dh) / 2),
        dw, dh);
    }

    // Kraft Paper Price Tag Pinned at top-right of inner photo
    const tagW = 190;
    const tagH = 46;
    const tagX = innerPhotoX + innerPhotoW - tagW - 14;
    const tagY = innerPhotoY + 14;

    ctx.save();
    ctx.translate(tagX + tagW / 2, tagY + tagH / 2);
    ctx.rotate(0.04);
    ctx.fillStyle = '#b45309';
    roundRect(ctx, -tagW / 2, -tagH / 2, tagW, tagH, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🏷️ ${formattedPrice}`, 0, 6);
    ctx.restore();

    // Polaroid Bottom Margin (Chin) - Handwritten Script Feel
    const chinY = innerPhotoY + innerPhotoH + (isStatus ? 55 : 35);
    ctx.fillStyle = '#292524';
    ctx.textAlign = 'center';
    ctx.font = `italic 700 ${isStatus ? 28 : 22}px Georgia, serif`;
    ctx.fillText(`“Our Daily Pick: ${product.name.slice(0, 32)}...”`, width / 2, chinY);

    ctx.fillStyle = '#78350f';
    ctx.font = `600 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`${sizeText}  •  100% Genuine Imported`, width / 2, chinY + (isStatus ? 36 : 26));

    // 3. Product Benefit Line
    const benefitY = polaroidY + polaroidH + (isStatus ? 48 : 34);
    ctx.fillStyle = '#451a03';
    ctx.font = `700 ${isStatus ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`✔ ${product.benefit_line || 'Clean, authentic results with zero harmful additives.'}`, width / 2, benefitY);

    // 4. Friendly Ordering Strip
    const footerH = isStatus ? 290 : 250;
    const footerY = height - footerH;

    ctx.fillStyle = '#ede5dc';
    ctx.fillRect(0, footerY, width, footerH);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, footerY, width, 5);

    ctx.fillStyle = '#78350f';
    ctx.font = `800 ${isStatus ? 21 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('SCREENSHOT THIS PHOTO TO ORDER ON WHATSAPP:', width / 2, footerY + (isStatus ? 50 : 36));

    ctx.fillStyle = '#059669';
    ctx.font = `900 ${isStatus ? 56 : 42}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 116 : 84));

    ctx.fillStyle = '#78350f';
    ctx.font = `600 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Same-Day Nairobi Boda • Countrywide Parcel Delivery', width / 2, footerY + (isStatus ? 172 : 124));

    const mpesaW = isStatus ? 760 : 660;
    const mpesaH = isStatus ? 48 : 38;
    const mpesaX = (width - mpesaW) / 2;
    const mpesaY = footerY + (isStatus ? 210 : 150);

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
    ctx.stroke();

    ctx.fillStyle = '#451a03';
    ctx.font = `700 ${isStatus ? 17 : 13}px system-ui, -apple-system, sans-serif`;
    const mpesaText = seller.mpesa_till
      ? `Lipa na M-Pesa Buy Goods: ${seller.mpesa_till} • Certified Receipt`
      : 'Lipa na M-Pesa Available • Official Store Dispatch';
    ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));

    return canvas.toDataURL('image/png');
  },

  /**
   * 10. Clearance Starburst Deal Flyer ('clearance_deal')
   */
  async renderClearanceDealPost(product, seller, ratio = 'status', paletteOverride = null) {
    const isStatus = ratio === 'status';
    const width = 1080;
    const height = isStatus ? 1920 : 1350;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const shopName = (seller.shop_name || 'Beauty Bar Kenya').toUpperCase();
    const phone = seller.phone || '0728 222 211';
    const location = seller.location || 'Jamia Mall Shop F47, Nairobi CBD';
    const sizeText = getCategorySizeText(product);
    const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

    const originalPrice = Math.round((Number(product.price || 1500) * 1.35) / 50) * 50;
    const savings = originalPrice - Number(product.price || 0);

    // Deep Retail Crimson Background
    ctx.fillStyle = '#881337';
    ctx.fillRect(0, 0, width, height);

    // Top Sunburst Yellow Clearance Bar
    const topBarH = isStatus ? 60 : 48;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, 0, width, topBarH);

    ctx.fillStyle = '#881337';
    ctx.textAlign = 'center';
    ctx.font = `900 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('🔥 CRAZY CLEARANCE DEAL • BEI YA OFA LEO 🔥', width / 2, isStatus ? 40 : 32);

    // Header Content
    const headerH = isStatus ? 180 : 145;
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 40 : 32}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(shopName, width / 2, isStatus ? 116 : 94);

    ctx.fillStyle = '#fef08a';
    ctx.font = `700 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`CLEARANCE SALE • ${location.toUpperCase()}`, width / 2, isStatus ? 154 : 124);

    // Hero White Box with Bold Red Dashed Border
    const boxX = 60;
    const boxWidth = width - 120;
    const boxY = headerH + (isStatus ? 20 : 12);
    const boxHeight = isStatus ? 1040 : 660;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 28;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 22);
    ctx.fill();
    ctx.restore();

    ctx.setLineDash([14, 10]);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 22);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Top-Left Category Badge
    ctx.font = '900 15px system-ui, -apple-system, sans-serif';
    const catW = Math.max(170, Math.round(ctx.measureText(sizeText).width + 36));
    ctx.fillStyle = '#881337';
    roundRect(ctx, boxX + 22, boxY + 22, catW, 40, 10);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(sizeText, boxX + 22 + catW / 2, boxY + 47);

    // Starburst Hot Deal Badge Top-Right
    const starCx = boxX + boxWidth - 75;
    const starCy = boxY + 75;
    drawStarburst(ctx, starCx, starCy, 14, 60, 42, '#facc15', '#dc2626');

    ctx.fillStyle = '#dc2626';
    ctx.textAlign = 'center';
    ctx.font = '900 17px system-ui, -apple-system, sans-serif';
    ctx.fillText('HOT', starCx, starCy - 6);
    ctx.font = '900 18px system-ui, -apple-system, sans-serif';
    ctx.fillText('DEAL!', starCx, starCy + 14);

    // Hero Image
    const heroImg = await loadProductImage(product, product.photo);
    if (heroImg) {
      const bounds = getProductBounds(heroImg);
      const pad = isStatus ? 40 : 25;
      const maxW = boxWidth - pad * 2;
      const maxH = boxHeight - pad * 2 - 20;
      const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
      const dw = Math.round(bounds.sWidth * scale);
      const dh = Math.round(bounds.sHeight * scale);
      ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
        boxX + Math.round((boxWidth - dw) / 2),
        boxY + 20 + Math.round((boxHeight - 20 - dh) / 2),
        dw, dh);
    }

    // Title & Benefit
    const titleStartY = boxY + boxHeight + (isStatus ? 42 : 30);
    ctx.fillStyle = '#ffffff';
    const titleResult = drawWrappedTitleWithoutTruncation(ctx, product.name, width / 2, titleStartY, boxWidth - 40, isStatus ? 40 : 32, 18);
    const benefitY = titleResult.endY + (isStatus ? 36 : 24);

    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    ctx.font = `800 ${isStatus ? 20 : 16}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`💥 ${product.benefit_line || 'Limited Clearance Stock • First-Come First-Served'}`, width / 2, benefitY);

    // Strikethrough & Giant Price Block
    const offerW = isStatus ? 600 : 500;
    const offerH = isStatus ? 120 : 98;
    const offerX = (width - offerW) / 2;
    const offerY = benefitY + (isStatus ? 26 : 18);

    ctx.fillStyle = '#facc15';
    roundRect(ctx, offerX, offerY, offerW, offerH, 18);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    roundRect(ctx, offerX, offerY, offerW, offerH, 18);
    ctx.stroke();

    // Was Strikethrough
    ctx.fillStyle = '#991b1b';
    ctx.font = `800 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
    const wasText = `WAS: KES ${originalPrice.toLocaleString()}`;
    ctx.fillText(wasText, width / 2 - 120, offerY + (isStatus ? 32 : 26));

    // Strikethrough line
    const wasW = ctx.measureText(wasText).width;
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120 - wasW / 2, offerY + (isStatus ? 27 : 21));
    ctx.lineTo(width / 2 - 120 + wasW / 2, offerY + (isStatus ? 27 : 21));
    ctx.stroke();

    // Save Badge
    ctx.fillStyle = '#dc2626';
    ctx.font = `900 ${isStatus ? 16 : 13}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`YOU SAVE: KES ${savings.toLocaleString()}!`, width / 2 + 120, offerY + (isStatus ? 32 : 26));

    // Giant NOW Price
    ctx.fillStyle = '#881337';
    ctx.font = `900 ${isStatus ? 70 : 54}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`NOW: ${formattedPrice}`, width / 2, offerY + (isStatus ? 92 : 75));

    // Footer
    const footerH = isStatus ? 290 : 250;
    const footerY = height - footerH;

    ctx.fillStyle = '#4c0519';
    ctx.fillRect(0, footerY, width, footerH);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(0, footerY, width, 5);

    ctx.fillStyle = '#facc15';
    ctx.font = `900 ${isStatus ? 22 : 17}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('HURRY! CLAIM ON WHATSAPP BEFORE STOCK CLEARS:', width / 2, footerY + (isStatus ? 48 : 36));

    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${isStatus ? 58 : 44}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(`WhatsApp: ${phone}`, width / 2, footerY + (isStatus ? 116 : 84));

    ctx.fillStyle = '#fef08a';
    ctx.font = `700 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
    ctx.fillText('Same-Day Nairobi Boda Delivery • Parcels Dispatched Daily', width / 2, footerY + (isStatus ? 172 : 124));

    const mpesaW = isStatus ? 760 : 660;
    const mpesaH = isStatus ? 48 : 38;
    const mpesaX = (width - mpesaW) / 2;
    const mpesaY = footerY + (isStatus ? 210 : 150);

    ctx.fillStyle = '#881337';
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${isStatus ? 17 : 13}px system-ui, -apple-system, sans-serif`;
    const mpesaText = seller.mpesa_till
      ? `Lipa na M-Pesa Buy Goods Till: ${seller.mpesa_till} • Grab It Now`
      : 'Lipa na M-Pesa Available • Grab It Before It Sells Out';
    ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));

    return canvas.toDataURL('image/png');
  },

  /**
   * Legacy Style Aliases for Full Backward Compatibility
   */
  async renderPriceFocusStyle(product, seller, ratio) {
    return this.renderUnifiedPost(product, seller, ratio);
  },
  async renderPriceDropStyle(product, seller, ratio) {
    return this.renderFlashSalePost(product, seller, ratio);
  },
  async renderBackInStockStyle(product, seller, ratio) {
    return this.renderRestockAlertPost(product, seller, ratio);
  },
  async renderBenefitFocusStyle(product, seller, ratio) {
    return this.renderCustomerReviewPost(product, seller, ratio);
  },
  async renderSimplePhotoStyle(product, seller, ratio) {
    return this.renderUnifiedPost(product, seller, ratio);
  },
  async renderBundleOfferStyle(product, companionProduct, seller, ratio) {
    return this.renderProductBundlePost(product, companionProduct, seller, ratio);
  },
  async renderMultiAngleStyle(product, seller, ratio) {
    return this.renderUnifiedPost(product, seller, ratio);
  },

  /**
   * Convert Data URL to Blob for sharing
   */
  dataURLToBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
};
