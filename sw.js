// Service worker Kinara Admin: membuat aplikasi bisa dipasang, tetap terbuka cepat, dan siap menerima Web Push bila nanti diaktifkan.
const CACHE = 'kinara-admin-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {      // jaringan dulu; kalau offline pakai salinan terakhir
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});
self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch (x) { d = {title: 'Dapur Kinara', body: e.data ? e.data.text() : 'Ada pesanan baru'}; }
  e.waitUntil(self.registration.showNotification(d.title || 'Dapur Kinara', {body: d.body || '', icon: 'img/dapurkinara.png', requireInteraction: true, vibrate: [300, 150, 300, 150, 600]}));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(l => {
    for (const c of l) if ('focus' in c) return c.focus();
    return clients.openWindow('./admin.html');
  }));
});
