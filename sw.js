const CACHE_NAME = "starbound-stories-v2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./reader.html",
  "./reader.js"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache =>
        Promise.all(
          APP_SHELL.map(file =>
            cache.add(file).catch(() => {})
          )
        )
      )
  );
});

self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(cached => {

        return cached || fetch(event.request)
          .then(response => {

            if (
              response.status === 200 &&
              event.request.method === "GET"
            ) {
              const copy = response.clone();

              caches.open(CACHE_NAME)
                .then(cache =>
                  cache.put(event.request, copy)
                );
            }

            return response;

          })
          .catch(() => cached);

      })

  );

});