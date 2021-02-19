const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const common = require('../helpers/common');
require('dotenv').config();

router.get('/admin', async (req, res) => {
    const token = process.env.API_KEY;
    try {
        jwt.verify(req.headers['x-auth-token'], token);
        const tokenId = jwt.decode(req.headers['x-auth-token'], token)._id;

        const users = await User.find({});

        if (tokenId === '6009f5e08c979923c0486edc') {
            var count = 0;
            Promise.all(users.map(u => {
                if (u.wagers) {
                    Promise.all(u.wagers.map(wag => {
                        if (wag.game_date <= Date.now() && wag.status !== 'final') {
                            count++
                            common.determineResults(wag, u)
                        }
                    }))
                }


            })).then(e => { console.log(e); res.status(201).send(`${count} wagers updated`) }).catch(err => console.log(err))

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
                const wagerIsValid = await common.validateWager(req.body.wagers);
                if (wagerIsValid) {
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
                }
                else {
                    res.status(400).send('Line has changed')
                }

            } else {

                res.status(403).send('Incorrect credentials')
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
        const tokenId = jwt.decode(req.headers['x-auth-token'], token)._id;
        const user = await User.findOne({ _id: req.query.id });
        if (user) {
            if (user._id == tokenId) {
                if (user.wagers) {

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