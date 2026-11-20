const CACHE_NAME = 'local-pwa-builder-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.includes('/apps/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cleanPath = decodeURI(url.pathname);
        const cacheKey = cleanPath.endsWith('/')
          ? `${url.origin}${cleanPath}index.html`
          : `${url.origin}${cleanPath}`;

        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }
        return new Response('Virtual PWA not found in local cache.', {
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
    );
  }
});
