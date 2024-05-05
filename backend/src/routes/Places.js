const express = require('express');
const router = express.Router();
const Place = require('../models/NearbyPlaces'); // Ensure this path matches your model file

router.post('/api/dog-friendly-places', async (req, res) => {
    const { latitude, longitude, date, time } = req.body;

    // Validate the input
    if (!latitude || !longitude || !date || !time) {
        return res.status(400).json({ message: "Missing required fields: latitude, longitude, date, and/or time." });
    }

    // Convert strings to numbers for latitude and longitude
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ message: "Invalid latitude or longitude values." });
    }

    // Validate date and time
    const requestedDateTime = new Date(`${date}T${time}`);
    const currentDateTime = new Date();

    if (requestedDateTime < currentDateTime) {
        return res.status(400).json({ message: "Choose a future time-slot." });
    }
    //Considering  past date on calender is not dissabled. 
    // Query for dog-friendly places
    try {
        const places = await Place.find({
            dogFriendly: true, // Assuming your schema has a `dogFriendly` field
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: 5000 // 5 kilometers
                }
            },
            'availableTimes.date': requestedDateTime
        }).where('availableTimes.slots').in([time]);

        res.json(places);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving dog-friendly places', error: err });
    }
});

module.exports = router;
