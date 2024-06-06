var endpoint;
var key;
var authSecret;

// Register a Service Worker.
navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    return navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      return serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          if (subscription) {
            return subscription;
          }
          return serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array('BBhBkM0W8x3qpogVpX6S4x40zDi_BosKA7gwr7lsH13PhgYi0FpUvXE8Ut4zYVgoeTHp9HP3Y3JEnzHeet8W3lw')  // Replace with your public VAPID key
          });
        });
    });
  }).then(function(subscription) {
    var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    key = rawKey ?
      btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
      '';
    var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
    authSecret = rawAuthSecret ?
      btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
      '';

    endpoint = subscription.endpoint;

    fetch('/register', {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: key,
          auth: authSecret
        }
      }),
    });
  });

document.getElementById('doIt').addEventListener('click', function() {
  fetch('/sendNotification', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      endpoint: endpoint,
      key: key,
      authSecret: authSecret,
      title: document.getElementById("notificationTitle").value,
      body: document.getElementById("notificationBody").value,
      icon: document.getElementById("notificationIcon").value,
      link: document.getElementById("notificationLink").value
    }),
  });
});

// Function to convert base64 public key to Uint8Array
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
