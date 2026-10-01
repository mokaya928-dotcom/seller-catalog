/**
 * Category-Specific Visual Mood Templates for Kenyan WhatsApp Status & Groups
 * 
 * Delivers distinct, non-repetitive visual personalities across 8 commercial retail categories
 * all conforming to the unified high-converting architecture:
 * - One dominant hero card (960x1080 for Status, 960x680 for Group) with dynamic product image bounds fitting
 * - Centered, beautifully proportioned typography (never thrown into corners or squished to the left)
 * - Centered dedicated high-impact Offer POP rectangle with gold/accent border and kicker
 * - High-converting authentic Kenyan footer (WhatsApp + Lipa na M-Pesa Buy Goods Till)
 * 
 * 1. Handbags & Bags: 'editorial_maison' — Parisian luxury editorial, deep obsidian & champagne gold.
 * 2. Makeup & Prep: 'gloss_studio' — High-contrast commercial studio, vibrant accent glow, starburst promo.
 * 3. Lip Care: 'pastel_boutique' — Soft pastel warmth, playful pill badges, hydration circular seal.
 * 4. Bath & Body: 'botanical_spa' — Fresh spa aesthetics, eucalyptus & sage tones, organic seal.
 * 5. Skincare & Serums: 'clinical_apothecary' — Lab-clean precision, clinical metric bar, derma trust markers.
 * 6. Classic Clothes: 'lookbook_atelier' — High-fashion runway lookbook, prominent size strip (S-XXL).
 * 7. Household & Bedding: 'warm_living' — Warm home tones, washi tape, dimension callout (e.g. 6x6 FT).
 */

import { resolveSellerConfig, resolvePalette, ensureBrandFontLoaded, SUPPORTED_BRAND_FONTS } from './configService.js';
import { decodeHtmlEntities } from '../utils/textUtils.js';
import {
  roundRect,
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
    if (nonBgCount < 80 || contentW < 25 || contentH < 25) {
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
 * Centered Title & Benefit line renderer - Guaranteed never thrown to corners
 * Auto-wraps up to 2 lines without ellipsis truncation
 */
function drawCenteredTitleAndBenefit(ctx, title, benefit, centerX, startY, maxWidth, isStatus, textColor = '#0f172a', benefitColor = '#047857', brandFont = null) {
  const cleanTitle = decodeHtmlEntities(String(title || '').trim());
  const fontFam = brandFont || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  let initialFontSize = isStatus ? 40 : 28;
  let minFontSize = isStatus ? 24 : 18;
  let fontSize = initialFontSize;
  let lines = [];
  const words = cleanTitle.split(/\s+/);

  while (fontSize >= minFontSize) {
    ctx.font = `900 ${fontSize}px ${fontFam}`;
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

  if (lines.length > 2) {
    lines = [lines[0], lines.slice(1).join(' ')];
    while (fontSize > minFontSize && (ctx.measureText(lines[1]).width > maxWidth || ctx.measureText(lines[0]).width > maxWidth)) {
      fontSize -= 1;
      ctx.font = `900 ${fontSize}px ${fontFam}`;
    }
  }

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.font = `900 ${fontSize}px ${fontFam}`;

  const lineHeight = Math.round(fontSize * 1.15) + (isStatus ? 6 : 4);
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });

  const titleEndY = startY + (lines.length - 1) * lineHeight;

  // Benefit Line
  const benefitY = titleEndY + (isStatus ? 40 : 28);
  const cleanBenefit = decodeHtmlEntities(String(benefit || '').trim());
  if (cleanBenefit) {
    let benefitSize = isStatus ? 22 : 16;
    ctx.font = `700 ${benefitSize}px system-ui, -apple-system, sans-serif`;
    while (ctx.measureText(cleanBenefit).width > maxWidth && benefitSize > (isStatus ? 15 : 12)) {
      benefitSize -= 1;
      ctx.font = `700 ${benefitSize}px system-ui, -apple-system, sans-serif`;
    }
    ctx.fillStyle = benefitColor;
    ctx.textAlign = 'center';
    ctx.fillText(cleanBenefit, centerX, benefitY);
  }

  return {
    titleEndY,
    benefitY,
    nextY: benefitY + (isStatus ? 30 : 20)
  };
}

/**
 * Centered Dedicated High-Impact Offer POP Rectangle with gold/accent border
 */
function drawSharedOfferPopRectangle(ctx, centerX, y, width, height, isStatus, fill = '#064e3b', outline = '#f59e0b', kicker = '✦ SPECIAL OFFER PRICE • IN STOCK ✦', kickerColor = '#f59e0b', price = 'KES 1,850', wasPrice = null) {
  const x = Math.round(centerX - width / 2);
  const cornerRadius = 22;

  // Outer glow
  ctx.save();
  ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
  roundRect(ctx, x - 3, y - 3, width + 6, height + 6, cornerRadius + 2);
  ctx.fill();
  ctx.restore();

  // Box fill
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, width, height, cornerRadius);
  ctx.fill();

  // Outline
  ctx.strokeStyle = outline;
  ctx.lineWidth = 4;
  roundRect(ctx, x, y, width, height, cornerRadius);
  ctx.stroke();

  // Kicker
  const kickerY = y + (isStatus ? 28 : 22);
  ctx.fillStyle = kickerColor;
  ctx.textAlign = 'center';
  ctx.font = `800 ${isStatus ? 15 : 12}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(kicker, centerX, kickerY);

  // Price
  const priceY = y + (isStatus ? 76 : 58);
  if (wasPrice) {
    const wasFont = `800 ${isStatus ? 24 : 17}px system-ui, -apple-system, sans-serif`;
    const nowFont = `900 ${isStatus ? 54 : 38}px system-ui, -apple-system, sans-serif`;
    ctx.font = wasFont;
    const wasW = ctx.measureText(wasPrice).width;
    ctx.font = nowFont;
    const nowW = ctx.measureText(price).width;
    const gap = isStatus ? 28 : 18;
    const totalW = wasW + gap + nowW;
    const startX = centerX - totalW / 2;

    ctx.font = wasFont;
    ctx.fillStyle = '#fca5a5';
    ctx.textAlign = 'left';
    ctx.fillText(wasPrice, startX, priceY);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(startX - 4, priceY - (isStatus ? 8 : 5));
    ctx.lineTo(startX + wasW + 4, priceY - (isStatus ? 8 : 5));
    ctx.stroke();

    ctx.font = nowFont;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(price, startX + wasW + gap, priceY);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = `900 ${isStatus ? 58 : 42}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(price, centerX, priceY);
  }
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
  ctx.fillRect(0, footerY, width, 8);

  // CTA Prompt
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = `900 ${isStatus ? 22 : 16}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(ctaHeader, width / 2, footerY + (isStatus ? 48 : 34));

  // WhatsApp Phone Number
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 58 : 42}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`WhatsApp: ${config.phone}`, width / 2, footerY + (isStatus ? 116 : 84));

  // Delivery badge
  ctx.fillStyle = palette.footerSubtext || '#cbd5e1';
  ctx.font = `600 ${isStatus ? 20 : 14}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(config.delivery_info || 'Screenshot this post to order • Countrywide Delivery', width / 2, footerY + (isStatus ? 174 : 124));

  // M-Pesa Till Container
  const mpesaW = isStatus ? 760 : 660;
  const mpesaH = isStatus ? 48 : 38;
  const mpesaX = (width - mpesaW) / 2;
  const mpesaY = footerY + (isStatus ? 212 : 150);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
  ctx.fill();

  ctx.strokeStyle = palette.mpesaBorder || palette.accent;
  ctx.lineWidth = 2;
  roundRect(ctx, mpesaX, mpesaY, mpesaW, mpesaH, 14);
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.font = `700 ${isStatus ? 18 : 14}px system-ui, -apple-system, sans-serif`;
  const mpesaText = config.mpesa_till
    ? `Lipa na M-Pesa Buy Goods Till: ${config.mpesa_till} • Certified Payment`
    : 'Lipa na M-Pesa Certified • Same-Day Dispatch Across Kenya';
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
  drawEditorialBorder(ctx, width, height, isStatus ? 24 : 16, '#d4af37', true);

  // Editorial Masthead
  const headerH = isStatus ? 170 : 135;
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(0, 0, width, 8);
  ctx.fillRect(0, headerH - 8, width, 8);

  ctx.fillStyle = '#d4af37';
  ctx.textAlign = 'center';
  ctx.font = `700 ${isStatus ? 17 : 13}px ${fontFam}`;
  ctx.fillText('—  V O G U E   M A I S O N   E D I T  —', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${isStatus ? 38 : 30}px ${fontFam}`;
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 98 : 78);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 138 : 110);

  // Hero Museum Card (Full 1080px / 680px Unified Size)
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 25 : 15);
  const boxHeight = isStatus ? 1080 : 680;

  ctx.fillStyle = '#141419';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 2.5;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.stroke();

  // Top-left Leather / Material Pill
  const materialBadge = product.badge || 'HANDBAG ESSENTIAL';
  ctx.font = `700 14px ${fontFam}`;
  const badgeW = Math.max(160, Math.round(ctx.measureText(materialBadge).width + 36));
  ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
  roundRect(ctx, boxX + 24, boxY + 22, badgeW, 42, 12);
  ctx.fill();
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 24, boxY + 22, badgeW, 42, 12);
  ctx.stroke();
  ctx.fillStyle = '#fef3c7';
  ctx.textAlign = 'center';
  ctx.fillText(materialBadge, boxX + 24 + badgeW / 2, boxY + 47);

  // Floating Circular Gold Wax Seal in Top-Right
  drawCircularSeal(ctx, boxX + boxWidth - 80, boxY + 80, isStatus ? 60 : 48, '#d4af37', '#0a0a0c', 'PARISIAN EDIT', '100%', 'AUTHENTIC');

  // Hero Image with warm center glow
  const heroImg = await loadImage(product.photo || product.image_url);
  const cx = boxX + boxWidth / 2;
  const cy = boxY + boxHeight / 2;
  const aura = ctx.createRadialGradient(cx, cy, 30, cx, cy, boxWidth * 0.45);
  aura.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
  aura.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = aura;
  ctx.fillRect(boxX + 10, boxY + 10, boxWidth - 20, boxHeight - 20);

  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const padW = isStatus ? 70 : 45;
    const padH = isStatus ? 90 : 55;
    const maxW = boxWidth - padW;
    const maxH = boxHeight - padH;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 20 + Math.round((boxHeight - 20 - dh) / 2),
      dw, dh);
  }

  // 3. Centered Title & Benefit
  const titleStartY = boxY + boxHeight + (isStatus ? 38 : 24);
  const benefitLine = `✦ ${product.benefit_line || 'Handcrafted Luxury • Structured Silhouette'} ✦`;
  const titleResult = drawCenteredTitleAndBenefit(
    ctx, product.name, benefitLine, width / 2, titleStartY, boxWidth - 40, isStatus, '#ffffff', '#d4af37', fontFam
  );

  // 4. Centered Dedicated Offer POP Rectangle
  const offerW = isStatus ? 620 : 500;
  const offerH = isStatus ? 116 : 92;
  drawSharedOfferPopRectangle(
    ctx, width / 2, titleResult.nextY, offerW, offerH, isStatus,
    '#141419', '#d4af37', '✦ CURATED BOUTIQUE • PARISIAN EDIT ✦', '#fef3c7', formattedPrice, null
  );

  // 5. Authentic Footer
  const footerH = isStatus ? 300 : 250;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, { ...palette, mpesaBg: '#0a0a0c', accent: '#d4af37' }, 'CLAIM THIS HANDBAG ON WHATSAPP:');

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
  ctx.fillRect(0, 0, width, 8);

  // Header
  const headerH = isStatus ? 170 : 135;
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(0, headerH - 8, width, 8);

  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.font = '900 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('GLOSS STUDIO // BEAUTY COUNTER RELEASE', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 98 : 78);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 138 : 110);

  // Hero Card with Gloss Framing (Full 1080px / 680px Unified Size)
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 25 : 15);
  const boxHeight = isStatus ? 1080 : 680;

  ctx.fillStyle = '#12121c';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.fill();

  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 3;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.stroke();

  // Top Formulation Pill
  const formulationBadge = product.badge || 'PRO FORMULA';
  ctx.fillStyle = '#ec4899';
  roundRect(ctx, boxX + 24, boxY + 22, 190, 42, 12);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 14px system-ui, -apple-system, sans-serif';
  ctx.fillText(formulationBadge.toUpperCase(), boxX + 24 + 95, boxY + 47);

  // Top-Right Floating Starburst Promo Badge
  const starCx = boxX + boxWidth - 80;
  const starCy = boxY + 80;
  drawStarburst(ctx, starCx, starCy, 12, isStatus ? 64 : 50, isStatus ? 48 : 38, '#ec4899', '#ffffff');
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = `900 ${isStatus ? 13 : 10}px system-ui, -apple-system, sans-serif`;
  ctx.fillText('PRO GLOSS', starCx, starCy - (isStatus ? 5 : 4));
  ctx.fillText('HD FINISH', starCx, starCy + (isStatus ? 11 : 9));

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const padW = isStatus ? 70 : 45;
    const padH = isStatus ? 90 : 55;
    const maxW = boxWidth - padW;
    const maxH = boxHeight - padH;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 20 + Math.round((boxHeight - 20 - dh) / 2),
      dw, dh);
  }

  // 3. Centered Title & Benefit
  const titleStartY = boxY + boxHeight + (isStatus ? 38 : 24);
  const benefitLine = `✔ ${product.benefit_line || 'All-Day High Performance • Flawless Smooth Finish'}`;
  const titleResult = drawCenteredTitleAndBenefit(
    ctx, product.name, benefitLine, width / 2, titleStartY, boxWidth - 40, isStatus, '#ffffff', '#ec4899'
  );

  // 4. Centered Dedicated Offer POP Rectangle
  const offerW = isStatus ? 620 : 500;
  const offerH = isStatus ? 116 : 92;
  drawSharedOfferPopRectangle(
    ctx, width / 2, titleResult.nextY, offerW, offerH, isStatus,
    '#181826', '#ec4899', '✦ SPECIAL STUDIO OFFER • IN STOCK ✦', '#fbcfe8', formattedPrice, null
  );

  // 5. Authentic Footer
  const footerH = isStatus ? 300 : 250;
  drawAuthenticFooter(ctx, width, height, footerH, isStatus, config, { ...palette, mpesaBg: '#09090e', accent: '#ec4899' }, 'ORDER THIS MAKEUP SHADE ON WHATSAPP:');

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
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Boutique Header
  const headerH = isStatus ? 170 : 135;
  ctx.fillStyle = '#be185d';
  ctx.fillRect(0, 0, width, 8);
  ctx.fillRect(0, headerH - 8, width, 8);

  ctx.fillStyle = '#be185d';
  ctx.textAlign = 'center';
  ctx.font = '800 17px system-ui, -apple-system, sans-serif';
  ctx.fillText('🌸 NOURISHING LIP THERAPY & TINTS 🌸', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#831843';
  ctx.font = '900 38px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 98 : 78);

  ctx.fillStyle = '#9d174d';
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 138 : 110);

  // Hero Card: Roman Arch Window (Full 1080px / 680px Unified Size)
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 25 : 15);
  const boxHeight = isStatus ? 1080 : 680;

  drawArchCard(ctx, boxX, boxY, boxWidth, boxHeight, 28, '#ffffff', '#f472b6', 3);

  // Top-Left Hydration Pill
  ctx.fillStyle = '#fdf2f8';
  roundRect(ctx, boxX + 24, boxY + 24, 210, 42, 12);
  ctx.fill();
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 24, boxY + 24, 210, 42, 12);
  ctx.stroke();
  ctx.fillStyle = '#be185d';
  ctx.font = '900 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('✨ HYDRATION HERO', boxX + 24 + 105, boxY + 49);

  // Top-Right Floating Circular Hydration Seal
  drawCircularSeal(ctx, boxX + boxWidth - 80, boxY + 80, isStatus ? 60 : 48, '#be185d', '#fdf2f8', 'HYDRATION', '100%', 'LIP THERAPY');

  // Hero Image centered inside Arch Card
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const padW = isStatus ? 70 : 45;
    const padH = isStatus ? 90 : 55;
    const maxW = boxWidth - padW;
    const maxH = boxHeight - padH;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 20 + Math.round((boxHeight - 20 - dh) / 2),
      dw, dh);
  }

  // 3. Centered Title & Benefit
  const titleStartY = boxY + boxHeight + (isStatus ? 38 : 24);
  const benefitLine = `🌸 ${product.benefit_line || 'Moisture Lock • Plump, Healthy & Tinted Shine'}`;
  const titleResult = drawCenteredTitleAndBenefit(
    ctx, product.name, benefitLine, width / 2, titleStartY, boxWidth - 40, isStatus, '#831843', '#be185d'
  );

  // 4. Centered Dedicated Offer POP Rectangle
  const offerW = isStatus ? 620 : 500;
  const offerH = isStatus ? 116 : 92;
  drawSharedOfferPopRectangle(
    ctx, width / 2, titleResult.nextY, offerW, offerH, isStatus,
    '#831843', '#f472b6', '✦ EXCLUSIVE LIP SPECIAL • IN STOCK ✦', '#fbcfe8', formattedPrice, null
  );

  // 5. Authentic Footer
  const footerH = isStatus ? 300 : 250;
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
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Spa Header
  const headerH = isStatus ? 170 : 135;
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 0, width, 8);
  ctx.fillRect(0, headerH - 8, width, 8);

  ctx.fillStyle = '#15803d';
  ctx.textAlign = 'center';
  ctx.font = '800 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('🌿 BOTANICAL SPA & BODY RETREAT 🌿', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#14532d';
  ctx.font = '900 38px "Cinzel", Georgia, serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 98 : 78);

  ctx.fillStyle = '#166534';
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 138 : 110);

  // Hero Card: Roman Arch Window (Full 1080px / 680px Unified Size)
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 25 : 15);
  const boxHeight = isStatus ? 1080 : 680;

  drawArchCard(ctx, boxX, boxY, boxWidth, boxHeight, 28, '#ffffff', '#86efac', 3);

  // Top-Left Natural Extracts Pill
  ctx.fillStyle = '#dcfce7';
  roundRect(ctx, boxX + 24, boxY + 24, 210, 42, 12);
  ctx.fill();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 24, boxY + 24, 210, 42, 12);
  ctx.stroke();
  ctx.fillStyle = '#15803d';
  ctx.font = '900 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('NATURAL EXTRACTS', boxX + 24 + 105, boxY + 49);

  // Top-Right Floating Circular Botanical Seal
  drawCircularSeal(ctx, boxX + boxWidth - 80, boxY + 80, isStatus ? 60 : 48, '#15803d', '#f0fdf4', 'ORGANIC SPA', '100%', 'NATURAL');

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const padW = isStatus ? 70 : 45;
    const padH = isStatus ? 90 : 55;
    const maxW = boxWidth - padW;
    const maxH = boxHeight - padH;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 20 + Math.round((boxHeight - 20 - dh) / 2),
      dw, dh);
  }

  // 3. Centered Title & Benefit
  const titleStartY = boxY + boxHeight + (isStatus ? 38 : 24);
  const benefitLine = `🌿 ${product.benefit_line || 'Deep Skin Nourishment • Pure Botanical Aromatherapy'}`;
  const titleResult = drawCenteredTitleAndBenefit(
    ctx, product.name, benefitLine, width / 2, titleStartY, boxWidth - 40, isStatus, '#14532d', '#15803d', '"Cinzel", Georgia, serif'
  );

  // 4. Centered Dedicated Offer POP Rectangle
  const offerW = isStatus ? 620 : 500;
  const offerH = isStatus ? 116 : 92;
  drawSharedOfferPopRectangle(
    ctx, width / 2, titleResult.nextY, offerW, offerH, isStatus,
    '#14532d', '#4ade80', '✦ SPA PRIVILEGE PRICE • IN STOCK ✦', '#86efac', formattedPrice, null
  );

  // 5. Authentic Footer
  const footerH = isStatus ? 300 : 250;
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
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Technical Header
  const headerH = isStatus ? 170 : 135;
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, width, 8);
  ctx.fillRect(0, headerH - 8, width, 8);

  ctx.fillStyle = '#0284c7';
  ctx.textAlign = 'center';
  ctx.font = '800 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('🔬 CLINICAL DERMATOLOGICAL SCIENCE 🔬', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 38px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 98 : 78);

  ctx.fillStyle = '#475569';
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 138 : 110);

  // Hero Card (Full 1080px / 680px Unified Size)
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 25 : 15);
  const boxHeight = isStatus ? 1080 : 680;

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.fill();

  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2.5;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.stroke();

  // Corner Crosshairs on Image Box
  drawCornerCrosshairs(ctx, boxX, boxY, boxWidth, boxHeight, 20, '#0284c7');

  // Active Ingredient Tag Top-Left
  const activeBadge = product.badge || 'ACTIVE CONCENTRATE';
  ctx.fillStyle = '#e0f2fe';
  roundRect(ctx, boxX + 24, boxY + 22, 210, 42, 12);
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 24, boxY + 22, 210, 42, 12);
  ctx.stroke();
  ctx.fillStyle = '#0369a1';
  ctx.font = '900 14px system-ui, -apple-system, sans-serif';
  ctx.fillText(activeBadge.toUpperCase(), boxX + 24 + 105, boxY + 47);

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const padW = isStatus ? 70 : 45;
    const padH = isStatus ? 120 : 70;
    const maxW = boxWidth - padW;
    const maxH = boxHeight - padH;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 20 + Math.round((boxHeight - 40 - dh) / 2),
      dw, dh);
  }

  // 3-Metric Clinical Specification Inset Banner on Hero Card Bottom
  const specH = isStatus ? 44 : 34;
  const specY = boxY + boxHeight - specH - (isStatus ? 20 : 12);
  const specW = boxWidth - 60;
  const specX = boxX + 30;

  ctx.fillStyle = '#f1f5f9';
  roundRect(ctx, specX, specY, specW, specH, 12);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  roundRect(ctx, specX, specY, specW, specH, 12);
  ctx.stroke();

  ctx.fillStyle = '#0369a1';
  ctx.font = `800 ${isStatus ? 14 : 11}px system-ui, -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('🧪 100% PURE ACTIVE   •   🛡️ BARRIER RESTORE   •   🔬 DERMA TESTED', width / 2, specY + specH / 2 + (isStatus ? 5 : 4));

  // 3. Centered Title & Benefit
  const titleStartY = boxY + boxHeight + (isStatus ? 38 : 24);
  const benefitLine = `✔ ${product.benefit_line || 'Tested Efficacy • Barrier Repair & Active Restoration'}`;
  const titleResult = drawCenteredTitleAndBenefit(
    ctx, product.name, benefitLine, width / 2, titleStartY, boxWidth - 40, isStatus, '#0f172a', '#0284c7'
  );

  // 4. Centered Dedicated Offer POP Rectangle
  const offerW = isStatus ? 620 : 500;
  const offerH = isStatus ? 116 : 92;
  drawSharedOfferPopRectangle(
    ctx, width / 2, titleResult.nextY, offerW, offerH, isStatus,
    '#0f172a', '#0284c7', '✦ CLINICAL RX FORMULA • IN STOCK ✦', '#38bdf8', formattedPrice, null
  );

  // 5. Authentic Footer
  const footerH = isStatus ? 300 : 250;
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
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Header
  const headerH = isStatus ? 170 : 135;
  ctx.fillStyle = '#e4e4e7';
  ctx.fillRect(0, 0, width, 8);
  ctx.fillRect(0, headerH - 8, width, 8);

  ctx.fillStyle = '#e4e4e7';
  ctx.textAlign = 'center';
  ctx.font = '800 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('ATELIER RUNWAY LOOKBOOK // NEW DROP', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 38px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 98 : 78);

  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 138 : 110);

  // Hero Card (Full 1080px / 680px Unified Size)
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 25 : 15);
  const boxHeight = isStatus ? 1080 : 680;

  ctx.fillStyle = '#27272a';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.fill();

  ctx.strokeStyle = '#e4e4e7';
  ctx.lineWidth = 2.5;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.stroke();

  // Corner Crosshairs on Lookbook Card
  drawCornerCrosshairs(ctx, boxX, boxY, boxWidth, boxHeight, 20, '#e4e4e7');

  // Top Category Pill
  ctx.fillStyle = '#3f3f46';
  roundRect(ctx, boxX + 24, boxY + 22, 200, 42, 12);
  ctx.fill();
  ctx.fillStyle = '#fafafa';
  ctx.font = '900 14px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RUNWAY APPAREL', boxX + 24 + 100, boxY + 47);

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const padW = isStatus ? 70 : 45;
    const padH = isStatus ? 120 : 70;
    const maxW = boxWidth - padW;
    const maxH = boxHeight - padH;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 20 + Math.round((boxHeight - 40 - dh) / 2),
      dw, dh);
  }

  // Horizontal Size Selector Strip Inset on Bottom of Card
  const sizeStripH = isStatus ? 46 : 34;
  const sizeStripY = boxY + boxHeight - sizeStripH - (isStatus ? 20 : 12);
  const sizeStripW = boxWidth - 60;
  const sizeStripX = boxX + 30;
  const parsedSize = String(product.size || product.sizes || 'M').toUpperCase();
  drawSizeSelectorStrip(ctx, sizeStripX, sizeStripY, sizeStripW, sizeStripH, ['S', 'M', 'L', 'XL', 'XXL'], parsedSize, '#e4e4e7', '#27272a', '#ffffff', '#09090b');

  // 3. Centered Title & Benefit
  const titleStartY = boxY + boxHeight + (isStatus ? 38 : 24);
  const benefitLine = `⚡ ${product.benefit_line || 'Premium Fabric • Tailored Elegant Silhouette'}`;
  const titleResult = drawCenteredTitleAndBenefit(
    ctx, product.name, benefitLine, width / 2, titleStartY, boxWidth - 40, isStatus, '#ffffff', '#a1a1aa'
  );

  // 4. Centered Dedicated Offer POP Rectangle
  const offerW = isStatus ? 620 : 500;
  const offerH = isStatus ? 116 : 92;
  drawSharedOfferPopRectangle(
    ctx, width / 2, titleResult.nextY, offerW, offerH, isStatus,
    '#09090b', '#e4e4e7', '✦ EXCLUSIVE ATELIER DROP • IN STOCK ✦', '#e4e4e7', formattedPrice, null
  );

  // 5. Authentic Footer
  const footerH = isStatus ? 300 : 250;
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
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Practical Header
  const headerH = isStatus ? 170 : 135;
  ctx.fillStyle = '#9a3412';
  ctx.fillRect(0, 0, width, 8);
  ctx.fillRect(0, headerH - 8, width, 8);

  ctx.fillStyle = '#9a3412';
  ctx.textAlign = 'center';
  ctx.font = '800 16px system-ui, -apple-system, sans-serif';
  ctx.fillText('🏡 WARM LIVING & HOME ESSENTIALS 🏡', width / 2, isStatus ? 48 : 38);

  ctx.fillStyle = '#431407';
  ctx.font = '900 38px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.shop_name.toUpperCase(), width / 2, isStatus ? 98 : 78);

  ctx.fillStyle = '#7c2d12';
  ctx.font = '600 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(config.location, width / 2, isStatus ? 138 : 110);

  // Hero Card with Cozy Frame (Full 1080px / 680px Unified Size)
  const boxX = 60;
  const boxWidth = width - 120;
  const boxY = headerH + (isStatus ? 25 : 15);
  const boxHeight = isStatus ? 1080 : 680;

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.fill();

  ctx.strokeStyle = '#fed7aa';
  ctx.lineWidth = 3;
  roundRect(ctx, boxX, boxY, boxWidth, boxHeight, 28);
  ctx.stroke();

  // Authentic Washi Tape at Top-Center of Card
  drawWashiTape(ctx, width / 2, boxY, isStatus ? 220 : 170, 38, -0.02, 'rgba(254, 215, 170, 0.92)', 'rgba(234, 88, 12, 0.45)');

  // Home Dimension/Quality Tag Top-Left
  const dimensionBadge = product.size || product.badge || 'HOME ESSENTIAL';
  ctx.fillStyle = '#ffedd5';
  roundRect(ctx, boxX + 24, boxY + 22, 220, 42, 12);
  ctx.fill();
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.5;
  roundRect(ctx, boxX + 24, boxY + 22, 220, 42, 12);
  ctx.stroke();
  ctx.fillStyle = '#c2410c';
  ctx.font = '900 14px system-ui, -apple-system, sans-serif';
  ctx.fillText(String(dimensionBadge).toUpperCase(), boxX + 24 + 110, boxY + 47);

  // Hero Image
  const heroImg = await loadImage(product.photo || product.image_url);
  if (heroImg) {
    const bounds = getProductBounds(heroImg);
    const padW = isStatus ? 70 : 45;
    const padH = isStatus ? 90 : 55;
    const maxW = boxWidth - padW;
    const maxH = boxHeight - padH;
    const scale = Math.min(maxW / bounds.sWidth, maxH / bounds.sHeight);
    const dw = Math.round(bounds.sWidth * scale);
    const dh = Math.round(bounds.sHeight * scale);
    ctx.drawImage(heroImg, bounds.sx, bounds.sy, bounds.sWidth, bounds.sHeight,
      boxX + Math.round((boxWidth - dw) / 2),
      boxY + 20 + Math.round((boxHeight - 20 - dh) / 2),
      dw, dh);
  }

  // 3. Centered Title & Benefit
  const titleStartY = boxY + boxHeight + (isStatus ? 38 : 24);
  const benefitLine = `🏡 ${product.benefit_line || 'Durable Comfort • Easy Maintenance & Lasting Value'}`;
  const titleResult = drawCenteredTitleAndBenefit(
    ctx, product.name, benefitLine, width / 2, titleStartY, boxWidth - 40, isStatus, '#431407', '#9a3412'
  );

  // 4. Centered Dedicated Offer POP Rectangle
  const offerW = isStatus ? 620 : 500;
  const offerH = isStatus ? 116 : 92;
  drawSharedOfferPopRectangle(
    ctx, width / 2, titleResult.nextY, offerW, offerH, isStatus,
    '#431407', '#f97316', '✦ HOME DISPATCH SPECIAL • IN STOCK ✦', '#fed7aa', formattedPrice, null
  );

  // 5. Authentic Footer
  const footerH = isStatus ? 300 : 250;
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
