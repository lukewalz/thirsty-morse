const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/users');
const express = require('express');
const auth = require('./routes/auth');
const wagers = require('./routes/wagers');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
require('dotenv').config();
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


const connectionString = process.env.MONGO_ENDPOINT;

if (!process.env.API_KEY) {
    console.log(process.env)
    console.error('FATAL ERROR: PrivateKey is not defined.');
    process.exit(1);
}



mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .catch(err => console.error('Something went wrong', err));

const app = express();

Sentry.init({
    dsn: "https://bfdd5c484bed47959f8f571825567e6b@o247578.ingest.sentry.io/5615139",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(bodyParser.json());
app.use(cors());
app.use('/.netlify/functions/server/auth', auth);
app.use('/.netlify/functions/server/users', users);
app.use('/.netlify/functions/server/wagers', wagers);


module.exports = app;
module.exports.handler = serverless(app);


