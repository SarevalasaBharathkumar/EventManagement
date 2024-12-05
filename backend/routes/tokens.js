// backend/routes/tokens.js
const express = require('express');
const router = express.Router();
const Token = require('../models/Token'); // Assuming you have a Token model

// Save device token
router.post('/saveToken', async (req, res) => {
  const { token } = req.body;
  try {
    const newToken = new Token({ token });
    await newToken.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save token' });
  }
});

module.exports = router;
