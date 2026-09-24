self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never intercept: POST requests, /api/ paths, or cross-origin requests
  if (
    e.request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.origin !== self.location.origin
  ) {
    return; // let browser handle directly without SW interception
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (!res || res.status !== 200 || res.type !== 'basic') return res;
      const clone = res.clone();
      caches.open('savings-v2').then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
