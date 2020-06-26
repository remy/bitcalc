// we'll version our cache (and learn how to delete caches in
// some other post)
const cacheName = 'v11::static';

self.addEventListener('install', (e) => {
  // once the SW is installed, go ahead and fetch the resources
  // to make this work offline
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache
        .addAll(['/', '/to.js', '/app.js', '/index.css'])
        .then(() => self.skipWaiting());
    })
  );
});

// remove the previous cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== cacheName)
            .map((cache) => caches.delete(cache))
        )
      )
  );
});

// when the browser fetches a url, either response with
// the cached object or go ahead and fetch the actual url
self.addEventListener('fetch', (event) => {
  var res = event.request;
  var url = new URL(res.url);
  if (url.pathname === '/') {
    // strip the query string
    url.search = '';
    res = url;
  }

  event.respondWith(
    // ensure we check the *right* cache to match against
    caches.open(cacheName).then((cache) => {
      return cache.match(res).then((res) => {
        return res || fetch(event.request);
      });
    })
  );
});
