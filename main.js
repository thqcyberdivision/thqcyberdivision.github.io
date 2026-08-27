// Service Worker registration (used in index.html, about.html)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // A new SW has been installed and is waiting -> notify user if you want
            console.log('A new service worker is installed and waiting. Consider refreshing.');
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}

// Online/offline status (used in index.html, about.html)
const statusElement = document.getElementById('status');
function updateOnlineStatus() {
  if (!statusElement) return;
  const isOnline = navigator.onLine;
  statusElement.textContent = isOnline ? 'You are online' : 'You are offline';
  if (!isOnline) {
    // Optionally use a non-intrusive UI instead of alert
    console.warn('Offline: some features will be limited.');
  }
}
if (statusElement) {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

// Fetch data function (example)
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
        dataElement.textContent = 'Failed to fetch data. You may be offline.';
        console.error('Fetch error:', error);
      });
  }
}

// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-T83TYG9SG6');

// Google Translate initialization (if used)
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

// PWA install prompt handling
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA beforeinstallprompt captured.');
  // Optionally show an install button: installBtn.style.display = 'block'
});

// Example install button usage (uncomment and add a button with id="installBtn" in HTML)
/*
const installBtn = document.getElementById('installBtn');
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('User response to install prompt:', outcome);
    deferredPrompt = null;
  });
}
*/
