importScripts("lib/workbox-sw.js");
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

workbox.setConfig({ debug: false });

const version = "1.0.928";
const precacheName = `precache-${version}`;
const dynamicCacheName = `dynamic-${version}`;

// Precarga algunos recursos
workbox.precaching.precacheAndRoute(
  [
    { url: "/login", revision: version }, // suponiendo que tienes una vista EJS 'index'
    //   { url: "/styles/main.css", revision: version },
    //   { url: "/styles/main.css", revision: version },
    { url: "/public/img/logoTexto.png", revision: version },
    { url: "/public/img/icono512x512.png", revision: version },
    { url: "/public/img/icono192x192.png", revision: version },
    { url: "/public/img/icono64x64.png", revision: version },
    { url: "/public/img/icono.png", revision: version },
    { url: "/sw.js", revision: version },
  ],
  {
    cacheName: precacheName,
  }
);

// Cacheo de recursos estáticos y vistas EJS
workbox.routing.registerRoute(
  /\.(js|css|html|ejs|png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.StaleWhileRevalidate({
    // cacheName: "static-resources",
    cacheName: dynamicCacheName,
  })
);

// Manejo de solicitudes de red
workbox.routing.setDefaultHandler(
  new workbox.strategies.StaleWhileRevalidate()
);

// Página de fallback (Estava con errores)
workbox.routing.setCatchHandler(({ event }) => {
  if (event.request.destination === "document") {
    return caches.match("/login"); // suponiendo que tienes una vista EJS 'offline'
  }
  return Response.error();
});

// Forzar la actualización del Service Worker
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Limpiar cachés antiguas y tomar el control de las pestañas abiertas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            let [cacheNamePrefix, cacheVersion] = cacheName.split("-");
            if (cacheNamePrefix === "precache" && cacheVersion !== version) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});
/**
 *
 * Notificaciones Push
 *
 */
self.addEventListener("push", (event) => {
  const payload = event.data.json();

  const options = {
    body: payload.title,
    icon: "/public/img/icono192x192.png",
  };

  event.waitUntil(self.registration.showNotification("FinaCompanion", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("http://localhost:3000") // Reemplaza con la URL que desees abrir
  );
});
