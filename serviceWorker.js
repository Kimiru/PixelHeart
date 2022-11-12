const cacheName = 'PixelHeart'

console.log('abc')

//Install service worker
self.addEventListener('install', (evt) => {

    console.log('Service worker: installed')

})

self.addEventListener('activate', (evt) => {

    console.log('Service worker: activated')

})

self.addEventListener('fetch', (evt) => {

    evt.respondWith(caches.open(cacheName)
        .then((cache) => {

            return fetch(evt.request.url)
                .then((res) => {
                    cache.put(evt.request, res.clone());

                    return res;
                })
                .catch(() => {
                    // If the network is unavailable, get
                    return cache.match(evt.request.url);
                })
        })
    )

})

