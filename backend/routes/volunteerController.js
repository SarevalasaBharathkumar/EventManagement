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

module.exports = router;
