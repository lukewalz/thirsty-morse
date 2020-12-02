const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/', async (req, res) => {

    // Check if this user already exisits
    let user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
        user = new User(_.pick(req.body, ['username', 'birth_year', 'password']));

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = jwt.sign({ _id: user._id }, process.env.API_KEY);
        console.log(token);
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'birth_year']));
    }
});

router.get('/', async (req, res) => {
    const token = process.env.API_KEY;
    try {
        jwt.verify(req.headers['x-auth-token'], token);
        let user = await User.findOne({ username: req.query.username });

        if (user) {
            res.send(_.pick(user, '_id', 'username'))
        } else {
            res.send('Could not find user')
        }

    } catch {
        res.status(401).send('Must use a valid token')
    }
})

module.exports = router;