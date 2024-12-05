import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './EventPlanning.css';

const EventPlanning = () => {
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [volunteersNeeded, setVolunteersNeeded] = useState(''); // New state for volunteers needed

  const [showProgramForm, setShowProgramForm] = useState(false);
  const [programName, setProgramName] = useState('');
  const [programStartDate, setProgramStartDate] = useState('');
  const [programStartTime, setProgramStartTime] = useState('');
  const [programEndTime, setProgramEndTime] = useState('');
  const [programVenue, setProgramVenue] = useState('');

  const [eventIndex, setEventIndex] = useState(null);
  const [showProgramsModal, setShowProgramsModal] = useState(false);
  const [programsToShow, setProgramsToShow] = useState([]);
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events/getEvents');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleAddEvent = () => {
    setShowEventForm(true);
  };

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().setHours(0, 0, 0, 0);
    if (new Date(startDate) <= today) {
      alert('Start date should be after today\'s date.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      alert('End date should be on or after the start date.');
      return;
    }

    const newEvent = {
      eventName,
      startDate,
      endDate,
      venue,
      imageUrl,
      eventPrograms: [],
      volunteersNeeded // Include volunteers needed in the event object
    };

    try {
      const response = await axios.post('http://localhost:5000/api/events/createEvent', newEvent);
      setEvents([...events, response.data.event]);
      resetEventForm();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const resetEventForm = () => {
    setEventName('');
    setStartDate('');
    setEndDate('');
    setVenue('');
    setImageUrl('');
    setVolunteersNeeded(''); // Reset the volunteers needed field
    setShowEventForm(false);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/deleteEvent/${id}`);
      setEvents(events.filter(event => event._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleAddProgram = (index) => {
    setShowProgramForm(true);
    setEventIndex(index);
  };

  const handleProgramFormSubmit = async (e) => {
    e.preventDefault();
    if (programEndTime <= programStartTime) {
      alert('End time should be greater than start time.');
      return;
    }

    const updatedEvents = [...events];
    updatedEvents[eventIndex].eventPrograms.push({
      programName,
      programStartDate,
      programStartTime,
      programEndTime,
      programVenue
    });

    try {
      await axios.put(`http://localhost:5000/api/events/updateEvent/${updatedEvents[eventIndex]._id}`, {
        eventPrograms: updatedEvents[eventIndex].eventPrograms
      });
      setEvents(updatedEvents);
      resetProgramForm();
    } catch (error) {
      console.error('Error updating event programs:', error);
    }
  };

  const resetProgramForm = () => {
    setProgramName('');
    setProgramStartDate('');
    setProgramStartTime('');
    setProgramEndTime('');
    setProgramVenue('');
    setShowProgramForm(false);
  };

  const togglePrograms = (index) => {
    setProgramsToShow(events[index].eventPrograms);
    setShowProgramsModal(true);
  };

  return (
    <div className="container mt-4">
      <Button variant="primary" onClick={handleAddEvent} className="mb-3 fixed-add-event-btn">
        + Add Event
      </Button>

      <Modal show={showEventForm} onHide={() => setShowEventForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEventFormSubmit}>
            <Form.Group controlId="eventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="venue">
              <Form.Label>Venue</Form.Label>
              <Form.Control
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="imageUrl">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="volunteersNeeded">
              <Form.Label>No of Volunteers Needed</Form.Label>
              <Form.Control
                type="number"
                value={volunteersNeeded}
                onChange={(e) => setVolunteersNeeded(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create Event
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <div className="event-cards-container">
        {events.map((event, index) => (
          <Card key={index} className="event-card">
            {event.imageUrl && (
              <Card.Img variant="top" src={event.imageUrl} alt={event.eventName} />
            )}
            <Card.Body>
              <Card.Title>{event.eventName}</Card.Title>
              <Card.Text>
                <strong>Date:</strong> {event.startDate} to {event.endDate}
              </Card.Text>
              <Card.Text>
                <strong>Venue:</strong> {event.venue}
              </Card.Text>
              <div className="button-group">
                <Button variant="danger" onClick={() => handleDeleteEvent(event._id)}>
                  <i className="bi bi-trash"></i>
                </Button>
                <Button
                  variant="info"
                  className="ml-2"
                  onClick={() => handleAddProgram(index)}
                >
                  + Add Event Program
                </Button>
              </div>
              <Button
                variant="secondary"
                className="ml-2"
                onClick={() => togglePrograms(index)}
                style={{ marginTop: '10px' }}
              >
                Show Programs
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={showProgramsModal} onHide={() => setShowProgramsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Event Programs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {programsToShow.length > 0 ? (
            programsToShow.map((program, index) => (
              <div key={index}>
                <h5>{program.programName}</h5>
                <p><strong>Date:</strong> {program.programStartDate}</p>
                <p><strong>Time:</strong> {program.programStartTime} - {program.programEndTime}</p>
                <p><strong>Venue:</strong> {program.programVenue}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No programs available.</p>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showProgramForm} onHide={() => setShowProgramForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event Program</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProgramFormSubmit}>
            <Form.Group controlId="programName">
              <Form.Label>Program Name</Form.Label>
              <Form.Control
                type="text"
                value={programName}
                onChange={(e) => setProgramName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="programStartDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={programStartDate}
                onChange={(e) => setProgramStartDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="programStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                value={programStartTime}
                onChange={(e) => setProgramStartTime(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="programEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                value={programEndTime}
                onChange={(e) => setProgramEndTime(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="programVenue">
              <Form.Label>Venue</Form.Label>
              <Form.Control
                type="text"
                value={programVenue}
                onChange={(e) => setProgramVenue(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Program
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EventPlanning;
