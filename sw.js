const CACHE_NAME = 'safework-v3'; // Al cambiar este número, fuerzas la actualización en todos los equipos
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png'
];

self.addEventListener('install', event => {
  // Obliga al teléfono a instalar esta versión inmediatamente sin esperar a que cierren la app
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      // Borra cualquier caché antiguo (v1, v2) que haya quedado en los teléfonos
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)) 
    ))
  );
  // Toma el control inmediato de la pantalla para aplicar los cambios
  self.clients.claim(); 
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
