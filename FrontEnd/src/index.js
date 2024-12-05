import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { register as registerServiceWorker } from './serviceWorker';
import { getToken } from './firebase';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


const initializeApp = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length === 0) {
      await Promise.all(registrations.map(reg => reg.unregister()));
      await registerServiceWorker();
    } else {
      console.log('Service worker already registered:', registrations);
      // Uncomment the following line to unregister existing service workers before registering a new one
      // await Promise.all(registrations.map(reg => reg.unregister()));
    }
  }
  try {
    await getToken(); // Get the FCM token
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

initializeApp().catch(console.error);
