const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const determineResults = require('../common');
const statusTypes = require('../statusTypes');
const common = require('../common');




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
            common.log(statusTypes.USER_TYPE_ADD, user.username, 'success');

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
        const user = await User.findOne({ username: req.query.username });
        if (user) {
            if (user._id == tokenId) {
                common.log(statusTypes.USER_TYPE_GET, user.username, 'success');

                res.status(200).send(_.pick(user, ['_id', 'username', 'firstName', 'lastName', 'token']))
            } else {
                common.log(statusTypes.USER_ERROR_CREDENTIALS, user.username, 'error');

                res.status(401).send('Incorrect credentials')
            }
        } else {
            common.log(statusTypes.USER_ERROR_USER, user.username, 'fail');

            res.status(404).send('Could not find user')
        }

    } catch {
        res.status(401).send('Must use a valid token')

        throw new Error(er);

    }
})

module.exports = router;