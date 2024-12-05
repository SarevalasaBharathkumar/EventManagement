const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Token = require('../models/Token');
const messaging = require('../utils/firebaseAdmin');

const getUserTokens = async () => {
  try {
    const tokens = await Token.find({});
    return tokens.map(token => token.token);
  } catch (error) {
    console.error('Error fetching user tokens:', error);
    return [];
  }
};

router.post('/createEvent', async (req, res) => {
  const { eventName, startDate, endDate, venue, imageUrl, eventPrograms, volunteersNeeded } = req.body;

  try {
    // Create and save the new event with volunteers needed
    const newEvent = new Event({ eventName, startDate, endDate, venue, imageUrl, eventPrograms, volunteersNeeded });
    await newEvent.save();
    console.log('Event created successfully:', newEvent);

    // Fetch user tokens from the database
    const userTokens = await getUserTokens();
    console.log('User tokens fetched:', userTokens);

    if (userTokens.length === 0) {
      console.log('No user tokens available to send notifications');
      return res.status(201).send({ message: 'Event created successfully', event: newEvent });
    }

    // Prepare the notification message
    const message = {
      notification: {
        title: `RGUKT RKV is organizing "${eventName}"`,
        body: `Students can now register in pre-events`,
      },
      tokens: userTokens // Send the array of tokens directly
    };

    // Send notifications to all tokens using sendMulticast
    const response = await messaging.sendEachForMulticast(message);

    console.log(response.successCount + ' messages were sent successfully');
    console.log(`${response.failureCount} messages failed to send`);
    if (response.failureCount > 0) {
      response.responses.forEach((resp, index) => {
        if (resp.error) {
          console.error(`Failed to send message to token ${userTokens[index]}: ${resp.error.message}`);
        }
      });
    }

    res.status(201).send({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// Route to update event programs
router.put('/updateEvent/:id', async (req, res) => {
    const { id } = req.params;
    const { eventPrograms } = req.body;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }
        event.eventPrograms = eventPrograms;
        await event.save();
        res.status(200).send({ message: 'Event programs updated successfully', event });
    } catch (error) {
        console.error('Error updating event programs:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Route to get all events
router.get('/getEvents', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).send(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Route to delete an event
router.delete('/deleteEvent/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }
        res.status(200).send({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/saveToken', async (req, res) => {
  const { token } = req.body;
  try {
    if (!token) {
      return res.status(400).send('Token is required');
    }
    await Token.findOneAndUpdate({ token }, { token }, { upsert: true });
    res.status(200).send('Token saved');
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).send('Error saving token');
  }
});

module.exports = router;