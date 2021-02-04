const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const common = require('../common');
require('dotenv').config();

router.get('/admin', async (req, res) => {
    const token = process.env.API_KEY;
    try {
        jwt.verify(req.headers['x-auth-token'], token);
        const tokenId = jwt.decode(req.headers['x-auth-token'], token)._id;

        const users = await User.find({});

        if (tokenId === '6009f5e08c979923c0486edc') {
            users.map(u => {
                if (u.wagers) {
                    u.wagers.map(wag => {
                        if (wag.game_date <= Date.now()) {
                            common.determineResults(wag, u)
                        }
                    })
                }


            })
            res.status(200).send('Updated')

        } else {

            res.status(401).send('Incorrect credentials')
        }
    } catch (er) {
        res.status(401).send('Must use a valid token')

        throw new Error(er);
    }
})

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

                if (updatedUser.wagers > 0) {
                    res.status(200).send(updatedUser.wagers)[0]
                } else {
                    res.status(200).send(updatedUser.wagers[updatedUser.wagers.length - 1])
                }
            } else {

                res.status(401).send('Incorrect credentials')
            }
        } else {

            res.status(404).send('Could not find user')
        }

    } catch (er) {
        res.status(401).send('Must use a valid token')

        throw new Error(er);
    }
});

router.get('/', async (req, res) => {
    const token = process.env.API_KEY;
    try {
        jwt.verify(req.headers['x-auth-token'], token);
        const tokenId = jwt.decode(req.headers['x-auth-token'], token)._id;;
        const user = await User.findOne({ _id: req.query.id });
        if (user) {
            if (user._id == tokenId) {
                if (user.wagers) {
                    user.wagers.map(w => {
                        if (w.game_date <= Date.now()) {
                            common.determineResults(w, user)
                        }
                        else {
                            console.log(w.game_date, Date.now())
                        }
                    });
                    res.status(200).send(user.wagers);
                }


                else {
                    res.status(200).send([])
                }



            } else {
                res.status(401).send('Incorrect credentials')
            }
        } else {
            res.status(404).send('Could not find user')
        }

    } catch (er) {
        res.status(401).send('Must use a valid token')

        throw new Error(er);
    }
});

module.exports = router;