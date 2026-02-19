// ============================================================
// Service Worker 등록 유틸
// ============================================================

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[SW] 등록 완료:', reg.scope)
      })
      .catch((err) => {
        console.warn('[SW] 등록 실패:', err)
      })
  })
}
