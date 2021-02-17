const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();



router.post('/', async (req, res) => {
    try {
        //  Now find the user by their email address
        let user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(400).send('Incorrect email or password.');
        }

        // Then validate the Credentials in MongoDB match
        // those provided in the request
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {

            return res.status(401).send('Incorrect email or password.');
        }


        const token = jwt.sign({ _id: user._id }, process.env.API_KEY);

        res.status(200).contentType('application/json').send(JSON.stringify(token));

    } catch (er) {
        throw new Error(er);
    }

});

module.exports = router; 