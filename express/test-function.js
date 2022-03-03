const { schedule } = require("@netlify/functions");
const jwt = require("jsonwebtoken");
const { User } = require("./models/user");
const common = require("./helpers/common");

const handler = async function (event, context) {
  console.log(context);
  console.log("Received event:", event);

  const token = process.env.API_KEY;

  try {
    jwt.verify(context.req.headers["x-auth-token"], token);
    const tokenId = jwt.decode(context.req.headers["x-auth-token"], token)._id;

    const users = await User.find({});

    if (tokenId === "604a9255e6884000092b8cbe") {
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
    } else {
      context.res.status(401).send("Incorrect credentials");
    }
  } catch (er) {
    context.res.status(401).send("Must use a valid token");

    throw new Error(er);
  }
};

module.exports.handler = schedule("@hourly", handler);
