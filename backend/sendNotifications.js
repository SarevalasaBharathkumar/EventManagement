// backend/sendNotification.js
const messaging = require('./firebaseAdmin');

const sendNotification = (token, payload) => {
  messaging.sendToDevice(token, payload)
    .then(response => {
      console.log("Successfully sent message:", response);
    })
    .catch(error => {
      console.log("Error sending message:", error);
    });
};

module.exports = sendNotification;
