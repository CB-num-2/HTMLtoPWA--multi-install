const CACHE_NAME = 'local-pwa-builder-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept any request inside our virtual /apps/ directory
  if (url.pathname.includes('/apps/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        // Normalize trailing slash so /apps/my-app and /apps/my-app/ match
        const cacheKey = url.pathname.endsWith('/') 
          ? url.origin + url.pathname + 'index.html' 
          : event.request.url;

        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }
        return new Response('Virtual PWA not found in local cache.', { status: 404 });
      })
    );
  }
});
