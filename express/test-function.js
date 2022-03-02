const { schedule } = require('@netlify/functions');
const fetch = require("node-fetch");

const API_ENDPOINT = 'https://thirsty-morse-d0f09c.netlify.app/.netlify/functions/server/wagers/admin';

const handler = async function (event, context) {
  let response
  try {
    response = await fetch(API_ENDPOINT, {
      headers: {
        'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDRhOTI1NWU2ODg0MDAwMDkyYjhjYmUiLCJpYXQiOjE2MzA3MDA0MTh9.9WAk3qG_a7FdcOpUjVjCDgWFfjhFs2-j5ugBFcax45E'
      }
    })
    // handle response
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message
      })
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: response
    })
  }
}

module.exports.handler = schedule("@hourly", handler);
