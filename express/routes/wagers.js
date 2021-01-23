const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const common = require('../common');
require('dotenv').config();
const statusTypes = require('../statusTypes');


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
                if (updatedUser.wagers) {
                    updatedUser.wagers.map(w => {
                        if (w.game_date <= Date.now()) {
                            common.determineResults(w, updatedUser)
                        }
                    })
                }


                const returnableUser = await User.findOne({ _id: req.body._id });


                res.status(200).send(returnableUser)
            } else {
                common.log(statusTypes.WAGER_ERROR_CREDENTIALS, returnableUser.username, 'fail');

                res.status(401).send('Incorrect credentials')
            }
        } else {
            common.log(statusTypes.WAGER_ERROR_USER, returnableUser.username, 'fail');

            res.status(404).send('Could not find user')
        }

    } catch (er) {
        common.log(statusTypes.WAGER_ERROR_TOKEN, returnableUser.username, 'fail');

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
                            common.determineResults(w, user)
                        }
                    });
                    const returnableUser = await User.findOne({ _id: user._id });

                    common.log(statusTypes.WAGER_TYPE_GET, returnableUser.username, 'success');

                    res.status(200).send(returnableUser)
                }


                else {
                    common.log(statusTypes.WAGER_TYPE_GET, user.username, 'success: no wagers');

                    res.status(200).send(user)
                }



            } else {
                common.log(statusTypes.WAGER_ERROR_CREDENTIALS, user.username, 'fail');
                res.status(401).send('Incorrect credentials')
            }
        } else {
            common.log(statusTypes.WAGER_ERROR_USER, user.username, 'fail');
            res.status(404).send('Could not find user')
        }

    } catch (er) {
        common.log(statusTypes.WAGER_ERROR_TOKEN, req.query.id, 'fail');

        res.status(401).send('Must use a valid token')
    }
});

module.exports = router;