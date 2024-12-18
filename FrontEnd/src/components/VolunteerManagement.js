import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const VolunteerManagement = ({ userEmail }) => {
  const [events, setEvents] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState(new Set()); // Track registered events
  const [alertMessage, setAlertMessage] = useState('');
  const userData = JSON.parse(localStorage.getItem('userData'));

  // Memoize the fetchEvents function using useCallback
  const fetchEvents = useCallback(async () => {
    try {
        const response = await axios.get('https://eventmanagement-1-y0a7.onrender.com/api/events/getEvents');
        const eventData = response.data;

        const updatedEvents = await Promise.all(
            eventData.map(async (event) => {
                try {
                    const registrationStatus = await axios.post('https://eventmanagement-1-y0a7.onrender.com/api/volunteers/checkStatus', {
                        eventId: event._id,
                        email: userData[0], // Using logged-in user email
                    });

                    return {
                        ...event,
                        isRegistered: registrationStatus.data.isRegistered,
                        isClosed: registrationStatus.data.isClosed,
                    };
                } catch (error) {
                    console.error(`Error checking registration status for event ${event._id}:`, error);
                    return { ...event, isRegistered: false, isClosed: false };
                }
            })
        );

        setEvents(updatedEvents);

        // Update the list of registered events
        const registeredEventIds = updatedEvents
            .filter(event => event.isRegistered)
            .map(event => event._id);
        setRegisteredEvents(new Set(registeredEventIds));
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}, [userData]);
// Include userData as a dependency because fetchEvents uses it

  // Fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // Now fetchEvents is stable and can be safely included as a dependency

  const handleShowRegisterForm = (event) => {
    setSelectedEvent(event);
    setShowRegisterForm(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const newVolunteer = {
        eventId: selectedEvent._id,
        name,
        collegeId,
        phoneNumber,
        volunteersNeeded: selectedEvent.volunteersNeeded,
        email: userData[0], // Send email from login details
      };
      const response = await axios.post('https://eventmanagement-1-y0a7.onrender.com/api/volunteers/register', newVolunteer);

      if (response.data.success) {
        setAlertMessage('Registration successful!');
        setRegisteredEvents(prev => new Set(prev.add(selectedEvent._id))); // Update registered events state
        fetchEvents(); // Refresh event data after registration
        setShowRegisterForm(false); // Close the form after registration
      } else {
        setAlertMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error registering volunteer:', error);
      setAlertMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="event-cards-container">
        {events.map((event) => (
          <Card key={event._id} className="event-card">
            {event.imageUrl && (
              <Card.Img variant="top" src={event.imageUrl} alt={event.eventName} />
            )}
            <Card.Body>
              <Card.Title>{event.eventName}</Card.Title>
              <Button
                variant="primary"
                onClick={() => handleShowRegisterForm(event)}
                disabled={registeredEvents.has(event._id) || event.isClosed}
              >
                {event.isClosed ? 'Closed' : registeredEvents.has(event._id) ? 'Registered' : 'Register'}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={showRegisterForm} onHide={() => setShowRegisterForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register for {selectedEvent?.eventName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="collegeId">
              <Form.Label>College ID</Form.Label>
              <Form.Control
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>
            {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
            <Button variant="primary" type="submit" disabled={registeredEvents.has(selectedEvent?._id) || selectedEvent?.isClosed}>
              {selectedEvent?.isClosed ? 'Closed' : registeredEvents.has(selectedEvent?._id) ? 'Registered' : 'Register'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VolunteerManagement;
