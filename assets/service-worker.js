/**
 * StudyFuel Service Worker
 * Provides offline functionality and caching
 */

const CACHE_VERSION = 'studyfuel-v1';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMG = `${CACHE_VERSION}-images`;

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/pages/plans',
  '/pages/recipes',
  '/pages/about',
  '/offline.html'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[Service Worker] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('studyfuel-') && name !== CACHE_VERSION)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Handle images separately
  if (request.destination === 'image') {
    event.respondWith(cacheImages(request));
    return;
  }
  
  // Handle other requests
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          console.log('[Service Worker] Serving from cache:', request.url);
          return response;
        }
        
        return fetch(request)
          .then(fetchResponse => {
            // Don't cache POST requests or non-successful responses
            if (request.method !== 'GET' || !fetchResponse || fetchResponse.status !== 200) {
              return fetchResponse;
            }
            
            // Clone the response
            const responseToCache = fetchResponse.clone();
            
            caches.open(CACHE_DYNAMIC)
              .then(cache => {
                cache.put(request, responseToCache);
              });
            
            return fetchResponse;
          })
          .catch(() => {
            // Offline fallback
            return caches.match('/offline.html');
          });
      })
  );
});

// Image caching strategy
function cacheImages(request) {
  return caches.open(CACHE_IMG)
    .then(cache => {
      return cache.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          
          return fetch(request)
            .then(fetchResponse => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            })
            .catch(() => {
              // Return placeholder image if offline
              return caches.match('/images/placeholder.png');
            });
        });
    });
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

function syncForms() {
  // Implement form sync logic here
  console.log('[Service Worker] Syncing forms...');
}

// Push notifications (optional)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'New content available!',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'StudyFuel', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});