const Joi = require('joi');
const { ObjectID } = require('mongodb');
const Mongoose = require('mongoose');
const Joigoose = require("joigoose")(Mongoose);



const Schema = Joi.object({
    wager_date: Joi.number()
        .integer()
        .required(),
    sport: Joi.string()
        .required(),
    matchup: Joi.string()
        .required(),
    game_id: Joi.number()
        .integer()
        .required(),

    wager_type: Joi.string()
        .required(),

    selection_outcome: Joi.string()
        .required(),
    status: Joi.string()
        .required(),
    outcome: Joi.string(),
    amount: Joi.number()
        .required(),
    game_date: Joi.number()
        .integer()
        .required(),
    boost: Joi.number()
        .required(),
    result: Joi.number()
        .integer()
})

const Wager = new Mongoose.model('Wagers',
    Joigoose.convert(Schema),
);

exports.Wager = Wager
