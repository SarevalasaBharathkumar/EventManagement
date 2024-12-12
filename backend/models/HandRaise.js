const mongoose = require('mongoose');

const handRaiseSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    resourceIndex: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    availableCount: { type: Number, required: true },
  });
  
  const HandRaise = mongoose.model('HandRaise', handRaiseSchema);
  
  module.exports = HandRaise;