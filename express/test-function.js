const { schedule } = require("@netlify/functions");
const common = require("./helpers/common");
const User = require("./models/user");
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
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase();

  let body = JSON.parse(event.body);
  console.log(body);

  const users = await db.models.Users.find();
  const response = await Promise.all(
    users.map(async (user) => user.wagers.filter(wager => wager.status === 'pending')?.map(async wag => await common.determineResults(wag, user))))
  console.log(response);
  return {
    statusCode: 200,
  };
};

module.exports.handler = schedule("15 * * * *", handler);
