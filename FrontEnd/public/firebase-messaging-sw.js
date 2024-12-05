importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBB4VCDW8XtHsMs-Smh3CyhQC4GBeNqUOw",
    authDomain: "event-management-8c4d4.firebaseapp.com",
    projectId: "event-management-8c4d4",
    storageBucket: "event-management-8c4d4.appspot.com",
    messagingSenderId: "763831488241",
    appId: "1:763831488241:web:393a46c889d7910f6aa350",
    measurementId: "G-L5RD59TYLT"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
  
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png' // Optional
    };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
