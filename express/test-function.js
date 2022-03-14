const { schedule } = require("@netlify/functions");
// const { User } = require("./models/user");
const common = require("./helpers/common");
const mongoose = require("mongoose");

const connectionString = process.env.MONGO_ENDPOINT;

const connectToDatabase = async (uri) => {
  const client = await mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .catch((err) => console.error("Something went wrong", err));

  return client;
};

const handler = async function (db) {
  let count = 0;
  const users = await db.find({}).toArray();

  const response = await Promise.all(
    users.map(async (u) => {
      console.log(u);
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response, count),
  };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(connectionString);
  return schedule("@hourly", handler(db));
};
