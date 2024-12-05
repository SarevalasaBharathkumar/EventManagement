const express = require('express');
const router = express.Router();
const Image = require('../models/PromotionImages'); // Import the Image model

// POST route to upload images for a specific event
router.post('/:eventId/upload-images', async (req, res) => {
  const { eventId } = req.params; // Get the eventId from the URL parameter
  const { images } = req.body; // Get images (Base64) from the request body

  try {
    // Process each image in the request body
    const savedImages = [];
    for (let image of images) {
      const newImage = new Image({
        eventId: eventId,  // Store the eventId passed from frontend
        base64: image.base64,  // Store the Base64 string of the image
      });

      // Save the image to the database
      const savedImage = await newImage.save();
      savedImages.push(savedImage);
    }

    // Return the uploaded image details
    res.status(201).json({
      message: 'Images uploaded successfully!',
      images: savedImages,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET route to fetch uploaded images for a specific event
router.get('/:eventId/uploaded-images', async (req, res) => {
  const { eventId } = req.params; // Get the eventId from the URL parameter

  try {
    // Find images by eventId
    const images = await Image.find({ eventId });

    // Return images (base64 encoded) along with the eventId
    res.status(200).json({
      images: images.map((image) => ({
        eventId: image.eventId,  // Send the eventId along with the base64
        base64: image.base64,  // Send the base64 string
      })),
    });
  } catch (error) {
    console.error('Error fetching uploaded images:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
