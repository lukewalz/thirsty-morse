const { schedule } = require("@netlify/functions");
const { User } = require("./models/user");
const common = require("./helpers/common");
const mongoose = require("mongoose");

const connectionString = process.env.MONGO_ENDPOINT;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((err) => console.error("Something went wrong", err));

const handler = async function (event, context) {
  let count = 0;
  const users = await User.find({});
  const response = await Promise.all(
    users.map(async (u) => {
      if (u.wagers) {
        u.wagers.map(async (wag) => {
          await common.determineResults(wag, u);
          count++;
        });
      }
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: `${count} wagers updated`,
    }),
  };
};

module.exports.handler = schedule("@hourly", handler);
