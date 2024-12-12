const express = require('express');
const ResourceRequest = require('../models/ResourceRequest');
const HandRaise = require('../models/HandRaise');

const router = express.Router();

// Route to save resource request
router.post('/saverequest', async (req, res) => {
  try {
    const { eventName, resourceName, resourceCount } = req.body;
    if (!eventName || !resourceName || !resourceCount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newRequest = new ResourceRequest({
      eventName,
      resourceName,
      resourceCount,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Resource request saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to save hand raise data
router.post('/savehandraise', async (req, res) => {
  try {
    const { eventName, resourceIndex, phoneNumber, availableCount } = req.body;
    if (!eventName || resourceIndex === undefined || !phoneNumber || !availableCount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newHandRaise = new HandRaise({
      eventName,
      resourceIndex,
      phoneNumber,
      availableCount,
    });

    await newHandRaise.save();
    res.status(201).json({ message: 'Hand raise data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch all resource requests
router.get('/getrequests', async (req, res) => {
    try {
      const requests = await ResourceRequest.find();
      res.status(200).json(requests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Route to fetch all hand raise data
  router.get('/gethandraises', async (req, res) => {
    try {
      const handRaises = await HandRaise.find();
      res.status(200).json(handRaises);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;  