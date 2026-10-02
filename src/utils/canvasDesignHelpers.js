/**
 * Production-Grade Canva-Style Design Helpers
 * High-Converting Graphic Primitives for Diverse, Non-Repetitive Commercial Flyers
 */

import { decodeHtmlEntities } from './textUtils.js';

export function roundRect(ctx, x, y, width, height, radius = 0) {
  let tl = 0, tr = 0, br = 0, bl = 0;
  if (typeof radius === 'number') {
    tl = tr = br = bl = radius;
  } else if (typeof radius === 'object' && radius !== null) {
    tl = radius.tl ?? radius.topLeft ?? 0;
    tr = radius.tr ?? radius.topRight ?? 0;
    br = radius.br ?? radius.bottomRight ?? 0;
    bl = radius.bl ?? radius.bottomLeft ?? 0;
  }
  const maxR = Math.min(width / 2, height / 2);
  tl = Math.max(0, Math.min(tl, maxR));
  tr = Math.max(0, Math.min(tr, maxR));
  br = Math.max(0, Math.min(br, maxR));
  bl = Math.max(0, Math.min(bl, maxR));

  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [tl, tr, br, bl]);
    return;
  }

  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  if (tr > 0) ctx.arcTo(x + width, y, x + width, y + tr, tr);
  else ctx.lineTo(x + width, y);

  ctx.lineTo(x + width, y + height - br);
  if (br > 0) ctx.arcTo(x + width, y + height, x + width - br, y + height, br);
  else ctx.lineTo(x + width, y + height);

  ctx.lineTo(x + bl, y + height);
  if (bl > 0) ctx.arcTo(x, y + height, x, y + height - bl, bl);
  else ctx.lineTo(x, y + height);

  ctx.lineTo(x, y + tl);
  if (tl > 0) ctx.arcTo(x, y, x + tl, y, tl);
  else ctx.lineTo(x, y);

  ctx.closePath();
}

/**
 * Left-Aligned Defensive Title Wrapper with dynamic font scaling
 */
export function drawLeftAlignedWrappedTitle(ctx, text, leftX, startY, maxWidth, initialSize = 36, minSize = 18, textColor = '#ffffff', targetFontFamily = null) {
  const cleanText = decodeHtmlEntities(String(text || '').trim());
  if (!cleanText) return { endY: startY, totalHeight: 0, fontSize: initialSize, linesCount: 0 };

  const fontFamily = targetFontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
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

  if (lines.length > 3) {
    lines = lines.slice(0, 3);
  }

  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.font = `900 ${fontSize}px ${fontFamily}`;

  const lineHeight = Math.round(fontSize * 1.25);
  lines.forEach((line, index) => {
    ctx.fillText(line, leftX, startY + index * lineHeight);
  });

  const totalHeight = lines.length * lineHeight;
  return {
    fontSize,
    linesCount: lines.length,
    totalHeight,
    endY: startY + (lines.length - 1) * lineHeight
  };
}

/**
 * Draws an architectural Roman arch window card (semicircular arch on top, straight sides, rounded base)
 */
export function drawArchCard(ctx, x, y, width, height, bottomRadius = 24, fillStyle = '#ffffff', strokeStyle = null, lineWidth = 2) {
  const radius = width / 2;
  ctx.save();
  ctx.beginPath();
  // Semicircular top arch
  ctx.arc(x + radius, y + radius, radius, Math.PI, 0, false);
  // Right vertical line down
  ctx.lineTo(x + width, y + height - bottomRadius);
  // Bottom-right corner
  ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRadius, y + height);
  // Bottom line
  ctx.lineTo(x + bottomRadius, y + height);
  // Bottom-left corner
  ctx.quadraticCurveTo(x, y + height, x, y + height - bottomRadius);
  // Left vertical line up
  ctx.lineTo(x, y + radius);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws an authentic circular luxury / guarantee seal stamp with concentric rings and laurel stars
 */
export function drawCircularSeal(ctx, cx, cy, radius, primaryColor = '#d4af37', bgColor = '#090d16', topText = '100% AUTHENTIC', centerText = 'ORIGINAL', subText = 'VERIFIED') {
  ctx.save();
  // Outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = bgColor;
  ctx.fill();
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner dashed ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 8, 0, Math.PI * 2);
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Solid hairline inside
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Typography inside seal
  ctx.fillStyle = primaryColor;
  ctx.textAlign = 'center';
  ctx.font = '800 11px system-ui, -apple-system, sans-serif';
  ctx.fillText(topText, cx, cy - radius * 0.42);

  ctx.font = '900 16px "Cinzel", "Playfair Display", Georgia, serif';
  ctx.fillText(centerText, cx, cy + 4);

  ctx.font = '700 10px system-ui, -apple-system, sans-serif';
  ctx.fillText(subText, cx, cy + radius * 0.46);

  // Decorative stars
  ctx.font = '12px system-ui';
  ctx.fillText('★', cx - radius * 0.55, cy + 3);
  ctx.fillText('★', cx + radius * 0.55, cy + 3);
  ctx.restore();
}

/**
 * Draws a realistic vector barcode with alphanumeric product serial code
 */
export function drawBarcodeGraphic(ctx, x, y, width, height, codeText = '*BBK-KENYA-2026*', darkColor = '#ffffff') {
  ctx.save();
  const barCount = 42;
  const unitW = width / barCount;
  ctx.fillStyle = darkColor;

  // Pseudorandom patterned vertical bars based on string hash
  let hash = 0;
  for (let i = 0; i < codeText.length; i++) hash = (hash << 5) - hash + codeText.charCodeAt(i);
  hash = Math.abs(hash);

  for (let i = 0; i < barCount; i++) {
    const isThick = ((hash >> (i % 28)) & 1) === 1 || i % 4 === 0;
    const barW = isThick ? unitW * 0.78 : unitW * 0.38;
    ctx.fillRect(x + i * unitW, y, barW, height - 16);
  }

  // Label text under barcode
  ctx.font = '700 12px "Courier New", Courier, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(codeText, x + width / 2, y + height);
  ctx.restore();
}

/**
 * Draws realistic semi-translucent washi tape with angled rotation and textured torn edges
 */
export function drawWashiTape(ctx, x, y, width, height, angleDeg = -8, tapeColor = 'rgba(254, 243, 199, 0.85)') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);

  ctx.fillStyle = tapeColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  ctx.beginPath();
  // Left torn edge
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  // Right jagged edge
  ctx.lineTo(width - 4, height * 0.35);
  ctx.lineTo(width, height * 0.7);
  ctx.lineTo(width - 3, height);
  ctx.lineTo(0, height);
  // Left jagged edge
  ctx.lineTo(3, height * 0.65);
  ctx.lineTo(0, height * 0.35);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draws industrial streetwear corner crosshairs (+)
 */
export function drawCornerCrosshairs(ctx, x, y, width, height, size = 16, strokeColor = '#10b981') {
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;

  const corners = [
    { cx: x, cy: y },
    { cx: x + width, cy: y },
    { cx: x, cy: y + height },
    { cx: x + width, cy: y + height }
  ];

  corners.forEach(({ cx, cy }) => {
    ctx.beginPath();
    ctx.moveTo(cx - size, cy);
    ctx.lineTo(cx + size, cy);
    ctx.moveTo(cx, cy - size);
    ctx.lineTo(cx, cy + size);
    ctx.stroke();
  });
  ctx.restore();
}

/**
 * Draws an inventory scarcity progress bar with countdown text
 */
export function drawScarcityMeter(ctx, x, y, width, height, currentCount = 4, maxCount = 20, barColor = '#ef4444', trackColor = 'rgba(239, 68, 68, 0.15)', textColor = '#b91c1c') {
  ctx.save();
  // Track
  ctx.fillStyle = trackColor;
  roundRect(ctx, x, y, width, height, height / 2);
  ctx.fill();

  // Active bar
  const pct = Math.max(0.15, Math.min(1, currentCount / maxCount));
  const activeW = Math.round(width * pct);
  ctx.fillStyle = barColor;
  roundRect(ctx, x, y, activeW, height, height / 2);
  ctx.fill();

  // Pill badge & copy
  ctx.fillStyle = textColor;
  ctx.font = '800 15px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`⚡ ONLY ${currentCount} UNITS REMAINING IN NAIROBI`, x, y - 10);
  ctx.restore();
}

/**
 * Draws a horizontal chic size selector strip (S, M, L, XL, XXL) for fashion lookbooks
 */
export function drawSizeSelectorStrip(ctx, x, y, width, height, sizes = ['S', 'M', 'L', 'XL', 'XXL'], activeSize = 'M', activeBg = '#0f172a', activeTextColor = '#ffffff', defaultBorder = '#cbd5e1') {
  ctx.save();
  const gap = 12;
  const count = sizes.length;
  const boxW = Math.round((width - (count - 1) * gap) / count);

  sizes.forEach((sz, idx) => {
    const bx = x + idx * (boxW + gap);
    const isActive = String(sz).toUpperCase() === String(activeSize).toUpperCase();

    if (isActive) {
      ctx.fillStyle = activeBg;
      roundRect(ctx, bx, y, boxW, height, 10);
      ctx.fill();
      ctx.fillStyle = activeTextColor;
    } else {
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, bx, y, boxW, height, 10);
      ctx.fill();
      ctx.strokeStyle = defaultBorder;
      ctx.lineWidth = 1.5;
      roundRect(ctx, bx, y, boxW, height, 10);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
    }

    ctx.textAlign = 'center';
    ctx.font = `800 ${Math.round(height * 0.42)}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(sz, bx + boxW / 2, y + height * 0.65);
  });
  ctx.restore();
}

/**
 * Draws a customer review speech bubble card with callout arrow
 */
export function drawSpeechBubble(ctx, x, y, width, height, radius = 20, arrowX = 80, arrowW = 24, arrowH = 14, bgColor = '#ffffff', borderColor = '#fef3c7') {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  // Bubble arrow
  ctx.lineTo(x + arrowX + arrowW, y + height);
  ctx.lineTo(x + arrowX + arrowW / 2, y + height + arrowH);
  ctx.lineTo(x + arrowX, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fillStyle = bgColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.fill();

  if (borderColor) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws a multi-point starburst for flash sales & clearance deals
 */
export function drawStarburst(ctx, cx, cy, spikes = 14, outerRadius = 75, innerRadius = 58, fillStyle = '#ef4444', strokeStyle = '#ffffff') {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.save();
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
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 4;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Draws an editorial double hairline margin frame with optional corner corner accents
 */
export function drawEditorialBorder(ctx, width, height, margin = 45, strokeColor = '#d4af37', cornerAccent = true) {
  ctx.save();
  // Outer hairline
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Inner hairline
  const innerMargin = margin + 14;
  ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

  if (cornerAccent) {
    // Corner accents
    const sz = 16;
    const corners = [
      { x: innerMargin, y: innerMargin, dx: 1, dy: 1 },
      { x: width - innerMargin, y: innerMargin, dx: -1, dy: 1 },
      { x: innerMargin, y: height - innerMargin, dx: 1, dy: -1 },
      { x: width - innerMargin, y: height - innerMargin, dx: -1, dy: -1 }
    ];
    ctx.fillStyle = strokeColor;
    corners.forEach(c => {
      ctx.fillRect(c.x - (c.dx < 0 ? 4 : 0), c.y - (c.dy < 0 ? 4 : 0), 4, 4);
    });
  }
  ctx.restore();
}
