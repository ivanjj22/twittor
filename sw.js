//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE_NAME = "static-v4";
const DYNAMIC_CACHE_NAME = "dynamic-v2";
const INMUTABLE_CACHE_NAME = "inmutable-v1";

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE_NAME)
    .then(cache => cache.addAll(APP_SHELL))
    
    const cacheInmutable = caches.open(INMUTABLE_CACHE_NAME)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE))

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
})

self.addEventListener('activate', e => {
    const response = caches.keys()
    .then(keys => {
        keys.forEach(element => {
            if(element !== STATIC_CACHE_NAME && element.includes('static')) {
                return caches.delete(element)
            }

            if(element !== DYNAMIC_CACHE_NAME && element.includes('dynamic')) {
                return caches.delete(element)
            }
        });
    })

    e.waitUntil(response);
})

self.addEventListener('fetch', e =>{

    const response = caches.match(e.request)
    .then(res => {
        if(res) return res;
        console.log(e.request.url)

        return fetch(e.request)
        .then(newResp => {
            return actualizarCacheDinamico(DYNAMIC_CACHE_NAME, e.request, newResp);
        })
    })

    e.respondWith(response);
})