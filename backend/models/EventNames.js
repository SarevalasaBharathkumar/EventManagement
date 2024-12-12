// models/EventNames.js
const mongoose = require('mongoose');

const eventNamesSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    unique: true,
  }
});

const EventNames = mongoose.model('EventNames', eventNamesSchema);

module.exports = EventNames;
