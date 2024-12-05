// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import EventPlanning from './components/EventPlanning';
import EventPromotion from './components/EventPromotion';
import VolunteerManagement from './components/VolunteerManagement';
import ResourceManagement from './components/ResourceManagement';
import FeedbackAnalytics from './components/FeedbackAnalytics';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getMessaging, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { sendNativeNotification } from './notificationHelpers';
import useVisibilityChange from './useVisibilityChange';
import AdminVolunteer from './components/AdminVolunteer';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function App() {
  const isForeground = useVisibilityChange();

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      const { title, body } = payload.notification;

      sendNativeNotification({ title, body });
    });
  }, [isForeground]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/event-planning" element={<EventPlanning />} />
          <Route path="/event-promotion" element={<EventPromotion />} />
          <Route path="/volunteer-management" element={<VolunteerManagement />} />
          <Route path="/volunteer-management" element={<AdminVolunteer />} />
          <Route path="/resource-management" element={<ResourceManagement />} />
          <Route path="/feedback-analytics" element={<FeedbackAnalytics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
