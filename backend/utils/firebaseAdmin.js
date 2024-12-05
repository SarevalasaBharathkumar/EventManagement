const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH); // Your service account key

// Initialize Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),  // Use the service account credentials
});

// Get the messaging instance to send push notifications
const messaging = admin.messaging();

module.exports = messaging;
