// src/components/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/event-planning">Event Planning</Link></li>
          <li><Link to="/event-promotion">Event Promotion</Link></li>
          <li><Link to="/volunteer-management">Volunteer Management</Link></li>
          <li><Link to="/resource-management">Resource Management</Link></li>
          <li><Link to="/feedback-analytics">Feedback & Analytics</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
