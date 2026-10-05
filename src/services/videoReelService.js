/**
 * Video Reel & Animated Slideshow Service
 * 
 * Generates high-converting, silky-smooth 1080p animated video slideshows (Reels / Status)
 * for products with multiple colorways, photo angles, or variations (e.g. mobile phones with 4 colors,
 * shoes with 4 angles/colors, cosmetic shades, handbags).
 * 
 * Capabilities:
 * 1. Pre-renders each slide as a pixel-perfect branded canvas using canvasRenderer.
 * 2. Deterministic 60fps live canvas preview player for instant in-browser feedback.
 * 3. Multiple transition styles:
 *    - 'silk_crossfade': Silky smooth 0.5s crossfade between colors/angles.
 *    - 'cinematic_zoom': Ken Burns slow scale (1.00 -> 1.04) with smooth dissolve.
 *    - 'smooth_slide': Lateral slide transition.
 * 4. High-impact broadcast overlays:
 *    - Segmented Instagram/WhatsApp Story Progress Bars at the top.
 *    - Floating Color & Variant Indicator Pill with glowing active dots.
 * 5. Deterministic 30fps MediaRecorder export to MP4 / WebM with live percentage progress.
 */

import { canvasRenderer } from './canvasRenderer';

export const REEL_TRANSITIONS = [
  { id: 'silk_crossfade', name: 'Silk Crossfade', icon: '✨', desc: 'Silky smooth dissolve between colors' },
  { id: 'cinematic_zoom', name: 'Cinematic Zoom', icon: '🎥', desc: 'Subtle Apple-style slow zoom & crossfade' },
  { id: 'smooth_slide', name: 'Lateral Slide', icon: '↔️', desc: 'Smooth horizontal sliding transition' }
];

export const REEL_SPEEDS = [
  { id: 'fast', seconds: 1.5, label: '1.5s Fast', desc: 'Energetic & snappy for WhatsApp Status' },
  { id: 'standard', seconds: 2.0, label: '2.0s Balanced', desc: 'Sweet spot for Instagram Reels & Stories' },
  { id: 'cinematic', seconds: 3.0, label: '3.0s Cinematic', desc: 'Luxury showcase with longer viewing time' }
];

// In-memory cache for rendered slide canvas images to make switching speeds/transitions instantaneous
const slideFrameCache = new Map();

/**
 * Loads an image from a URL or DataURL into an HTMLImageElement with CORS safety
 */
export function loadImageElement(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('Failed to load image element for reel frame:', src);
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Pre-renders all slide posters for the given product and list of photo URLs.
 * Because all slides share the exact same seller branding, header, footer, pricing, and palette,
 * the container remains 100% stable while only the product colors morph smoothly!
 */
export async function renderReelSlidePosters({
  product,
  seller,
  ratio = 'status',
  design = 'retail_classic',
  palette = null,
  mood = null,
  photos = []
}) {
  const photoList = Array.isArray(photos) && photos.length > 0
    ? photos
    : (Array.isArray(product?.photos) && product.photos.length > 0 ? product.photos : [product?.photo || product?.image_url]);

  const uniquePhotos = Array.from(new Set(photoList.filter(Boolean)));
  if (uniquePhotos.length === 0) {
    uniquePhotos.push(product?.photo || '/products/bbk-vaseline-lip.jpg');
  }

  const slides = [];

  for (let i = 0; i < uniquePhotos.length; i++) {
    const photoUrl = uniquePhotos[i];
    const cacheKey = `${product?.id || 'prod'}_${photoUrl}_${ratio}_${design}_${palette || 'def'}_${mood || 'std'}`;

    let img = slideFrameCache.get(cacheKey);

    if (!img) {
      const productForSlide = {
        ...product,
        photo: photoUrl,
        selectedPhoto: photoUrl,
        selectedMood: mood
      };

      const dataUrl = await canvasRenderer.renderPost(
        productForSlide,
        seller,
        ratio,
        design,
        null,
        palette,
        mood
      );

      img = await loadImageElement(dataUrl);
      if (img) {
        slideFrameCache.set(cacheKey, img);
      }
    }

    if (img) {
      slides.push({
        index: i,
        photoUrl,
        img,
        label: `Color / Angle ${i + 1}`
      });
    }
  }

  return slides;
}

/**
 * Draws a single frame of the animated reel onto the target canvas context.
 * 
 * @param {CanvasRenderingContext2D} ctx Target 2D canvas context
 * @param {number} width Canvas width (e.g. 1080)
 * @param {number} height Canvas height (e.g. 1920 or 1350)
 * @param {Array} slides Array of pre-rendered slide objects { img, photoUrl, index }
 * @param {number} progress Continuous float progress through the reel (0.0 to slides.length)
 * @param {Object} options Configuration options
 */
export function drawReelFrame(ctx, width, height, slides, progress, options = {}) {
  if (!ctx || !slides || slides.length === 0) return;

  const N = slides.length;
  const transitionStyle = options.transitionStyle || 'silk_crossfade';
  const showStoryBars = options.showStoryBars !== false;
  const showVariantDots = options.showVariantDots !== false;
  const brandColor = options.brandColor || '#10b981';

  // If only 1 slide, render static or with gentle Ken Burns zoom
  if (N === 1) {
    const slide = slides[0];
    ctx.clearRect(0, 0, width, height);

    if (transitionStyle === 'cinematic_zoom') {
      const zoomProgress = (progress % 1);
      const scale = 1.0 + (zoomProgress * 0.03);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale, scale);
      ctx.drawImage(slide.img, -width / 2, -height / 2, width, height);
      ctx.restore();
    } else {
      ctx.drawImage(slide.img, 0, 0, width, height);
    }
    return;
  }

  // Calculate slide indices and interpolation timing
  const normalizedProgress = ((progress % N) + N) % N;
  const currentIndex = Math.floor(normalizedProgress);
  const nextIndex = (currentIndex + 1) % N;
  const localT = normalizedProgress - currentIndex; // 0.0 to 1.0 within current slide

  // Transition Hold: 70% hold time, 30% transition time
  const holdThreshold = 0.70;
  let transitionProgress = 0;
  if (localT > holdThreshold) {
    const rawT = (localT - holdThreshold) / (1.0 - holdThreshold);
    // Smooth cubic easeInOut
    transitionProgress = rawT * rawT * (3 - 2 * rawT);
  }

  const currentSlide = slides[currentIndex];
  const nextSlide = slides[nextIndex];

  ctx.clearRect(0, 0, width, height);

  // 1. RENDER SLIDE TRANSITION
  if (transitionStyle === 'smooth_slide') {
    if (transitionProgress === 0) {
      ctx.drawImage(currentSlide.img, 0, 0, width, height);
    } else {
      const shiftCurrent = -width * transitionProgress;
      const shiftNext = width * (1.0 - transitionProgress);
      ctx.drawImage(currentSlide.img, shiftCurrent, 0, width, height);
      ctx.drawImage(nextSlide.img, shiftNext, 0, width, height);
    }
  } else if (transitionStyle === 'cinematic_zoom') {
    // Current slide subtle zoom
    const zoomProgress = localT;
    const currentScale = 1.0 + (zoomProgress * 0.025);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(currentScale, currentScale);
    ctx.drawImage(currentSlide.img, -width / 2, -height / 2, width, height);
    ctx.restore();

    // Next slide cross-fades in gently
    if (transitionProgress > 0) {
      const nextScale = 1.0 + (transitionProgress * 0.015);
      ctx.save();
      ctx.globalAlpha = transitionProgress;
      ctx.translate(width / 2, height / 2);
      ctx.scale(nextScale, nextScale);
      ctx.drawImage(nextSlide.img, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
  } else {
    // Default: 'silk_crossfade'
    ctx.drawImage(currentSlide.img, 0, 0, width, height);

    if (transitionProgress > 0) {
      ctx.save();
      ctx.globalAlpha = transitionProgress;
      ctx.drawImage(nextSlide.img, 0, 0, width, height);
      ctx.restore();
    }
  }

  // 2. RENDER OVERLAYS
  const isStatus = height > 1500;

  // A. Segmented Story Progress Bars (Instagram / WhatsApp Status format)
  if (showStoryBars && N > 1) {
    const barTop = isStatus ? 32 : 22;
    const barHeight = isStatus ? 6 : 5;
    const sideMargin = isStatus ? 40 : 30;
    const gap = 8;
    const totalAvailWidth = width - (sideMargin * 2) - ((N - 1) * gap);
    const segWidth = Math.max(10, totalAvailWidth / N);

    ctx.save();
    for (let k = 0; k < N; k++) {
      const segX = sideMargin + (k * (segWidth + gap));

      // Background track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      roundRectPath(ctx, segX, barTop, segWidth, barHeight, barHeight / 2);
      ctx.fill();

      // Filled active portion
      let fillRatio = 0;
      if (k < currentIndex) fillRatio = 1.0;
      else if (k === currentIndex) fillRatio = localT;

      if (fillRatio > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 6;
        roundRectPath(ctx, segX, barTop, segWidth * fillRatio, barHeight, barHeight / 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // B. Color & Variant Indicator Dots Pill
  if (showVariantDots && N > 1) {
    const pillY = isStatus ? 1230 : 860;
    const pillHeight = isStatus ? 40 : 34;
    const dotRadius = isStatus ? 4.5 : 3.5;
    const activeDotRadius = isStatus ? 6.0 : 5.0;
    const dotGap = isStatus ? 14 : 11;
    const dotsWidth = (N * dotGap);
    const labelText = `Color ${currentIndex + 1} of ${N}`;

    ctx.save();
    ctx.font = `900 ${isStatus ? 14 : 12}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const textWidth = ctx.measureText(labelText).width;
    const pillPaddingX = isStatus ? 20 : 16;
    const pillWidth = dotsWidth + textWidth + (pillPaddingX * 2) + 12;
    const pillX = Math.round((width - pillWidth) / 2);

    // Pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    roundRectPath(ctx, pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
    ctx.fill();

    // Pill border
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Dots
    let dotStartX = pillX + pillPaddingX + (activeDotRadius);
    const dotCenterY = pillY + (pillHeight / 2);

    for (let d = 0; d < N; d++) {
      const isCurrent = d === currentIndex;
      const isNext = d === nextIndex && transitionProgress > 0;

      ctx.beginPath();
      if (isCurrent) {
        // Glowing active dot
        ctx.arc(dotStartX, dotCenterY, activeDotRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24'; // Amber Gold
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (isNext) {
        // Morphing dot
        ctx.arc(dotStartX, dotCenterY, dotRadius + (1.5 * transitionProgress), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${0.4 + (0.6 * transitionProgress)})`;
        ctx.fill();
      } else {
        // Inactive dot
        ctx.arc(dotStartX, dotCenterY, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();
      }
      dotStartX += dotGap;
    }

    // Draw Variant Text Label
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelText, dotStartX + 6, dotCenterY);
    ctx.restore();
  }
}

/**
 * Records an animated video reel deterministically using canvas.captureStream() and MediaRecorder.
 * Supports MP4 / WebM with live progress callback.
 */
export async function recordReelVideo(canvas, slides, options = {}, onProgress = () => {}) {
  if (!canvas || !slides || slides.length === 0) {
    throw new Error('Canvas and slides are required for reel recording');
  }

  const fps = options.fps || 30;
  const secondsPerSlide = options.secondsPerSlide || 2.0;
  const loops = options.loops || 1;
  const totalSlides = slides.length;
  const totalDurationSeconds = totalSlides * secondsPerSlide * loops;
  const totalFrames = Math.max(1, Math.round(totalDurationSeconds * fps));

  // Determine optimal supported MIME type
  const mimeCandidates = [
    { type: 'video/mp4;codecs=avc1', ext: 'mp4' },
    { type: 'video/mp4', ext: 'mp4' },
    { type: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { type: 'video/webm;codecs=vp9', ext: 'webm' },
    { type: 'video/webm;codecs=vp8', ext: 'webm' },
    { type: 'video/webm', ext: 'webm' }
  ];

  let selectedMime = 'video/webm';
  let selectedExt = 'webm';

  if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
    for (const c of mimeCandidates) {
      if (MediaRecorder.isTypeSupported(c.type)) {
        selectedMime = c.type;
        selectedExt = c.ext;
        break;
      }
    }
  }

  // Capture canvas stream at requested FPS
  const stream = canvas.captureStream ? canvas.captureStream(fps) : null;
  if (!stream) {
    throw new Error('canvas.captureStream() is not supported on this browser');
  }

  const recorder = new MediaRecorder(stream, {
    mimeType: selectedMime,
    videoBitsPerSecond: options.videoBitsPerSecond || 5000000 // 5 Mbps crystal clear 1080p
  });

  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const recordingPromise = new Promise((resolve, reject) => {
    recorder.onstop = () => {
      try {
        const blob = new Blob(chunks, { type: selectedMime });
        const url = URL.createObjectURL(blob);
        resolve({
          blob,
          url,
          mimeType: selectedMime,
          extension: selectedExt,
          duration: totalDurationSeconds
        });
      } catch (err) {
        reject(err);
      }
    };
    recorder.onerror = (e) => reject(e.error || new Error('MediaRecorder error'));
  });

  recorder.start();

  const ctx = canvas.getContext('2d');
  const frameIntervalMs = 1000 / fps;

  // Render each frame deterministically
  for (let f = 0; f < totalFrames; f++) {
    const elapsedSeconds = f / fps;
    const progress = (elapsedSeconds / secondsPerSlide) % totalSlides;

    drawReelFrame(ctx, canvas.width, canvas.height, slides, progress, options);

    if (onProgress) {
      onProgress({
        frame: f + 1,
        totalFrames,
        percent: Math.min(100, Math.round(((f + 1) / totalFrames) * 100))
      });
    }

    // Allow the canvas stream and MediaRecorder encoder to ingest the frame
    await new Promise((r) => setTimeout(r, frameIntervalMs));
  }

  recorder.stop();
  return await recordingPromise;
}

/**
 * Helper to draw rounded rectangle path cleanly
 */
function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.arcTo(x + width, y, x + width, y + r, r);
  ctx.lineTo(x + width, y + height - r);
  ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
  ctx.lineTo(x + r, y + height);
  ctx.arcTo(x, y + height, x, y + height - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
