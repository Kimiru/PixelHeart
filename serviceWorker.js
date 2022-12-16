const cacheName = 'PixelHeart'

//Install service worker
self.addEventListener('install', (evt) => {

    console.log('Service worker: installed')

})

self.addEventListener('activate', (evt) => {

    console.log('Service worker: activated')

})

self.addEventListener('fetch', (evt) => {

    if (/^file:\/\//.exec(evt.request.url)) {
        console.log('ignored file protocol')
        return
    } else {
        console.log('fetching', evt.request.url)
    }

    evt.respondWith(caches.open(cacheName)
        .then((cache) => {

            return fetch(evt.request.url)
                .then((res) => {
                    cache.put(evt.request, res.clone())

                    return res
                })
                .catch(() => {
                    // If the network is unavailable, get
                    return cache.match(evt.request.url)
                })
        })
    )

})

