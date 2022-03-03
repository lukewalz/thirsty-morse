const { schedule } = require("@netlify/functions");
const { User } = require("./models/user");
const common = require("./helpers/common");

const handler = async function (event, context) {
  console.log(context);
  console.log("Received event:", event);

  try {
    const users = await User.find({});

    var count = 0;
    Promise.all(
      users.map(async (u) => {
        if (u.wagers) {
          u.wagers.map(async (wag) => {
            count++;
            return await common.determineResults(wag, u);
          });
        }
      })
    )
      .then((e) => {
        context.res.status(201).send(`${count} wagers updated`);
      })
      .catch((err) => console.log(err));
  } catch (er) {
    context.res.status(401).send("Must use a valid token");

    throw new Error(er);
  }
};

module.exports.handler = schedule("@hourly", handler);
