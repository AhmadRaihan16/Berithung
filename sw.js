self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (!res || res.status !== 200) return res;
      const clone = res.clone();
      caches.open('savings-v1').then(c => c.put(e.request, clone));
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
