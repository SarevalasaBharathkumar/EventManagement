// models/Image.js
const mongoose = require('mongoose');

// Define the Image schema
const imageSchema = new mongoose.Schema({
  eventId: {
    type: String, // Store the event ID as a string
    required: true,
  },
  base64: {
    type: String,
    required: true,
  },
});

// Create the Image model
const Image = mongoose.model('EventImage', imageSchema);

module.exports = Image;
