const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Event = require('../models/Event'); // Assuming you have an Event model

// Route to submit feedback
router.post('/submitFeedback', async (req, res) => {
  const { eventId, email, rating, text } = req.body;

  try {
    // Check if there is existing feedback for this event and user
    const existingFeedback = await Feedback.findOne({ eventId, email });

    if (existingFeedback) {
      return res.status(400).send({ message: 'Feedback already submitted for this event by this user' });
    }

    // Create a new Feedback document
    const newFeedback = new Feedback({
      eventId, // This should be the ObjectId of the event
      email,
      rating,
      text,
    });

    // Save the new feedback document to the database
    const savedFeedback = await newFeedback.save();

    res.status(201).send({ message: 'Feedback submitted successfully', feedback: savedFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Route to fetch completed events for giving feedback
router.get('/completedEvents', async (req, res) => {
  try {
    const currentDate = new Date();
    const completedEvents = await Event.find({ endDate: { $lt: currentDate } });
    
    if (!completedEvents || completedEvents.length === 0) {
      return res.status(404).send({ message: 'No completed events found' });
    }

    res.status(200).send({ completedEvents });
  } catch (error) {
    console.error('Error fetching completed events:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Route to check if feedback exists for a specific event and user
router.get('/checkFeedback/:eventId/:email', async (req, res) => {
  const { eventId, email } = req.params;
  try {
    const existingFeedback = await Feedback.findOne({ eventId, email });
    if (existingFeedback) {
      res.status(200).send({ feedbackExists: true });
    } else {
      res.status(200).send({ feedbackExists: false });
    }
  } catch (error) {
    console.error('Error checking feedback:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

router.get('/feedbackData', async (req, res) => {
  try {
    const events = await Event.find(); // Fetch all events
    console.log("Fetched events:", events); // Debug: Check events fetched

    const feedbackData = await Promise.all(
      events.map(async (event) => {
        console.log("Processing event:", event._id, event.name); // Debug

        const feedback = await Feedback.find({ eventId: event._id.toString() });
        console.log("Feedback for event:", event.name, feedback); // Debug

        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedback.forEach((fb) => {
          if (fb.rating >= 1 && fb.rating <= 5) {
            ratingCounts[fb.rating] += 1;
          }
        });
        return { eventId: event._id, eventName: event.eventName, ratingCounts };
      })
    );

    console.log("Final feedback data:", feedbackData); // Debug
    res.status(200).send(feedbackData);
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});



module.exports = router;
