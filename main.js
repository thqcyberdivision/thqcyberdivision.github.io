// Service Worker registration (used in index.html, about.html)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('Service Worker registered');
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          alert('A new version is available. Please refresh the page.');
        }
      });
    });
  }).catch((error) => {
    console.error('Service Worker registration failed:', error);
  });
}

// Online/offline status (used in index.html, about.html)
const statusElement = document.getElementById('status');
function updateOnlineStatus() {
  if (!statusElement) return;
  const isOnline = navigator.onLine;
  statusElement.textContent = isOnline ? 'You are online' : 'You are offline';
  if (!isOnline) {
    alert('You are offline. The app will continue to work with cached data.');
  }
}
if (statusElement) {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

// Fetch data function (if used in your HTML)
const dataElement = document.getElementById('data');
const refreshButton = document.getElementById('refresh');
if (dataElement && refreshButton) {
  refreshButton.addEventListener('click', fetchData);
  function fetchData() {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then((response) => response.json())
      .then((data) => {
        dataElement.textContent = `Title: ${data.title}`;
      })
      .catch((error) => {
        dataElement.textContent = 'Failed to fetch data. You are offline.';
        console.error('Fetch error:', error);
      });
  }
}

// Google Analytics (used in index.html, about.html, services.html)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-T83TYG9SG6');

// Google Translate initialization (about.html, services.html)
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}