const { schedule } = require('@netlify/functions')
const handler = async function (event, context) {
  const response = await context.http.get({
    headers: {
      'x-auth-token': ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDRhOTI1NWU2ODg0MDAwMDkyYjhjYmUiLCJpYXQiOjE2MzA3MDA0MTh9.9WAk3qG_a7FdcOpUjVjCDgWFfjhFs2-j5ugBFcax45E']
    },
    url: "https://thirsty-morse-d0f09c.netlify.app/.netlify/functions/server/wagers/admin",
  });

  return EJSON.stringify(response);
};

module.exports.handler = schedule("@hourly", handler);
