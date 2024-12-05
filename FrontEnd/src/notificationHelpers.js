// Display toast notification
export const toastNotification = ({ title, description, status }) => {
    // Implement your toast notification logic here
    console.log('Toast Notification:', { title, description, status });
  };
  
  // Display native notification
  export const sendNativeNotification = ({ title, body }) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/firebase-logo.png', // Ensure this path is correct
      });
    }
  };
  
  