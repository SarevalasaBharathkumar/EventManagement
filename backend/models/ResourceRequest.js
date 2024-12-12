const mongoose = require('mongoose');

const resourceRequestSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  resourceName: { type: String, required: true },
  resourceCount: { type: Number, required: true },
});

const ResourceRequest = mongoose.model('ResourceRequest', resourceRequestSchema);

module.exports = ResourceRequest;
