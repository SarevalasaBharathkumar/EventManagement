const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');
const Event = require('../models/Event');

// Get all events and their corresponding volunteers
router.get('/events', async (req, res) => {
    try {
        // Fetch all events with their names
        const events = await Event.find({}, { eventName: 1 });
        
        // Loop through each event to fetch associated volunteers
        const eventVolunteerDetails = await Promise.all(events.map(async (event) => {
            const volunteers = await Volunteer.find({ eventId: event._id }, { name: 1, email: 1, collegeId: 1, phoneNumber: 1 });

            // Return an object that includes the event name and the list of volunteers
            return {
                eventName: event.eventName,
                id:event._id,
                volunteers: volunteers.length > 0 ? volunteers : 'No volunteers registered',
            };
        }));

        res.json(eventVolunteerDetails); // Send the combined event and volunteer data as a JSON response
    } catch (error) {
        console.error('Error fetching events and volunteers:', error);
        res.status(500).json({ error: 'Failed to fetch events and volunteers' });
    }
});

// Check registration status for a specific event and user
router.post('/checkStatus', async (req, res) => {
    const { eventId, email } = req.body;

    try {
        const volunteer = await Volunteer.findOne({ eventId, email });

        if (!volunteer) {
            return res.json({
                isRegistered: false,
                isClosed: false, // Assuming the event is open by default
            });
        }

        return res.json({
            isRegistered: true,
            isClosed: false, // Add logic to determine if the event is closed if required
        });
    } catch (error) {
        console.error('Error checking registration status:', error);
        res.status(500).json({ error: 'Failed to check registration status' });
    }
});

// register
router.post('/register', async (req, res) => {
    const { eventId, name, email, collegeId, phoneNumber, volunteersNeeded } = req.body;

    try {
        // Check if the user is already registered
        const existingVolunteer = await Volunteer.findOne({ eventId, email });
        if (existingVolunteer) {
            return res.status(400).json({ success: false, message: 'You are already registered for this event.' });
        }

        // Create a new volunteer
        const newVolunteer = new Volunteer({
            eventId,
            name,
            email,
            collegeId,
            phoneNumber,
            volunteersNeeded,
        });

        await newVolunteer.save();
        res.json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        console.error('Error registering volunteer:', error);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
});


module.exports = router;
