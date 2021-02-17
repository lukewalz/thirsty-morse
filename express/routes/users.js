const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.put("/", async (req, res, next) => {
    const token = process.env.API_KEY;
    try {
        jwt.verify(req.headers['x-auth-token'], token);
        const tokenId = jwt.decode(req.headers['x-auth-token'], token)._id;
        const user = await User.findOne({ _id: req.body._id });
        if (user) {
            if (user._id == tokenId) {
                var res = await User.updateOne({ "_id": user._id },
                    {
                        $set: {
                            'notification': req.body.e,
                        }
                    },
                    function (err, success) {
                        console.log(err);
                        console.log(success)
                    }
                );
                console.log(res.notification)
            } else {
                res.status(401).send('Incorrect credentials')
            }
        } else {
            res.status(404).send('Could not find user')
        }

    } catch {
        res.status(401).send('Must use a valid token')

        throw new Error(er);

    }
})

router.post('/', async (req, res) => {

    // Check if this user already exisits
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        try {
            // Insert the new user if they do not exist yet
            user = new User(_.pick(req.body, ['username', 'password', 'firstName', 'lastName']));
            user.dateAdded = Date.now();
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            const token = jwt.sign({ _id: user._id }, process.env.API_KEY);
            user.token = token;
            res.send(_.pick(user, ['_id', 'username', 'firstName', 'lastName', 'token']));

        }
        catch (er) {
            throw new Error(er);
        }
    }
});

router.get('/', async (req, res) => {
    const token = process.env.API_KEY;
    try {
        jwt.verify(req.headers['x-auth-token'], token);
        const tokenId = jwt.decode(req.headers['x-auth-token'], token)._id;
        if (req.query.username) {
            const user = await User.findOne({ username: req.query.username });
            if (user) {
                if (user._id == tokenId) {
                    res.status(200).send(_.pick(user, ['_id', 'username', 'firstName', 'lastName', 'token', 'wagers']))
                } else {
                    res.status(401).send('Incorrect credentials')
                }
            } else {
                res.status(404).send('Could not find user')
            }
        }
        else {
            var users = await User.find({});
            users = users.filter(u => u.notification)
            res.status(200).send(users)
        }


    } catch (er) {
        res.status(401).send('Must use a valid token')

        throw new Error(er);

    }
})

module.exports = router;