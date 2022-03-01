const { schedule } = require("@netlify/functions");
const fetch = require("node-fetch");

const handler = function (event, context) {
  const response = fetch(
    "https://thirsty-morse-d0f09c.netlify.app/.netlify/functions/server/wagers/admin",
    {
      headers: {
        "x-auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDRhOTI1NWU2ODg0MDAwMDkyYjhjYmUiLCJpYXQiOjE2MzA3MDA0MTh9.9WAk3qG_a7FdcOpUjVjCDgWFfjhFs2-j5ugBFcax45E",
      },
    }
  )
    .then((e) => e)
    .catch((er) => er);

  return response;
};

module.exports.handler = schedule("@hourly", handler);
