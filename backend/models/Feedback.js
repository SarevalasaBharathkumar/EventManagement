// models/Feedback.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    maxlength: 30,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
