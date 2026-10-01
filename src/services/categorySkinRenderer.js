/**
 * Category-Specific Visual Mood Templates for Kenyan WhatsApp Status & Groups
 * 
 * Delivers distinct, non-repetitive visual personalities across 8 commercial retail categories:
 * 1. Handbags & Bags: 'editorial_maison' — Vogue luxury editorial, deep obsidian/cognac, gold rules, generous negative space.
 * 2. Makeup & Prep: 'gloss_studio' — High-contrast commercial studio, vibrant accent glow, formulation highlights.
 * 3. Lip Care: 'pastel_boutique' — Soft pastel warmth, playful pill badges, hydration focus.
 * 4. Bath & Body: 'botanical_spa' — Fresh spa aesthetics, eucalyptus/sage tones, natural ingredients callout.
 * 5. Skincare & Serums: 'clinical_apothecary' — Lab-clean precision, structured metric grid, dermatological trust markers.
 * 6. Classic Clothes: 'lookbook_atelier' — High-fashion lookbook, prominent size strip (S-XL), bold modern type.
 * 7. Household & Bedding: 'warm_living' — Warm home tones, dimension callout (6x6 FT), delivery trust guarantee.
 */

import { resolveSellerConfig, resolvePalette, ensureBrandFontLoaded, SUPPORTED_BRAND_FONTS } from './configService.js';
import { decodeHtmlEntities } from '../utils/textUtils.js';
import {
  roundRect,
  drawLeftAlignedWrappedTitle,
  drawArchCard,
  drawCircularSeal,
  drawBarcodeGraphic,
  drawWashiTape,
  drawCornerCrosshairs,
  drawScarcityMeter,
  drawSizeSelectorStrip,
  drawSpeechBubble,
  drawStarburst,
  drawEditorialBorder
} from '../utils/canvasDesignHelpers.js';

function loadImage(src, timeoutMs = 7000) {
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
      if (targetSrc !== src) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => finish(fallbackImg);
        fallbackImg.onerror = () => finish(null);
        fallbackImg.src = src;
      } else {
        finish(null);
      }
    };
    img.src = targetSrc;
  });
}

function getProductBounds(img) {
  try {
    const canvas = document.createElement('canvas');
    const sampleW = Math.min(img.width, 320);
    const sampleH = Math.round((img.height * sampleW) / img.width);
    if (!sampleW || !sampleH) return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };

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
        if (!isCornerBg) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (minX >= maxX || minY >= maxY) {
      return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };
    }
    const scaleRatio = img.width / sampleW;
    return {
      sx: Math.round(minX * scaleRatio),
      sy: Math.round(minY * scaleRatio),
      sWidth: Math.round((maxX - minX + 1) * scaleRatio),
      sHeight: Math.round((maxY - minY + 1) * scaleRatio)
    };
  } catch (e) {
    return { sx: 0, sy: 0, sWidth: img.width, sHeight: img.height };
  }
}

/**
 * Defensive title wrapper: wraps title up to 3 lines without clipping or overflowing container
 */
function drawDefensiveTitle(ctx, text, centerX, startY, maxWidth, initialSize = 34, minSize = 18, color = '#ffffff', fontFamily = null) {
  const clean = decodeHtmlEntities(String(text || '').trim());
  if (!clean) return { endY: startY, totalHeight: 0 };

  const fam = fontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  let size = initialSize;
  let lines = [];
  const words = clean.split(/\s+/);

  while (size >= minSize) {
    ctx.font = `900 ${size}px ${fam}`;
    lines = [];
    let currentLine = words[0] || '';
    for (let i = 1; i < words.length; i++) {
      const test = currentLine + ' ' + words[i];
      if (ctx.measureText(test).width <= maxWidth) {
        currentLine = test;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
    if (lines.length <= 2) break;
    size -= 2;
  }

  while (lines.length > 2 && size > 14) {
    size -= 2;
    ctx.font = `900 ${size}px ${fam}`;
    lines = [];
    let currentLine = words[0] || '';
    for (let i = 1; i < words.length; i++) {
      const test = currentLine + ' ' + words[i];
      if (ctx.measureText(test).width <= maxWidth) {
        currentLine = test;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);
  }

  if (lines.length > 3) {
    lines = lines.slice(0, 3);
  }

  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.font = `900 ${size}px ${fam}`;
  const lineHeight = Math.round(size * 1.25);
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });

  return {
    fontSize: size,
    linesCount: lines.length,
    totalHeight: lines.length * lineHeight,
    endY: startY + (lines.length - 1) * lineHeight
  };
}

/**
 * Defensive benefit line: auto-shrinks long benefit text and prevents canvas edge overflow
 */
function drawDefensiveBenefit(ctx, text, centerX, y, maxWidth, initialSize = 20, minSize = 13, color = '#d4af37', fontFamily = null) {
  const clean = decodeHtmlEntities(String(text || '').trim());
  if (!clean) return y;

  const fam = fontFamily || 'system-ui, -apple-system, sans-serif';
  let size = initialSize;
  ctx.font = `600 ${size}px ${fam}`;

  while (ctx.measureText(clean).width > maxWidth && size > minSize) {
    size -= 1;
    ctx.font = `600 ${size}px ${fam}`;
  }

  let finalStr = clean;
  if (ctx.measureText(finalStr).width > maxWidth) {
    while (finalStr.length > 12 && ctx.measureText(finalStr + '...').width > maxWidth) {
      finalStr = finalStr.slice(0, -3).trim();
    }
    finalStr = finalStr + '...';
  }

  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.font = `600 ${size}px ${fam}`;
  ctx.fillText(finalStr, centerX, y);
  return y;
}

/**
 * Shared Authentic Footer: Shop Contact, M-Pesa Till & Delivery Guarantee
 */
function drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, palette, ctaHeader = 'ORDER ON WHATSAPP:') {
  const footerY = height - footerH;

  ctx.fillStyle = palette.mpesaBg || '#080c14';
  ctx.fillRect(0, footerY, width, footerH);

  // Accent divider line
  ctx.fillStyle = palette.accent;
  ctx.fillRect(0, footerY, width, 4);

  // CTA Prompt
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = `800 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(ctaHeader, width / 2, footerY + (isStatus ? 44 : 32));

  // WhatsApp Phone Number
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 54 : 40}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`WhatsApp: ${config.phone}`, width / 2, footerY + (isStatus ? 104 : 76));

  // Delivery badge
  ctx.fillStyle = palette.footerSubtext || '#94a3b8';
  ctx.font = `600 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.delivery_info || 'Same-Day Nairobi • Countrywide Dispatch', width / 2, footerY + (isStatus ? 156 : 112));

  // M-Pesa Till Container
  const mpesaW = isStatus ? 760 : 660;
  const mpesaH = isStatus ? 48 : 38;
  const mpesaX = (width - mpesaW) / 2;
  const mpesaY = footerY + (isStatus ? 192 : 138);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 12);
  ctx.fill();

  ctx.strokeStyle = palette.mpesaBorder || palette.accent;
  ctx.lineWidth = 1.5;
  roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 12);
  ctx.stroke();

  ctx.fillStyle = '#fef3c7';
  ctx.font = `700 ${isStatus ? 17 : 13}px system-ui, -apple-system, sans-serif`;
  const mpesaText = config.mpesa_till
    ? `Lipa na M-Pesa Buy Goods: ${config.mpesa_till} • Certified Payment`
    : 'Lipa na M-Pesa Certified • Fast Dispatch';
  ctx.fillText(mpesaText, width / 2, mpesaY + (isStatus ? 30 : 24));
}

// -------------------------------------------------------------------------
// 1. HANDBAGS & LUXURY BAGS: The Editorial Maison
// -------------------------------------------------------------------------
async function renderEditorialMaison(product, seller, ratio = 'status', paletteOverride = null) {
  const isStatus = ratio === 'status';
  const width = 1080;
  const height = isStatus ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const config = resolveSellerConfig(seller);
  const palette = resolvePalette(config, paletteOverride);
  const fontFam = SUPPORTED_BRAND_FONTS[config.brand_font]?.cssFamily || '"Playfair Display", Georgia, serif';
  const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

  // Noir Obsidian Background
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, width, height);

  // Double Editorial Margin Frame with Corner Accents
  drawEditorialBorder(ctx, width, height, isStatus ? 30 : 20, '#d4af37', true);

  // Editorial Masthead
  const headerH = isStatus ? 175 : 135;
  ctx.fillStyle = '#d4af37';
  ctx.textAlign = 'center';
  ctx.font = `700 ${isStatus ? 15 : 12}px ${fontFam}`;
  ctx.fillText('—  V O G U E   M A I S O N   E D I T  —', width / 2, isStatus ? 72 : 56);

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 38 : 30}px ${fontFam}`;
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 120 : 96);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 154 : 124);

  // Hero Museum Card
  const boxX = 65;
  const boxWidth = width - 130;
  const boxY = headerH + (isStatus ? 20 : 12);
  const boxHeight = isStatus ? 900 : 540;

  ctx.fillStyle = '#141419';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 20);
  ctx.stroke();

  // Top-left Leather / Material Pill
  const materialBadge = product.badge || 'HANDBAG ESSENTIAL';
  ctx.font = `700 13px ${fontFam}`;
  const badgeW = Math.max(160, Math.round(ctx.measureText(materialBadge).width + 36));
  ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
  roundRect(ctx, boxX + 22, boxY + 20, badgeW, 36, 10);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 22, boxY + 20, badgeW, 36, 10);
  ctx.stroke();
  ctx.fillStyle = '#fef3c7';
  ctx.textAlign = 'center';
  ctx.fillText(materialBadge, boxX + 22 + badgeW / 2, boxY + 43);

  // Hero Image with warm center glow
  const heroImg = await loadImage(product.photo || product.image_url);
  const cx = boxX + boxWidth / 2;
  const cy = boxY + boxHeight / 2;
  const aura = ctx.createRadialGradient(cx, cy, 30, cx, cy, boxWidth * 0.4);
  aura.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
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

  // Floating Circular Gold Wax Seal in Top-Right
  drawCircularSeal(ctx, boxX + boxWidth - 75, boxY + 75, isStatus ? 58 : 46, '#d4af37', '#0a0a0c', 'PARISIAN EDIT', '100%', 'AUTHENTIC');

  // 3. Editorial Split Bottom Layout
  // Left: Vertical Gold Bar + Left-Aligned Title + Subtitle | Right: Gold Ingot Price Plaque
  const splitY = boxY + boxHeight + (isStatus ? 36 : 24);
  const ingotW = isStatus ? 320 : 270;
  const ingotH = isStatus ? 150 : 120;
  const ingotX = boxX + boxWidth - ingotW;
  const leftTextW = ingotX - boxX - (isStatus ? 36 : 24);

  // Left Column: Vertical Gold Accent Bar + Title
  const titleResult = drawLeftAlignedWrappedTitle(ctx, product.name, boxX + 22, splitY, leftTextW, isStatus ? 34 : 26, 18, '#ffffff', fontFam);
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(boxX, splitY - 2, 4.5, Math.max(34, titleResult.totalHeight + 6));

  // Left Column: Subtitle
  const benefitY = titleResult.endY + (isStatus ? 30 : 20);
  ctx.fillStyle = '#d4af37';
  ctx.font = `600 ${isStatus ? 17 : 14}px ${fontFam}`;
  ctx.textAlign = 'left';
  ctx.fillText(`✦ ${product.benefit_line || 'Handcrafted Luxury • Structured Silhouette'} ✦`.slice(0, 42), boxX + 22, benefitY);

  // Right Column: Gold Ingot Price Plaque
  ctx.save();
  ctx.fillStyle = '#141419';
  ctx.shadowColor = 'rgba(212, 175, 55, 0.22)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, ingotX, splitY - 8, ingotW, ingotH, 18);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2.5;
  roundRect(ctx, ingotX, splitY - 8, ingotW, ingotH, 18);
  ctx.stroke();

  ctx.fillStyle = '#d4af37';
  ctx.textAlign = 'center';
  ctx.font = `700 ${isStatus ? 13 : 11}px ${fontFam}`;
  ctx.fillText('—  CURATED BOUTIQUE  —', ingotX + ingotW / 2, splitY + (isStatus ? 28 : 22));

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 48 : 38}px ${fontFam}`;
  ctx.fillText(formattedPrice, ingotX + ingotW / 2, splitY + (isStatus ? 82 : 64));

  ctx.fillStyle = '#fef3c7';
  ctx.font = `600 ${isStatus ? 12 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('VIP CONCIERGE PACKAGING', ingotX + ingotW / 2, splitY + (isStatus ? 122 : 98));

  // Authentic Footer
  const footerH = isStatus ? 270 : 220;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, palette, 'CLAIM THIS HANDBAG ON WHATSAPP:');

  return canvas.toDataURL('image/png');
}

// -------------------------------------------------------------------------
// 2. MAKEUP & PREP: High-Gloss Studio
// -------------------------------------------------------------------------
async function renderGlossStudio(product, seller, ratio = 'status', paletteOverride = null) {
  const isStatus = ratio === 'status';
  const width = 1080;
  const height = isStatus ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const config = resolveSellerConfig(seller);
  const palette = resolvePalette(config, paletteOverride);
  const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

  // Deep High-Contrast Studio Background
  ctx.fillStyle = '#09090e';
  ctx.fillRect(0, 0, width, height);

  // Top Neon Edge Bar
  ctx.fillStyle = palette.primary || '#ec4899';
  ctx.fillRect(0, 0, width, 6);

  // Header
  const headerH = isStatus ? 165 : 130;
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = '900 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('GLOSS STUDIO // BEAUTY COUNTER RELEASE', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 98 : 78);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 134 : 108);

  // Hero Card with Gloss Framing
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 20 : 14);
  const boxHeight = isStatus ? 900 : 540;

  ctx.fillStyle = '#12121c';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 24);
  ctx.fill();

  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2.5;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 24);
  ctx.stroke();

  // Top Formulation Pill
  const formulationBadge = product.badge || 'PRO FORMULA';
  ctx.fillStyle = palette.accent;
  roundRect(ctx, boxX + 22, boxY + 20, 190, 38, 12);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = '900 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(formulationBadge.toUpperCase(), boxX + 22 + 95, boxY + 44);

  // Top-Right Floating Starburst Promo Badge
  const starCx = boxX + boxWidth - 75;
  const starCy = boxY + 75;
  drawStarburst(ctx, starCx, starCy, 12, isStatus ? 64 : 50, isStatus ? 48 : 38, palette.primary || '#ec4899', '#ffffff');
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = `900 ${isStatus ? 13 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('PRO GLOSS', starCx, starCy - (isStatus ? 5 : 4));
  ctx.fillText('HD FINISH', starCx, starCy + (isStatus ? 11 : 9));

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const pad = isStatus ? 35 : 20;
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

  // 3. High-Gloss Commercial Split Bottom Layout
  const splitY = boxY + boxHeight + (isStatus ? 34 : 22);
  const rightStampW = isStatus ? 320 : 270;
  const rightStampH = isStatus ? 150 : 120;
  const rightStampX = boxX + boxWidth - rightStampW;
  const leftColW = rightStampX - boxX - (isStatus ? 30 : 20);

  // Left Column: Title
  const titleResult = drawLeftAlignedWrappedTitle(ctx, product.name, boxX, splitY, leftColW, isStatus ? 36 : 28, 18, '#ffffff');

  // Left Column: Underline Rule
  ctx.fillStyle = palette.primary || '#ec4899';
  ctx.fillRect(boxX, titleResult.endY + (isStatus ? 12 : 8), Math.min(leftColW, 180), 3.5);

  // Left Column: Benefit Line
  const benefitY = titleResult.endY + (isStatus ? 34 : 24);
  ctx.fillStyle = palette.accent;
  ctx.font = `700 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`✔ ${product.benefit_line || 'All-Day High Performance • Flawless Smooth Finish'}`.slice(0, 42), boxX, benefitY);

  // Right Column: Neon Gloss Price Ingot
  ctx.save();
  ctx.fillStyle = '#181826';
  ctx.shadowColor = palette.primary || '#ec4899';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, rightStampX, splitY - 6, rightStampW, rightStampH, 18);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2.5;
  roundRect(ctx, rightStampX, splitY - 6, rightStampW, rightStampH, 18);
  ctx.stroke();

  ctx.fillStyle = palette.accent;
  ctx.font = `900 ${isStatus ? 13 : 11}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('SPECIAL STUDIO OFFER', rightStampX + rightStampW / 2, splitY + (isStatus ? 26 : 20));

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 48 : 38}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(formattedPrice, rightStampX + rightStampW / 2, splitY + (isStatus ? 78 : 62));

  ctx.fillStyle = palette.primary || '#ec4899';
  ctx.font = `800 ${isStatus ? 12 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('● READY FOR PICKUP', rightStampX + rightStampW / 2, splitY + (isStatus ? 118 : 94));

  // Authentic Footer
  const footerH = isStatus ? 270 : 220;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, palette, 'ORDER THIS MAKEUP SHADE ON WHATSAPP:');

  return canvas.toDataURL('image/png');
}

// -------------------------------------------------------------------------
// 3. LIP CARE: Soft Warm Pastel Boutique
// -------------------------------------------------------------------------
async function renderPastelBoutique(product, seller, ratio = 'status', paletteOverride = null) {
  const isStatus = ratio === 'status';
  const width = 1080;
  const height = isStatus ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const config = resolveSellerConfig(seller);
  const palette = resolvePalette(config, paletteOverride);
  const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

  // Soft Warm Pastel Blush Canvas
  ctx.fillStyle = '#fdf4f5';
  ctx.fillRect(0, 0, width, height);

  // Pastel Border Frame
  ctx.strokeStyle = '#fbcfe8';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, width - 10, height - 10);

  // Boutique Header
  const headerH = isStatus ? 165 : 130;
  ctx.fillStyle = '#be185d';
  ctx.textAlign = 'center';
  ctx.font = '800 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('🌸 NOURISHING LIP THERAPY & TINTS 🌸', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#831843';
  ctx.font = '900 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 96 : 76);

  ctx.fillStyle = '#9d174d';
  ctx.font = '600 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 132 : 106);

  // Hero Card: Architectural Roman Arch Window
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 20 : 14);
  const boxHeight = isStatus ? 900 : 540;

  drawArchCard(ctx, boxX, boxY, boxWidth, boxHeight, 28, '#ffffff', '#f472b6', 2.5);

  // Top-Left Hydration Pill
  ctx.fillStyle = '#fdf2f8';
  roundRect(ctx, boxX + 22, boxY + 30, 200, 38, 12);
  ctx.fill();
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 22, boxY + 30, 200, 38, 12);
  ctx.stroke();
  ctx.fillStyle = '#be185d';
  ctx.font = '900 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('✨ HYDRATION HERO', boxX + 22 + 100, boxY + 54);

  // Top-Right Floating Circular Hydration Seal
  drawCircularSeal(ctx, boxX + boxWidth - 80, boxY + 110, isStatus ? 58 : 46, '#be185d', '#fdf2f8', 'HYDRATION', '100%', 'LIP THERAPY');

  // Hero Image centered inside Arch Card
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const pad = isStatus ? 40 : 25;
    const maxW = boxWidth - pad * 2;
    const maxH = boxHeight - pad * 2 - 30;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 35 + Math.round((boxHeight - 35 - dh) / 2),
      dw, dh);
  }

  // 3. Asymmetric Boutique Split Bottom Layout
  const splitY = boxY + boxHeight + (isStatus ? 34 : 22);
  const rightStampW = isStatus ? 320 : 270;
  const rightStampH = isStatus ? 150 : 120;
  const rightStampX = boxX + boxWidth - rightStampW;
  const leftColW = rightStampX - boxX - (isStatus ? 30 : 20);

  // Left Column: Title
  const titleResult = drawLeftAlignedWrappedTitle(ctx, product.name, boxX, splitY, leftColW, isStatus ? 34 : 26, 18, '#831843');

  // Left Column: Benefit Line
  const benefitY = titleResult.endY + (isStatus ? 30 : 20);
  ctx.fillStyle = '#be185d';
  ctx.font = `700 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`🌸 ${product.benefit_line || 'Moisture Lock • Plump, Healthy & Tinted Shine'}`.slice(0, 42), boxX, benefitY);

  // Right Column: Berry Pastel Price Ingot
  ctx.save();
  ctx.fillStyle = '#831843';
  ctx.shadowColor = 'rgba(131, 24, 67, 0.25)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 20);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 2.5;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 20);
  ctx.stroke();

  ctx.fillStyle = '#fbcfe8';
  ctx.font = `800 ${isStatus ? 13 : 11}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('EXCLUSIVE LIP SPECIAL', rightStampX + rightStampW / 2, splitY + (isStatus ? 28 : 22));

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 48 : 38}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(formattedPrice, rightStampX + rightStampW / 2, splitY + (isStatus ? 80 : 64));

  ctx.fillStyle = '#fbcfe8';
  ctx.font = `700 ${isStatus ? 12 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('● IN STOCK NOW', rightStampX + rightStampW / 2, splitY + (isStatus ? 120 : 96));

  // Authentic Footer
  const footerH = isStatus ? 270 : 220;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, { ...palette, mpesaBg: '#831843', accent: '#f472b6' }, 'CLAIM THIS LIP BALM ON WHATSAPP:');

  return canvas.toDataURL('image/png');
}

// -------------------------------------------------------------------------
// 4. BATH & BODY: Botanical Spa Retreat
// -------------------------------------------------------------------------
async function renderBotanicalSpa(product, seller, ratio = 'status', paletteOverride = null) {
  const isStatus = ratio === 'status';
  const width = 1080;
  const height = isStatus ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const config = resolveSellerConfig(seller);
  const palette = resolvePalette(config, paletteOverride);
  const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

  // Calming Eucalyptus Sage Green Background
  ctx.fillStyle = '#f0fdf4';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#bbf7d0';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  // Spa Header
  const headerH = isStatus ? 165 : 130;
  ctx.fillStyle = '#15803d';
  ctx.textAlign = 'center';
  ctx.font = '800 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('🌿 BOTANICAL SPA & BODY RETREAT 🌿', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#14532d';
  ctx.font = '900 36px "Cinzel", Georgia, serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 96 : 76);

  ctx.fillStyle = '#166534';
  ctx.font = '600 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 132 : 106);

  // Hero Card: Botanical Roman Arch Window
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 20 : 14);
  const boxHeight = isStatus ? 900 : 540;

  drawArchCard(ctx, boxX, boxY, boxWidth, boxHeight, 28, '#ffffff', '#86efac', 2.5);

  // Top-Left Natural Extracts Pill
  ctx.fillStyle = '#dcfce7';
  roundRect(ctx, boxX + 22, boxY + 30, 210, 38, 12);
  ctx.fill();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 22, boxY + 30, 210, 38, 12);
  ctx.stroke();
  ctx.fillStyle = '#15803d';
  ctx.font = '900 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('NATURAL EXTRACTS', boxX + 22 + 105, boxY + 54);

  // Top-Right Floating Circular Botanical Seal
  drawCircularSeal(ctx, boxX + boxWidth - 80, boxY + 110, isStatus ? 58 : 46, '#15803d', '#f0fdf4', 'ORGANIC SPA', '100%', 'NATURAL');

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const pad = isStatus ? 40 : 25;
    const maxW = boxWidth - pad * 2;
    const maxH = boxHeight - pad * 2 - 30;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 35 + Math.round((boxHeight - 35 - dh) / 2),
      dw, dh);
  }

  // 3. Asymmetric Spa Split Bottom Layout
  const splitY = boxY + boxHeight + (isStatus ? 34 : 22);
  const rightStampW = isStatus ? 320 : 270;
  const rightStampH = isStatus ? 150 : 120;
  const rightStampX = boxX + boxWidth - rightStampW;
  const leftColW = rightStampX - boxX - (isStatus ? 30 : 20);

  // Left Column: Title
  const titleResult = drawLeftAlignedWrappedTitle(ctx, product.name, boxX, splitY, leftColW, isStatus ? 34 : 26, 18, '#14532d', '"Cinzel", Georgia, serif');

  // Left Column: Benefit Line
  const benefitY = titleResult.endY + (isStatus ? 30 : 20);
  ctx.fillStyle = '#15803d';
  ctx.font = `700 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`🌿 ${product.benefit_line || 'Deep Skin Nourishment • Pure Botanical Aromatherapy'}`.slice(0, 42), boxX, benefitY);

  // Right Column: Forest Green Spa Price Ingot
  ctx.save();
  ctx.fillStyle = '#14532d';
  ctx.shadowColor = 'rgba(20, 83, 45, 0.25)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 18);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#4ade80';
  ctx.lineWidth = 2.5;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 18);
  ctx.stroke();

  ctx.fillStyle = '#86efac';
  ctx.font = `800 ${isStatus ? 13 : 11}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('SPA PRIVILEGE PRICE', rightStampX + rightStampW / 2, splitY + (isStatus ? 28 : 22));

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 48 : 38}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(formattedPrice, rightStampX + rightStampW / 2, splitY + (isStatus ? 80 : 64));

  ctx.fillStyle = '#86efac';
  ctx.font = `700 ${isStatus ? 12 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('● FRESH STOCK NOW', rightStampX + rightStampW / 2, splitY + (isStatus ? 120 : 96));

  // Authentic Footer
  const footerH = isStatus ? 270 : 220;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, { ...palette, mpesaBg: '#14532d', accent: '#4ade80' }, 'ORDER THIS SPA ESSENTIAL ON WHATSAPP:');

  return canvas.toDataURL('image/png');
}

// -------------------------------------------------------------------------
// 5. SKINCARE & SERUMS: Clinical Apothecary
// -------------------------------------------------------------------------
async function renderClinicalApothecary(product, seller, ratio = 'status', paletteOverride = null) {
  const isStatus = ratio === 'status';
  const width = 1080;
  const height = isStatus ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const config = resolveSellerConfig(seller);
  const palette = resolvePalette(config, paletteOverride);
  const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

  // Crisp Clinical White/Ice Slate Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, width - 10, height - 10);

  // Technical Header
  const headerH = isStatus ? 165 : 130;
  ctx.fillStyle = '#0284c7';
  ctx.textAlign = 'center';
  ctx.font = '800 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('🔬 CLINICAL DERMATOLOGICAL SCIENCE 🔬', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 96 : 76);

  ctx.fillStyle = '#475569';
  ctx.font = '600 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 132 : 106);

  // Hero Card
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 20 : 14);
  const boxHeight = isStatus ? 860 : 500;

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 20);
  ctx.fill();

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 20);
  ctx.stroke();

  // Corner Crosshairs on Image Box
  drawCornerCrosshairs(ctx, boxX, boxY, boxWidth, boxHeight, 18, '#0284c7');

  // Active Ingredient Tag
  const activeBadge = product.badge || 'ACTIVE CONCENTRATE';
  ctx.fillStyle = '#e0f2fe';
  roundRect(ctx, boxX + 22, boxY + 20, 210, 38, 10);
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 22, boxY + 20, 210, 38, 10);
  ctx.stroke();
  ctx.fillStyle = '#0369a1';
  ctx.font = '900 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(activeBadge.toUpperCase(), boxX + 22 + 105, boxY + 44);

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const pad = isStatus ? 35 : 20;
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

  // 3-Metric Clinical Specification Grid
  const gridY = boxY + boxHeight + (isStatus ? 20 : 14);
  const gridH = isStatus ? 48 : 36;
  const colGap = 12;
  const colW = Math.round((boxWidth - colGap * 2) / 3);

  const metrics = [
    { label: '100% PURE ACTIVE', icon: '🧪' },
    { label: 'BARRIER RESTORE', icon: '🛡️' },
    { label: 'DERMA TESTED', icon: '🔬' }
  ];

  metrics.forEach((m, idx) => {
    const colX = boxX + idx * (colW + colGap);
    ctx.fillStyle = '#f1f5f9';
    roundRect(ctx, colX, gridY, colW, gridH, 10);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    roundRect(ctx, colX, gridY, colW, gridH, 10);
    ctx.stroke();

    ctx.fillStyle = '#0369a1';
    ctx.font = `800 ${isStatus ? 13 : 10}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${m.icon} ${m.label}`, colX + colW / 2, gridY + gridH / 2 + (isStatus ? 5 : 4));
  });

  // 3. Asymmetric Clinical Split Bottom Layout
  const splitY = gridY + gridH + (isStatus ? 26 : 18);
  const rightStampW = isStatus ? 320 : 270;
  const rightStampH = isStatus ? 145 : 115;
  const rightStampX = boxX + boxWidth - rightStampW;
  const leftColW = rightStampX - boxX - (isStatus ? 30 : 20);

  // Left Column: Title
  const titleResult = drawLeftAlignedWrappedTitle(ctx, product.name, boxX, splitY, leftColW, isStatus ? 34 : 26, 18, '#0f172a');

  // Left Column: Clinical Benefit
  const benefitY = titleResult.endY + (isStatus ? 28 : 18);
  ctx.fillStyle = '#0284c7';
  ctx.font = `700 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`✔ ${product.benefit_line || 'Tested Efficacy • Barrier Repair & Active Restoration'}`.slice(0, 42), boxX, benefitY);

  // Right Column: Clinical Price Capsule
  ctx.save();
  ctx.fillStyle = '#0f172a';
  ctx.shadowColor = 'rgba(2, 132, 199, 0.25)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 16);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 16);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = `800 ${isStatus ? 13 : 11}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('CLINICAL RX FORMULA', rightStampX + rightStampW / 2, splitY + (isStatus ? 26 : 20));

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 48 : 38}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(formattedPrice, rightStampX + rightStampW / 2, splitY + (isStatus ? 78 : 62));

  ctx.fillStyle = '#38bdf8';
  ctx.font = `700 ${isStatus ? 12 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('● LAB CERTIFIED GENUINE', rightStampX + rightStampW / 2, splitY + (isStatus ? 116 : 92));

  // Authentic Footer
  const footerH = isStatus ? 270 : 220;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, { ...palette, mpesaBg: '#0f172a', accent: '#38bdf8' }, 'ORDER THIS CLINICAL FORMULA ON WHATSAPP:');

  return canvas.toDataURL('image/png');
}

// -------------------------------------------------------------------------
// 6. CLASSIC CLOTHES: Lookbook Atelier
// -------------------------------------------------------------------------
async function renderLookbookAtelier(product, seller, ratio = 'status', paletteOverride = null) {
  const isStatus = ratio === 'status';
  const width = 1080;
  const height = isStatus ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const config = resolveSellerConfig(seller);
  const palette = resolvePalette(config, paletteOverride);
  const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

  // Neutral Atelier Background
  ctx.fillStyle = '#18181b';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Header
  const headerH = isStatus ? 165 : 130;
  ctx.fillStyle = '#e4e4e7';
  ctx.textAlign = 'center';
  ctx.font = '800 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('ATELIER RUNWAY LOOKBOOK // NEW DROP', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 96 : 76);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 132 : 106);

  // Left-Rail Vertical Running Spine Typography
  ctx.save();
  ctx.translate(26, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#71717a';
  ctx.font = '800 13px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('// ATELIER RUNWAY // NAIROBI EDITION // VOL. 26 //', 0, 0);
  ctx.restore();

  // Hero Card
  const boxX = 65;
  const boxWidth = width - 125;
  const boxY = headerH + (isStatus ? 20 : 14);
  const boxHeight = isStatus ? 860 : 500;

  ctx.fillStyle = '#27272a';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 18);
  ctx.fill();

  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 2;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 18);
  ctx.stroke();

  // Corner Crosshairs on Lookbook Card
  drawCornerCrosshairs(ctx, boxX, boxY, boxWidth, boxHeight, 18, '#e4e4e7');

  // Top Category Pill
  ctx.fillStyle = '#3f3f46';
  roundRect(ctx, boxX + 22, boxY + 20, 200, 38, 10);
  ctx.fill();
  ctx.fillStyle = '#fafafa';
  ctx.font = '900 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RUNWAY APPAREL', boxX + 22 + 100, boxY + 44);

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const pad = isStatus ? 35 : 20;
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

  // Horizontal Size Selector Strip
  const sizeStripY = boxY + boxHeight + (isStatus ? 20 : 14);
  const sizeStripH = isStatus ? 48 : 36;
  const parsedSize = String(product.size || product.sizes || 'M').toUpperCase();
  drawSizeSelectorStrip(ctx, boxX, sizeStripY, boxWidth, sizeStripH, ['S', 'M', 'L', 'XL', 'XXL'], parsedSize, '#e4e4e7', '#27272a', '#ffffff', '#09090b');

  // 3. Asymmetric Fashion Split Bottom Layout
  const splitY = sizeStripY + sizeStripH + (isStatus ? 26 : 18);
  const rightStampW = isStatus ? 320 : 270;
  const rightStampH = isStatus ? 145 : 115;
  const rightStampX = boxX + boxWidth - rightStampW;
  const leftColW = rightStampX - boxX - (isStatus ? 30 : 20);

  // Left Column: Title
  const titleResult = drawLeftAlignedWrappedTitle(ctx, product.name, boxX, splitY, leftColW, isStatus ? 36 : 28, 18, '#ffffff');

  // Left Column: Benefit Line
  const benefitY = titleResult.endY + (isStatus ? 28 : 18);
  ctx.fillStyle = '#a1a1aa';
  ctx.font = `700 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`⚡ ${product.benefit_line || 'Premium Fabric • Tailored Elegant Silhouette'}`.slice(0, 42), boxX, benefitY);

  // Right Column: Atelier Price Ingot with Vector Barcode
  ctx.save();
  ctx.fillStyle = '#09090b';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.12)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 16);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 2.5;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 16);
  ctx.stroke();

  ctx.fillStyle = '#a1a1aa';
  ctx.font = `800 ${isStatus ? 13 : 11}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('EXCLUSIVE ATELIER DROP', rightStampX + rightStampW / 2, splitY + (isStatus ? 26 : 20));

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 48 : 38}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(formattedPrice, rightStampX + rightStampW / 2, splitY + (isStatus ? 78 : 62));

  ctx.fillStyle = '#e4e4e7';
  ctx.font = `700 ${isStatus ? 12 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('● IN STOCK FOR COURIER', rightStampX + rightStampW / 2, splitY + (isStatus ? 116 : 92));

  // Authentic Footer
  const footerH = isStatus ? 270 : 220;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, { ...palette, mpesaBg: '#09090b', accent: '#e4e4e7' }, 'INQUIRE OR ORDER ON WHATSAPP:');

  return canvas.toDataURL('image/png');
}

// -------------------------------------------------------------------------
// 7. HOUSEHOLD & BEDDING / KITCHEN: Warm Living
// -------------------------------------------------------------------------
async function renderWarmLiving(product, seller, ratio = 'status', paletteOverride = null) {
  const isStatus = ratio === 'status';
  const width = 1080;
  const height = isStatus ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const config = resolveSellerConfig(seller);
  const palette = resolvePalette(config, paletteOverride);
  const formattedPrice = `KES ${Number(product.price || 0).toLocaleString()}`;

  // Warm Cozy Beige Background
  ctx.fillStyle = '#fbf8f5';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#e7e0d8';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  // Practical Header
  const headerH = isStatus ? 165 : 130;
  ctx.fillStyle = '#9a3412';
  ctx.textAlign = 'center';
  ctx.font = '800 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('🏡 WARM LIVING & HOME ESSENTIALS 🏡', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#431407';
  ctx.font = '900 36px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 96 : 76);

  ctx.fillStyle = '#7c2d12';
  ctx.font = '600 15px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 132 : 106);

  // Hero Card with Cozy Frame
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 20 : 14);
  const boxHeight = isStatus ? 900 : 540;

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 22);
  ctx.fill();

  ctx.strokeStyle = '#fed7aa';
  ctx.lineWidth = 2.5;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 22);
  ctx.stroke();

  // Authentic Washi Tape at Top-Center of Card
  drawWashiTape(ctx, width / 2, boxY, isStatus ? 200 : 160, 36, -0.02, 'rgba(254, 215, 170, 0.92)', 'rgba(234, 88, 12, 0.45)');

  // Home Dimension/Quality Tag
  const dimensionBadge = product.size || product.badge || 'HOME ESSENTIAL';
  ctx.fillStyle = '#ffedd5';
  roundRect(ctx, boxX + 22, boxY + 22, 220, 38, 12);
  ctx.fill();
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 22, boxY + 22, 220, 38, 12);
  ctx.stroke();
  ctx.fillStyle = '#c2410c';
  ctx.font = '900 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(String(dimensionBadge).toUpperCase(), boxX + 22 + 110, boxY + 46);

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const pad = isStatus ? 35 : 20;
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

  // 3. Asymmetric Warm Home Split Bottom Layout
  const splitY = boxY + boxHeight + (isStatus ? 34 : 22);
  const rightStampW = isStatus ? 320 : 270;
  const rightStampH = isStatus ? 150 : 120;
  const rightStampX = boxX + boxWidth - rightStampW;
  const leftColW = rightStampX - boxX - (isStatus ? 30 : 20);

  // Left Column: Title
  const titleResult = drawLeftAlignedWrappedTitle(ctx, product.name, boxX, splitY, leftColW, isStatus ? 34 : 26, 18, '#431407');

  // Left Column: Benefit Line
  const benefitY = titleResult.endY + (isStatus ? 30 : 20);
  ctx.fillStyle = '#9a3412';
  ctx.font = `700 ${isStatus ? 17 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(`🏡 ${product.benefit_line || 'Durable Comfort • Easy Maintenance & Lasting Value'}`.slice(0, 42), boxX, benefitY);

  // Right Column: Warm Terracotta Price Ingot
  ctx.save();
  ctx.fillStyle = '#431407';
  ctx.shadowColor = 'rgba(67, 20, 7, 0.25)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 18);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2.5;
  roundRect(ctx, rightStampX, splitY - 4, rightStampW, rightStampH, 18);
  ctx.stroke();

  ctx.fillStyle = '#fed7aa';
  ctx.font = `800 ${isStatus ? 13 : 11}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('HOME DISPATCH PRICE', rightStampX + rightStampW / 2, splitY + (isStatus ? 28 : 22));

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 48 : 38}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(formattedPrice, rightStampX + rightStampW / 2, splitY + (isStatus ? 80 : 64));

  ctx.fillStyle = '#fed7aa';
  ctx.font = `700 ${isStatus ? 12 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('● READY FOR DELIVERY', rightStampX + rightStampW / 2, splitY + (isStatus ? 120 : 96));

  // Authentic Footer
  const footerH = isStatus ? 270 : 220;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, { ...palette, mpesaBg: '#431407', accent: '#f97316' }, 'ORDER THIS HOME PIECE ON WHATSAPP:');

  return canvas.toDataURL('image/png');
}

/**
 * Intelligent Category Skin Resolver
 */
export function detectCategorySkin(category) {
  const cat = String(category || '').toLowerCase();
  if (cat.includes('bag') || cat.includes('handbag') || cat.includes('tote') || cat.includes('purse')) {
    return 'editorial_maison';
  }
  if (cat.includes('lip') || cat.includes('balm') || cat.includes('gloss')) {
    return 'pastel_boutique';
  }
  if (cat.includes('makeup') || cat.includes('prep') || cat.includes('foundation') || cat.includes('mascara') || cat.includes('powder') || cat.includes('primer')) {
    return 'gloss_studio';
  }
  if (cat.includes('bath') || cat.includes('body') || cat.includes('wash') || cat.includes('mist') || cat.includes('scrub')) {
    return 'botanical_spa';
  }
  if (cat.includes('serum') || cat.includes('active') || cat.includes('retinol') || cat.includes('niacinamide')) {
    return 'clinical_apothecary';
  }
  if (cat.includes('skin') || cat.includes('face') || cat.includes('cream') || cat.includes('sunscreen') || cat.includes('spf')) {
    return 'clinical_apothecary';
  }
  if (cat.includes('cloth') || cat.includes('fashion') || cat.includes('dress') || cat.includes('pant') || cat.includes('wear')) {
    return 'lookbook_atelier';
  }
  if (cat.includes('household') || cat.includes('bedding') || cat.includes('kitchen') || cat.includes('home') || cat.includes('carpet')) {
    return 'warm_living';
  }
  return null;
}

export const CATEGORY_SKIN_RENDERERS = {
  editorial_maison: renderEditorialMaison,
  gloss_studio: renderGlossStudio,
  pastel_boutique: renderPastelBoutique,
  botanical_spa: renderBotanicalSpa,
  clinical_apothecary: renderClinicalApothecary,
  lookbook_atelier: renderLookbookAtelier,
  warm_living: renderWarmLiving
};
