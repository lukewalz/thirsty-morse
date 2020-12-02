const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const express = require('express');
const auth = require('./routes/auth');
require('dotenv').config();
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const path = require('path');




const connectionString = 'mongodb+srv://luke_walz:ukKMvIfGUBZxGUBO@cluster0.3x57e.mongodb.net/walzsportsdb?retryWrites=true&w=majority';


if (!process.env.API_KEY) {
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}

console.log('Trying to connect to mongo...');

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err));

const app = express();

app.use(bodyParser.json());
app.use('/.netlify/functions/server/auth', auth);
app.use('/.netlify/functions/server/users', users);
// app.use('/api/users', users);


// app.use('/api/users', users);
// app.use('/api/auth', auth);

module.exports = app;
module.exports.handler = serverless(app);


