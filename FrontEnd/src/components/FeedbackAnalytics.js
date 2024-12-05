import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import './FeedbackAnalytics.css';

const FeedbackAnalytics = () => {
  const [completedEvents, setCompletedEvents] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [rating, setRating] = useState(0);
  const [textFeedback, setTextFeedback] = useState('');

  useEffect(() => {
    fetchCompletedEvents();
  }, []);

  const fetchCompletedEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/feedback/completedEvents');
      const { completedEvents } = response.data;

      const userData = JSON.parse(localStorage.getItem('userData'));
      const email = userData[0];

      const eventsWithFeedbackStatus = await Promise.all(
        completedEvents.map(async (event) => {
          try {
            const feedbackResponse = await axios.get(`http://localhost:5000/api/feedback/checkFeedback/${event._id}/${email}`);
            const feedbackExists = feedbackResponse.data.feedbackExists;
            return {
              ...event,
              feedbackAlreadySubmitted: feedbackExists,
            };
          } catch (error) {
            console.error(`Error checking feedback for event ${event._id}:`, error);
            return {
              ...event,
              feedbackAlreadySubmitted: false,
            };
          }
        })
      );

      setCompletedEvents(eventsWithFeedbackStatus);
    } catch (error) {
      console.error('Error fetching completed events:', error);
    }
  };

  const handleAddFeedback = (eventId) => {
    setSelectedEventId(eventId);
    setShowFeedbackForm(true);
  };

  const handleFeedbackFormSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('userData'));
    const email = userData[0];
    const newFeedback = {
      eventId: selectedEventId,
      email,
      rating,
      text: textFeedback,
    };
    try {
      await axios.post('http://localhost:5000/api/feedback/submitFeedback', newFeedback);
      alert('Feedback submitted successfully');
      setShowFeedbackForm(false);
      resetFeedbackForm();
      setCompletedEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === selectedEventId ? { ...event, feedbackAlreadySubmitted: true } : event
        )
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const resetFeedbackForm = () => {
    setRating(0);
    setTextFeedback('');
  };

  return (
    <div className="feedback-container mt-4">
      <div className="feed_heading">Completed Events for Feedback</div>
      <br />
      <div className="event-cards-container">
        {completedEvents.map((event, index) => (
          <Card key={index} className="event-card">
            {event.imageUrl && (
              <Card.Img variant="top" src={event.imageUrl} alt={event.eventName} className="card-img-top" />
            )}
            <Card.Body className="d-flex flex-column">
              <Card.Title>{event.eventName}</Card.Title>
              {event.feedbackAlreadySubmitted ? (
                <Button variant="success" disabled>
                  Feedback Submitted
                </Button>
              ) : (
                <Button variant="primary" onClick={() => handleAddFeedback(event._id)}>
                  Add Feedback
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={showFeedbackForm} onHide={() => setShowFeedbackForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFeedbackFormSubmit}>
            <Form.Group controlId="rating">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                required
              />
            </Form.Group>

            <Form.Group controlId="textFeedback">
              <Form.Label>Text Feedback (Max 30 characters)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={30}
                value={textFeedback}
                onChange={(e) => setTextFeedback(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit Feedback
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FeedbackAnalytics;
