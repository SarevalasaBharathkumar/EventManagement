const mongoose = require('mongoose');
const { Schema } = mongoose;

const programSchema = new Schema({
    programName: { type: String, required: true },
    programStartDate: { type: Date, required: true },
    programStartTime: { type: String, required: true },
    programEndTime: { type: String, required: true },
    programVenue: { type: String, required: true }
});


const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  venue: { type: String, required: true },
  imageUrl: { type: String },
  eventPrograms: { type: [String], required: true },
  volunteersNeeded: { type: Number, default: 0 } // New field for volunteers needed
});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
