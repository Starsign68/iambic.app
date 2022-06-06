/* eslint-env serviceWorker */
/* eslint-disable no-restricted-globals, array-callback-return*/

var CURRENT_CACHES = {
 data: "data-cache-v2"
};

self.addEventListener("install", function (event) {
 // Delete all caches that aren't named in CURRENT_CACHES.
 console.log("SW Loaded");
 var expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));
 event.waitUntil(
  caches.keys().then(function (cacheNames) {
   return Promise.all(
    cacheNames.map(function (cacheName) {
     if (!expectedCacheNamesSet.has(cacheName)) {
      // If this cache name isn't present in the set of "expected" cache names, then delete it.
      console.log("Deleting out of date cache:", cacheName);
      return caches.delete(cacheName);
     }
    })
   );
  })
 );
});

self.addEventListener("fetch", function (event) {
 console.log("Handling fetch event for", event.request.url);

 event.respondWith(
  caches.open(CURRENT_CACHES.data).then(function (cache) {
   return cache
    .match(event.request)
    .then(function (response) {
     if (response) {
      console.log(" Found response in cache:", response);
      return response;
     }

     console.log("No response for" + event.request.url + "found in cache. About to fetch " + event.request.url + "from network...", event.request.url);

     return fetch(event.request.clone()).then(function (response) {
      console.log("  Response for %s from network is: %O", event.request.url, response);
      if (response.status < 400 && response.headers.has("content-type")) {
       console.log("  Caching the response to", event.request.url);
       cache.put(event.request, response.clone());
      } else {
       console.log("  Not caching the response to", event.request.url);
      }
      // Return the original response object, which will be used to fulfill the resource request.
      return response;
     });
    })
    .catch(function (error) {
     console.error("Error in fetch handler:", error);

     throw error;
    });
  })
 );
});
