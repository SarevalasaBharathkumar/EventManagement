const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  collegeId: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const Volunteer = mongoose.model('Volunteer', VolunteerSchema);

module.exports = Volunteer;
