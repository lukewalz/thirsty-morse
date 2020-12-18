const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/', async (req, res) => {
    const token = process.env.API_KEY;
    try {
        jwt.verify(req.headers['x-auth-token'], token);
        const tokenId = jwt.decode(req.headers['x-auth-token'], token)._id;

        const user = await User.findOne({ _id: req.body._id });
        req.body.wagers.wager_date = Date.now();
        if (user) {
            if (user._id == tokenId) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $push: { wagers: req.body.wagers } },
                    { new: true }
                );
                res.status(200).send(updatedUser)
            } else {
                res.status(401).send('Incorrect credentials')
            }
        } else {
            res.status(404).send('Could not find user')
        }

    } catch (er) {
        console.log(er)
        res.status(401).send('Must use a valid token')
    }
});

module.exports = router;