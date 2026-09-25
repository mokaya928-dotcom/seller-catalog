/**
 * Offline Service Worker for Daily Post - Seller Studio & Customer Catalogue
 * Provides 100% offline flyer generation, catalog browsing, and instant loading
 */

const VERSION = 'v3';
const CACHE_STATIC = `dailypost-static-${VERSION}`;
const CACHE_MEDIA = `dailypost-media-${VERSION}`;
const CACHE_FONTS = `dailypost-fonts-${VERSION}`;

// Core application shell assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/app-icon.svg',
  '/favicon.svg',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png'
];

// Offline fallback SVG placeholder image
const OFFLINE_IMAGE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">
  <rect width="400" height="400" fill="#064e3b"/>
  <circle cx="200" cy="170" r="48" fill="#047857"/>
  <path d="M176 170L194 188L224 152" stroke="#f59e0b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="200" y="250" fill="#ffffff" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">Beauty Bar Kenya</text>
  <text x="200" y="275" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Flyer Generator • 100% Offline</text>
</svg>
`.trim();

// ---------------------------------------------------------------------------
// 1. INSTALL: Precache app shell resiliently
// ---------------------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      // Use individual fetches so one missing optional icon does not abort installation
      return Promise.allSettled(
        STATIC_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[SW] Non-fatal precache skip for: ${asset}`, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// ---------------------------------------------------------------------------
// 2. ACTIVATE: Purge older cache versions
// ---------------------------------------------------------------------------
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_STATIC, CACHE_MEDIA, CACHE_FONTS];

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            console.log(`[SW] Deleting obsolete cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ---------------------------------------------------------------------------
// 3. FETCH: Strategy router
// ---------------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only intercept GET requests
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Skip chrome-extension and unsupported schemes
  if (!url.protocol.startsWith('http')) return;

  // A. SPA Navigation requests (HTML pages) -> Network-First with Cache Fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_STATIC).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline navigation fallback: serve cached index.html
          const cached = await caches.match('/index.html') || await caches.match('/');
          if (cached) return cached;
          return new Response(
            '<!DOCTYPE html><html><body><h1>Offline</h1><p>Daily Post is loading offline data...</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // B. Google Fonts stylesheets & web fonts -> Cache-First
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            const clone = networkResponse.clone();
            caches.open(CACHE_FONTS).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // C. Vite Immutable Built Assets (/assets/index-*.js, css) -> Cache-First
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_STATIC).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // D. Product Images, Photos & Graphic Media -> Stale-While-Revalidate with Offline SVG fallback
  const isImageRequest = 
    req.destination === 'image' || 
    url.pathname.startsWith('/products/') ||
    url.pathname.match(/\.(png|jpe?g|webp|svg|gif|avif|ico)(\?.*)?$/i);

  if (isImageRequest) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const clone = networkResponse.clone();
              caches.open(CACHE_MEDIA).then((cache) => cache.put(req, clone));
            }
            return networkResponse;
          })
          .catch(() => {
            // If offline and not in cache, provide fallback SVG
            if (!cachedResponse) {
              return new Response(OFFLINE_IMAGE_SVG, {
                headers: { 'Content-Type': 'image/svg+xml' }
              });
            }
            return cachedResponse;
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // E. All other Static Assets -> Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
            const clone = networkResponse.clone();
            caches.open(CACHE_STATIC).then((cache) => cache.put(req, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// ---------------------------------------------------------------------------
// 4. NOTIFICATIONS: System posting alerts, background alarms & click actions
// ---------------------------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/?view=seller';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window if available
      for (const client of windowClients) {
        if ('focus' in client) {
          if (client.url && client.url.includes(self.location.origin)) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('push', (event) => {
  let payload = {
    title: '⏰ Daily Post Alert',
    body: "It's time to post your scheduled flyer on WhatsApp status!",
    url: '/?view=seller'
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/favicon-32x32.png',
    vibrate: [250, 100, 250, 100, 250],
    data: { url: payload.url || '/?view=seller' },
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Open Daily Post' }
    ]
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

