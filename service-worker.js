const CACHE_NAME = 'jar-al-qamar-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// عند التثبيت: نخزن الملفات الأساسية بالكاش
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// عند التفعيل: نحذف أي كاش قديم من نسخة سابقة
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// عند أي طلب: نجرب الشبكة أول شي (منشان بيانات Google Sheets تضل محدثة)
// وإذا فشل الاتصال (offline)، نرجع للكاش
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        return response;
      })
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
