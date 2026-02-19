// ============================================================
// Service Worker — 오프라인 캐시 (Cache-First for static assets)
// ============================================================

const CACHE_NAME = 'devjobs-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  // API 요청은 네트워크 우선
  if (request.url.includes('/api/') || request.method !== 'GET') {
    return
  }

  // 정적 자산은 캐시 우선, 네트워크 폴백
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => {
          // 오프라인: HTML 요청은 캐시된 index.html 반환
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html')
          }
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
        })
    })
  )
})
