import React, { useState, useEffect } from 'react';
import './Home.css';
import Login from './Login';
import FeedbackAnalytics from './FeedbackAnalytics'; // Import the FeedbackAnalytics component
import EventPlanning from './EventPlanning'; // Import the EventPlanning component
import VolunteerManagement from './VolunteerManagement';
import { Button } from 'react-bootstrap';
import AdminVolunteer from './AdminVolunteer';
import EventPromotion from './EventPromotion';

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData({
        email: user[0],
        name: user[1],
        userType: user[2],
        mobileNumber: user[3]
      });
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab) => {
    if (tab === 'home') {
      setActiveTab('home');
    } else if (tab === 'login' && userData) {
      setShowLogin(false);
      setActiveTab(tab);
    } else if (userData) {
      setShowLogin(false);
      setActiveTab(tab);
    } else {
      // Handle navigation to other tabs when user is not logged in
      setShowLogin(true);
      setActiveTab('login');
    }
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    const user = JSON.parse(localStorage.getItem('userData'));
    if (user) {
      setUserData({
        email: user[0],
        name: user[1],
        userType: user[2],
        mobileNumber: user[3]
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    setUserData(null);
    setShowLogin(false);
    setActiveTab('home');
  };

  return (
    <div className="container">
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="toggle-btn" onClick={toggleSidebar}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </button>
        </div>
        <nav className="nav">
          <ul>
            <li>
              <button
                className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => handleTabChange('home')}
              >
                <i className={`bi bi-house icon ${activeTab === 'home' ? 'active' : ''} ${isOpen ? '' : 'no-glow'}`}></i>
                <span className={`text ${!isOpen ? 'hidden' : ''}`}>Home</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => handleTabChange('login')}
              >
                <i className={`bi ${userData ? 'bi-person' : 'bi-lock'} icon ${activeTab === 'login' ? 'active' : ''} ${isOpen ? '' : 'no-glow'}`}></i>
                <span className={`text ${!isOpen ? 'hidden' : ''}`}>{userData ? 'Profile' : 'Login'}</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'dashboard' && userData ? 'active' : ''}`}
                onClick={() => handleTabChange('dashboard')}
                disabled={!userData} // Disable the button if user is not logged in
              >
                <i className={`bi bi-bar-chart icon ${activeTab === 'dashboard' ? 'active' : ''} ${isOpen ? '' : 'no-glow'}`}></i>
                <span className={`text ${!isOpen ? 'hidden' : ''}`}>Dashboard</span>
              </button>
            </li>
            {userData && userData.userType === 'event-manager' && (
              <li>
                <button
                  className={`nav-item ${activeTab === 'event-planning' ? 'active' : ''}`}
                  onClick={() => handleTabChange('event-planning')}
                  disabled={!userData} // Disable the button if user is not logged in
                >
                  <i className={`bi bi-calendar icon ${activeTab === 'event-planning' ? 'active' : ''} ${isOpen ? '' : 'no-glow'}`}></i>
                  <span className={`text ${!isOpen ? 'hidden' : ''}`}>Event Planning</span>
                </button>
              </li>
            )}
            <li>
              <button
                className={`nav-item ${activeTab === 'event-promotion' && userData ? 'active' : ''}`}
                onClick={() => handleTabChange('event-promotion')}
                disabled={!userData} // Disable the button if user is not logged in
              >
                <i className={`bi bi-megaphone icon ${activeTab === 'event-promotion' ? 'active' : ''} ${isOpen ? '' : 'no-glow'}`}></i>
                <span className={`text ${!isOpen ? 'hidden' : ''}`}>Event Promotion</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'volunteer-management' && userData ? 'active' : ''}`}
                onClick={() => handleTabChange('volunteer-management')}
                disabled={!userData} // Disable the button if user is not logged in
              >
                <i className={`bi bi-person-badge icon ${activeTab === 'volunteer-management' ? 'active' : ''} ${isOpen ? '' : 'no-glow'}`}></i>
                <span className={`text ${!isOpen ? 'hidden' : ''}`}>Volunteer Management</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'resource-management' && userData ? 'active' : ''}`}
                onClick={() => handleTabChange('resource-management')}
                disabled={!userData} // Disable the button if user is not logged in
              >
                <i className={`bi bi-tools icon ${activeTab === 'resource-management' ? 'active' : ''} ${isOpen ? '' : 'no-glow'}`}></i>
                <span className={`text ${!isOpen ? 'hidden' : ''}`}>Resource Management</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'feedback-analytics' && userData ? 'active' : ''}`}
                onClick={() => handleTabChange('feedback-analytics')}
                disabled={!userData} // Disable the button if user is not logged in
              >
                <i className={`bi bi-graph-up icon ${activeTab === 'feedback-analytics' ? 'active' : ''} ${isOpen ? '' : 'no-glow'}`}></i>
                <span className={`text ${!isOpen ? 'hidden' : ''}`}>Feedback & Analytics</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={`main-content ${!isOpen ? '' : 'closed'}`}>
        <header className="header">
          <h1> Event Management System</h1>
        </header>
        <section className="content">
          {activeTab === 'home' && <p>Manage and participate in events seamlessly.</p>}
          {activeTab === 'login' && userData && (
            <div>
              <p>Name: {userData.name}</p>
              <p>Email: {userData.email}</p>
              <p>Mobile Number: {userData.mobileNumber}</p>
              <p>User Type: {userData.userType}</p>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </div>
          )}
          {activeTab === 'login' && !userData && <p>Please login to access more features.</p>}
          {activeTab === 'dashboard' && <p>View your dashboard and stats here.</p>}
          {activeTab === 'event-planning' && <EventPlanning />}
          {activeTab === 'event-promotion' && <EventPromotion />}
          {activeTab === 'volunteer-management' && (
            userData?.userType === 'student' ? (
              <VolunteerManagement />
            ) : (
              <AdminVolunteer />
            )
          )}
          {activeTab === 'resource-management' && <p>Manage resources for your events.</p>}
          {activeTab === 'feedback-analytics' && <FeedbackAnalytics />}
        </section>
      </main>
      <Login show={showLogin} handleClose={handleCloseLogin} />
    </div>
  );
}

export default Home;
