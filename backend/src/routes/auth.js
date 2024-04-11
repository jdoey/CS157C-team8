const express = require('express');
const bcrypt = require('bcryptjs');
const { UserCredentials } = require('../models/userCredentials');
const { UserProfile } = require('../models/userProfile');

const router = express.Router();

router.get('/', (req, res) => res.send('Hello World!'));

router.get('/test', (req, res) => res.send('test success!'));  

module.exports = router;