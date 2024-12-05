import { initializeApp } from 'firebase/app';
import { getMessaging, getToken as getFirebaseToken, onMessage } from 'firebase/messaging';
import { firebaseConfig } from './firebaseConfig';


const sendTokenToServer = async (token) => {
  try {
    await fetch('http://localhost:5000/api/events/saveToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const setupNotifications = (callback) => {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload); // Debugging line
    callback(payload);
  });
};

export const getToken = async () => {
  try {
    const currentToken = localStorage.getItem('fcmToken');
    if (currentToken) {
      console.log('FCM Token from localStorage:', currentToken);
      return currentToken;
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');

        const token = await getFirebaseToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_API_KEY });
        if (token) {
          console.log('FCM Token:', token);
          localStorage.setItem('fcmToken', token);
          await sendTokenToServer(token);
          return token;
        } else {
          console.log('Failed to get FCM token.');
          return null;
        }
      } else {
        console.log('Notification permission not granted.');
        return null;
      }
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};
export const checkNotificationPermission = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  };
  
