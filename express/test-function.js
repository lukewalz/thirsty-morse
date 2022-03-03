const { schedule } = require("@netlify/functions");
const { User } = require("./models/user");
const common = require("./helpers/common");

const handler = async function (event, context) {
  console.log(context);
  console.log("Received event:", event);

  try {
    const users = await User.find({});

    var count = 0;
    const response = Promise.all(
      users.map(async (u) => {
        if (u.wagers) {
          u.wagers.map(async (wag) => {
            count++;
            return await common.determineResults(wag, u);
          });
        }
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: response,
      }),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};

module.exports.handler = schedule("@hourly", handler);
