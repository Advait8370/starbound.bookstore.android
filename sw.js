// Starbound Stories PWA
// sw.js

const CACHE_NAME = "starbound-stories-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./reader.html",
  "./style.css",
  "./script.js",
  "./reader.js",
  "./manifest.json",

  "./images/favicon.png",
  "./images/favicon.ico",
  "./images/logo.png"
];

/* -----------------------
   Install
----------------------- */

self.addEventListener(
  "install",
  event => {

    self.skipWaiting();

    event.waitUntil(
      caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(
          APP_SHELL
        );
      })
    );
  }
);

/* -----------------------
   Activate
----------------------- */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches.keys().then(
        keys => {

          return Promise.all(

            keys.map(key => {

              if (
                key !== CACHE_NAME
              ) {

                return caches.delete(
                  key
                );

              }

            })

          );

        }

      )

    );

    self.clients.claim();

  }
);

/* -----------------------
   Fetch
----------------------- */

self.addEventListener(
  "fetch",
  event => {

    // Cache books.json and images from GitHub

    if (
      event.request.url.includes(
        "advait8370.github.io/Starbound-Stories-Bookstore"
      )
    ) {

      event.respondWith(

        caches.match(
          event.request
        ).then(
          cached => {

            return (
              cached ||
              fetch(
                event.request
              ).then(
                response => {

                  const copy =
                  response.clone();

                  caches
                  .open(
                    CACHE_NAME
                  )
                  .then(
                    cache => {
                      cache.put(
                        event.request,
                        copy
                      );
                    }
                  );

                  return response;

                }
              )
            );

          }
        )

      );

      return;

    }

    // Normal App Cache

    event.respondWith(

      caches.match(
        event.request
      ).then(
        cached => {

          return (
            cached ||
            fetch(
              event.request
            )
          );

        }
      )

    );

  }
);