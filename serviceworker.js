var CACHE_NAME='my-pwa-cache-v1';

var urlsToCache=[
    '/',
    'css/main.css',
    'js/main.js',
    'js/jquery.min.js',
    'images/ugm.png',
    'fallback.json'
];

self.addEventListener('install', function(event) {

    event.waitUntil(
        caches.open(CACHE_NAME).then(
            function(cache){
                console.log('service worker do install...');
                return cache.addAll(urlsToCache);
            }
        )
    )
});

//aktivasi cache
self.addEventListener('activate',function(event){
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                //delete cache jika ada versi lebih baru
                cacheNames.filter(function(cacheName){
                    return cacheName != CACHE_NAME;
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
//fetch cache
self.addEventListener('fetch',function(event){
    var request=event.request;
    var url = new URL(request.url);
    //memisahkan cache file dengan cache data API
    if(url.origin==location.origin){
        event.respondWith(
            caches.match(request).then(function(response){
                return response || fetch(request);
            })
        )
    } else{
        event.respondWith(
            caches.open('list-mahasiswa-cache-v1')
            .then(function(cache){
                return fetch(request).then(function(liveRequest){
                    cache.put(request, liveRequest.clone());
                    return liveRequest;
                }).catch(function(){
                    return caches.match(request)
                    .then(function(response){
                        if (response) return response;
                        return caches.match('fallback.json');
                    })
                })
            })
        )
    }
    // event.respondWith(
    //     caches.match(event.request)
    //     .then(function(response){
    //         console.log(response);
    //         if(response){
    //             return response;
    //         }
    //         return fetch(event.request);
    //     })
    // )
})

self.addEventListener('notificationclick',function(e){
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    console.log(primaryKey);

    if(action === 'close'){
        notification.close();
    }else{
        clients.openWindow('http://google.com');
        notification.close();
    }
});