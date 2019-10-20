/**
 * Guardar en el cache dinamicp
 */
function actualizarCacheDinamico(dicache, req, res) {
    if(res.ok) {
        return caches.open(dicache)
        .then(cache => {
            cache.put(req, res.clone())
            return res.clone();
        })
    } else {
        return res;
    }
}