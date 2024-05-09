const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const ParkProfile = require("../models/NearbyPlaces"); // Assuming the correct path
const { checkLoggedIn } = require("../middleware/authMiddleware");

router.post('/dog-friendly-places', checkLoggedIn, async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required.' });
  }

  try {
    const parks = await ParkProfile.find({
      location: {
        $near: {
          $geometry: {
             type: "Point",
             coordinates: [longitude, latitude]
          },
          $maxDistance: 16093.4 // 10 miles in meters
        }
      }
    });

    if (parks.length > 0) {
      const enhancedParks = parks.map(park => ({
        name: park.name,
        address: park.address,
        description: park.description,
        contact: park.contact,
        openHours: park.openHours,
        openDays: park.openDays,
        fees: park.fees,
        amenities: park.amenities,
        reviews: park.reviews.map(review => ({
          reviewer: review.reviewer,
          text: review.text,
          rating: review.rating,
          created_at: review.created_at
        })),
        events: park.events
      }));
      res.status(200).json(enhancedParks);
    } else {
      res.status(404).json({ message: 'No parks found within 10 miles of your location.' });
    }
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get("/park/:id", checkLoggedIn, async (req, res) => {
  try {
    const parkId = new ObjectId(req.params.id);
    const parkDetails = await ParkProfile.findById(parkId);

    if (!parkDetails) {
      return res.status(404).json({ message: "Park not found" });
    }

    res.status(200).json({
      name: parkDetails.name,
      address: parkDetails.address,
      description: parkDetails.description,
      contact: parkDetails.contact,
      openHours: parkDetails.openHours,
      openDays: parkDetails.openDays,
      fees: parkDetails.fees,
      amenities: parkDetails.amenities,
      reviews: parkDetails.reviews,
      events: parkDetails.events
    });
  } catch (err) {
    console.error('Error fetching park details:', err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
