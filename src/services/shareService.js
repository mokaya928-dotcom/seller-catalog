import JSZip from 'jszip';
import { canvasRenderer } from './canvasRenderer';
import { scheduleService } from './scheduleService';
import { analyticsService, EVENT_TYPES } from './analyticsService';

/**
 * Share Service
 * Handles native mobile sharing via Web Share API (Files),
 * clipboard auto-copy, and graceful download fallbacks.
 */

export const shareService = {
  /**
   * Copy caption text to clipboard reliably (supports older Android WebViews)
   */
  async copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback execCommand', err);
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback copy failed', err);
      return false;
    }
  },

  /**
   * Helper to fetch an image URL and convert to Blob
   */
  async urlToBlob(url) {
    if (!url) return null;
    try {
      let fetchUrl = url;
      const isHttp = typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
      const isSameOrigin = typeof window !== 'undefined' && isHttp && url.startsWith(window.location.origin);
      if (isHttp && !isSameOrigin && !url.includes('images.weserv.nl')) {
        fetchUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
      }
      const response = await fetch(fetchUrl);
      if (!response.ok && fetchUrl !== url) {
        const fallbackResp = await fetch(url);
        return await fallbackResp.blob();
      }
      return await response.blob();
    } catch (e) {
      console.warn('Failed to fetch blob from url', url, e);
      return null;
    }
  },

  /**
   * Share post image(s) directly to WhatsApp Status / Groups via Web Share API
   * Supports multiple files (canvas post + reference photos) simultaneously!
   * Falls back to sequential image download if Web Share is rejected or unavailable.
   * Auto-copies the caption to clipboard in all flows.
   */
  async sharePost({ blob, blobs = [], caption, filename = 'post.png', filenames = [], post = null, slot = null }) {
    // 0. Track flyer share in analytics
    if (post || slot) {
      analyticsService.trackEvent({
        type: EVENT_TYPES.FLYER_SHARED,
        productId: post?.product?.id,
        productName: post?.product?.name,
        category: post?.product?.category,
        price: post?.product?.price,
        slot: slot || post?.slotId,
        source: 'seller_studio_share'
      });
    }

    // 1. Auto-copy caption first (in case WhatsApp strips the caption from the image share)
    const captionCopied = await this.copyText(caption);

    // Collect all blobs to share
    const allBlobs = [];
    const allNames = [];

    if (blob) {
      allBlobs.push(blob);
      allNames.push(filename);
    }
    if (Array.isArray(blobs) && blobs.length > 0) {
      blobs.forEach((b, idx) => {
        if (b) {
          allBlobs.push(b);
          allNames.push(filenames[idx] || `ref-photo-${idx + 1}.webp`);
        }
      });
    }

    if (allBlobs.length === 0) {
      return { success: captionCopied, method: 'caption_only', captionCopied };
    }

    // 2. Check for Web Share API file sharing support
    if (navigator.share) {
      try {
        const files = allBlobs.map((b, i) => new File([b], allNames[i], { type: b.type || 'image/png' }));
        
        if (navigator.canShare && navigator.canShare({ files })) {
          await navigator.share({
            files,
            title: 'Daily Post Beauty',
            text: caption
          });
          return {
            success: true,
            method: 'native_share',
            count: files.length,
            captionCopied
          };
        }
      } catch (err) {
        // If user cancelled the share sheet, return gracefully without error
        if (err.name === 'AbortError') {
          return { success: false, method: 'cancelled', captionCopied };
        }
        console.warn('Web Share failed, falling back to download', err);
      }
    }

    // 3. Desktop / Fallback: Auto-download image(s) AND immediately launch WhatsApp Web
    allBlobs.forEach((b, idx) => {
      setTimeout(() => {
        const url = URL.createObjectURL(b);
        const link = document.createElement('a');
        link.href = url;
        link.download = allNames[idx];
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, idx * 250);
    });

    // Proactively launch WhatsApp Web so the seller is brought directly to WhatsApp
    try {
      const encoded = encodeURIComponent(caption);
      window.open(`https://web.whatsapp.com/send?text=${encoded}`, '_blank');
    } catch (e) {
      console.warn('Could not launch WhatsApp Web popup', e);
    }

    return {
      success: true,
      method: 'desktop_whatsapp_opened',
      count: allBlobs.length,
      captionCopied
    };
  },

  /**
   * Explicitly download flyer only without opening WhatsApp
   */
  downloadPosterOnly({ blob, filename = 'post.png' }) {
    if (!blob) return false;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  },

  /**
   * Generic blob download helper
   */
  downloadBlob(blob, filename = 'download.zip') {
    return this.downloadPosterOnly({ blob, filename });
  },

  /**
   * Package multiple designed poster variations into a zip archive with caption
   */
  async downloadProductPostersZip({ blobs = [], filenames = [], caption = '', zipName = 'product-posters.zip' }) {
    const zip = new JSZip();
    blobs.forEach((blob, idx) => {
      zip.file(filenames[idx] || `poster-${idx + 1}.png`, blob);
    });
    if (caption) {
      zip.file('whatsapp-caption.txt', caption);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    this.downloadPosterOnly({ blob: zipBlob, filename: zipName });
    return true;
  },

  /**
   * Send a product order to WhatsApp accompanied by the product image!
   * On mobile devices (Android/iOS), uses Web Share API Level 2 to share the photo file
   * with the order details as the caption, so the seller immediately sees the exact item.
   * On fallback, opens wa.me link with rich image URL and auto-copies order text.
   */
  async orderOnWhatsApp({ product, seller, customMessage = null, meta = {} }) {
    // 0. Track WhatsApp order click in analytics
    if (product) {
      analyticsService.trackEvent({
        type: meta.type || EVENT_TYPES.ORDER_CLICK_SINGLE,
        productId: product.id,
        productName: product.name,
        category: product.category,
        price: meta.price !== undefined ? meta.price : product.price,
        itemsCount: meta.itemsCount || 1,
        source: meta.source || 'catalog_whatsapp_order'
      });
    }

    const cleanPhone = (seller.phone_raw || seller.phone || '254728222211').replace(/[^0-9]/g, '');
    const photoUrl = product.photo && product.photo.startsWith('http')
      ? product.photo
      : `${window.location.origin}${product.photo || '/products/bbk-vaseline-lip.jpg'}`;

    // 1. Prepare high-converting formatted order text with urgency & remaining stock reservation
    const remainingCount = product.remaining ?? ((product.id ? product.id.length : 3) % 4 + 2);
    const savingsAmount = product.regular_price && Number(product.regular_price) > Number(product.price)
      ? Number(product.regular_price) - Number(product.price)
      : null;

    const message = customMessage || (
      `Hi ${seller.shop_name}! 👋\n\n` +
      `I'd like to order this from your catalogue:\n` +
      `*${product.name}* (${product.size || ''})\n` +
      `💰 Price: *KES ${Number(product.price).toLocaleString()}*${savingsAmount ? ` *(Saved KES ${savingsAmount.toLocaleString()}!)*` : ''}\n` +
      `⚠️ *Please reserve 1 of the remaining ${remainingCount} units for me before it's sold out!* 🔥\n\n` +
      `📍 Delivery: [Nairobi / My Location]\n` +
      `💳 Payment: Ready via Lipa na M-Pesa Till: *${seller.mpesa_till || 'Till'}*\n\n` +
      `📷 Photo: ${photoUrl}\n\n` +
      `Please confirm stock availability & dispatch time. Thank you!`
    );

    // Auto-copy order text
    await this.copyText(message);

    // 2. Fetch the product image blob
    let blob = null;
    try {
      blob = await this.urlToBlob(photoUrl);
    } catch (e) {
      console.warn('Could not fetch photo blob for WhatsApp order', e);
    }

    // 3. Try Native Web Share with Image File (WhatsApp receives photo + text caption)
    if (blob && navigator.share && navigator.canShare) {
      const safeName = (product.name || 'product').toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
      const ext = blob.type && blob.type.includes('png') ? 'png' : 'jpg';
      const file = new File([blob], `${safeName}.${ext}`, { type: blob.type || 'image/jpeg' });

      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${seller.shop_name} - ${product.name}`,
            text: message
          });
          return { success: true, method: 'native_image_share' };
        } catch (err) {
          if (err.name === 'AbortError') {
            return { success: false, method: 'cancelled' };
          }
          console.warn('Native file share failed, falling back to wa.me', err);
        }
      }
    }

    // 4. Fallback: Open WhatsApp directly via wa.me link
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
    return { success: true, method: 'wa_me_link' };
  },

  /**
   * 1-Click Bulk Download: Packages all posts into a single .zip
   * with high-res PNG flyers and a structured captions text file!
   */
  async downloadPostsZip(posts, seller, ratio = 'status', onProgress = () => {}) {
    if (!posts || posts.length === 0) return { success: false, message: 'No posts to export' };

    const zip = new JSZip();
    const dateStr = new Date().toISOString().slice(0, 10);
    const shopSlug = (seller.shop_name || 'shop').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    const folderName = `${shopSlug}-daily-posts-${dateStr}`;
    const folder = zip.folder(folderName);

    let captionsDoc = `========================================================\n` +
      ` DAILY POSTS BUNDLE — ${seller.shop_name || 'My Shop'}\n` +
      ` Date: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n` +
      ` WhatsApp Orders: ${seller.phone || ''}\n` +
      ` Till: ${seller.mpesa_till || 'N/A'}\n` +
      ` Total Posts: ${posts.length}\n` +
      `========================================================\n\n` +
      `INSTRUCTIONS:\n` +
      `1. Open WhatsApp Status or your Customer Group.\n` +
      `2. Select the flyers in numerical order (01, 02, 03...).\n` +
      `3. Copy & paste the matching caption from below.\n\n` +
      `========================================================\n\n`;

    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      const slotNum = String(i + 1).padStart(2, '0');
      const safeTitle = (p.product.name || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 35);

      onProgress(i + 1, posts.length, p.product.name);

      const palette = p.palette || seller.palette || 'emerald';
      const dataUrl = await canvasRenderer.renderPost(
        p.product,
        seller,
        ratio,
        p.style || 'unified_brand',
        p.companionProduct || null,
        palette
      );

      const blob = canvasRenderer.dataURLToBlob(dataUrl);
      const filename = `${slotNum}_${safeTitle}.png`;
      folder.file(filename, blob);

      const captionSw = scheduleService.generateCaption(
        p.product,
        seller,
        p.style || 'price_focus',
        p.companionProduct || null,
        dateStr,
        'swahili'
      );
      const captionEn = scheduleService.generateCaption(
        p.product,
        seller,
        p.style || 'price_focus',
        p.companionProduct || null,
        dateStr,
        'english'
      );

      captionsDoc += `--------------------------------------------------------\n` +
        `POST ${slotNum} | ${p.time || ''} | ${p.label || ''}\n` +
        `FILE: ${filename}\n` +
        `PRODUCT: ${p.product.name}\n` +
        `PRICE: KES ${Number(p.product.price || 0).toLocaleString()}\n` +
        `--------------------------------------------------------\n` +
        `[🇰🇪 SWAHILI / KISWAHILI CAPTION]:\n` +
        `${captionSw}\n\n` +
        `[🇬🇧 ENGLISH CAPTION]:\n` +
        `${captionEn}\n\n\n`;
    }

    folder.file('00_ALL_WHATSAPP_CAPTIONS.txt', captionsDoc);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const downloadUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 8000);

    return { success: true, count: posts.length };
  }
};
