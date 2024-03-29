importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

const DAY  = 60 * 60 * 24;
const WEEK = 60 * 60 * 24 * 7;
const YEAR = 60 * 60 * 24 * 365;

// Verbose logging even for the production
workbox.setConfig({
  debug: true
});

// Modify SW update cycle
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.googleAnalytics.initialize();

const pageRoutes = [
  '/home',
  '/not-found'
];

workbox.routing.registerRoute(
  ({url, event}) => pageRoutes.some((route) => url.pathname === route),
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: DAY,
      }),
    ]
  })
);


// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: YEAR,
        maxEntries: 30,
      }),
    ],
  })
);

// fallback to network
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: DAY,
      }),
    ]
  })
);

// We inject manifest here using "workbox-build" in workbox-build-inject.js
workbox.precaching.precacheAndRoute([])
