const { schedule } = require("@netlify/functions");
const common = require("./helpers/common");
const { Users } = require("./models/user");
const mongoose = require("mongoose");

const connectionString = process.env.MONGO_ENDPOINT;

const connectToDatabase = async () => {
  const client = await mongoose
    .connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .catch((err) => console.error("Something went wrong", err));
  return client;
};

const handler = async function (event, context) {
  let body = JSON.parse(event.body);
  console.log(body);

  const users = await Users.find({});
  console.log(users);
  const response = await Promise.all(
    users.map(async (user) => user.wagers.filter(wager => wager.status === 'pending')?.map(async wag => await common.determineResults(wag, user))))

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response?.length),
  };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();
  return schedule("@hourly", handler);
};
