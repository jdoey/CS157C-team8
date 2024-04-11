const express = require('express');
const bcrypt = require('bcryptjs');
const { UserCredentials } = require('../models/userCredentials');
const { UserProfile } = require('../models/userProfile');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello World!'));

router.get('/test', (req, res) => res.send('test success!'));

router.get('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await UserCredentials.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password"});
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    return res.status(200).json({ message: 'Login successful' });
})

module.exports = router;