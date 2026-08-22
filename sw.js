const CACHE_NAME = 'finflow-cache-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).catch(async () => {
      const cached = await caches.match(e.request);
      if (cached) return cached;
      if (e.request.mode === 'navigate') {
        return new Response('<h1>FinFlow Pro</h1><p>Çevrimdışısınız. Lütfen internet bağlantınızı kontrol edin.</p>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      return Promise.reject('Offline resource unavailable');
    })
  );
});