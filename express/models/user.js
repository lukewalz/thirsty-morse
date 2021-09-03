const Joi = require('joi');
const Mongoose = require('mongoose');
const Joigoose = require("joigoose")(Mongoose);
const { Wager } = require('../models/wager');

const Schema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9$./]{3,1024}$')),


    firstName: Joi.string()
        .max(30)
        .required(),

    lastName: Joi.string()
        .max(30)
        .required(),


    dateAdded: Joi.number()
        .integer(),

    wagers: [Wager],

    notification: {
        endpoint: Joi.string(),
        keys: Joi.object({
            auth: Joi.string(),
            p256dh: Joi.string()
        })
    },

    balance: Joi.number()
        .integer(),
})
    .with('username', 'birth_year')
    .xor('password', 'access_token')

const User = new Mongoose.model('Users',
    Joigoose.convert(Schema)
);

exports.User = User
