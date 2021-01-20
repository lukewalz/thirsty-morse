const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const determineResults = require('../common');
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
                    { $push: { wagers: req.body.wagers } }
                );

                updatedUser.wagers.map(w => {
                    if (w.game_date <= Date.now()) {
                        determineResults(w, updatedUser)
                    }
                })

                const returnableUser = await User.findOne({ _id: req.body._id });


                res.status(200).send(returnableUser)
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

router.get('/', async (req, res) => {
    const token = process.env.API_KEY;
    try {
        jwt.verify(req.headers['x-auth-token'], token);
        const tokenId = jwt.decode(req.headers['x-auth-token'], token)._id;
        const user = await User.findOne({ _id: req.query.id });
        if (user) {
            if (user._id == tokenId) {
                if (user.wagers) {
                    user.wagers.map(w => {
                        if (w.game_date <= Date.now()) {
                            determineResults(w, user)
                        }
                    });
                    const returnableUser = await User.findOne({ _id: user._id });

                    console.log(returnableUser)
                    res.status(200).send(returnableUser)
                }


                else {
                    res.status(200).send(user)
                }



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