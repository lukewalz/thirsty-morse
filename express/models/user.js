const Joi = require('joi');
const Mongoose = require('mongoose');
const Joigoose = require("joigoose")(Mongoose);

const Schema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9$./]{3,1024}$')),


    access_token: [
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013)
})
    .with('username', 'birth_year')
    .xor('password', 'access_token')

const User = new Mongoose.model('Users',
    Joigoose.convert(Schema)
);

exports.User = User
