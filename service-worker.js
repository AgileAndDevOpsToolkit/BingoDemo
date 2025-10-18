// Versionne ton cache à chaque release
const CACHE_NAME = "bingo-demo-v1";
const ASSETS = [
  "/",                // si ton hébergeur sert index.html à /
  "/index.html",
  "/bingo_icons/Cadeau.png",
  "/bingo_icons/CaptureEcran.png",
  "/bingo_icons/DemoLive.png",
  "/bingo_icons/ImageFigurative.png",
  "/bingo_icons/NextStep.png",
  "/bingo_icons/PourQuiPourquoi.png",
  "/bingo_icons/RaconterUneHistoire.png",
  "/bingo_icons/Roadmap.png",
  "/bingo_icons/Schema.png",
  "/app_icons/Icone_BingoDemo_192.png",
  "/app_icons/Icone_BingoDemo_512.png"
];

// Installation : pré-cache les assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : supprime les anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Stratégie "cache d'abord, réseau en secours"
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Navigation requests (HTML) -> network-first avec fallback cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Static assets -> cache-first
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
