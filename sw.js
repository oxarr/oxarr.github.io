self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.open('kaya-runtime').then(async (cache) => {
      try {
        const fresh = await fetch(req);
        cache.put(req, fresh.clone()).catch(()=>{});
        return fresh;
      } catch {
        const cached = await cache.match(req);
        return cached || fetch(req);
      }
    })
  );
});

