const { schedule } = require("@netlify/functions");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const { User } = require("./models/user");

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
  console.log(db.model);

  let body = JSON.parse(event.body);
  console.log(body);

  const users = await User.find();
  await Promise.all(
    await users.map(async (user) =>
      await user.wagers
        .filter((wager) => wager.status === "pending")
        ?.map(async (wag) => await determineResults(wag, user))
    )
  );

  return {
    statusCode: 200,
  };
};

async function determineResults(wager, user) {
  const game = await getGameById(wager);
  console.log(game);
  const { competitors, status } = game.header.competitions[0];

  const newWager = Object.assign({}, wager);

  let response;
  if (status.type.completed !== false) {
    newWager.status = "final";
    if (newWager.wager_type === "sp") {
      const [selectedTeam, selectedAmount] = newWager.selection.split("@");
      const adjustedSelectionScore =
        parseFloat(
          competitors.find((c) => c.team.abbreviation === selectedTeam).score
        ) + parseFloat(selectedAmount);
      const notSelectionScore = parseFloat(
        competitors.find((c) => c.team.abbreviation !== selectedTeam).score
      );

      if (adjustedSelectionScore === notSelectionScore) {
        newWager.outcome = "push";
      } else if (adjustedSelectionScore > notSelectionScore) {
        newWager.outcome = "win";
      } else {
        newWager.outcome = "loss";
      }
      response = addResultObject(newWager, user);
    } else if (wager.wager_type === "ou") {
      const selection = wager.selection.split("@");
      if (selection[0] === "o") {
        if (
          parseFloat(selection[1]) >
          parseInt(competitors[0].score) + parseInt(competitors[1].score)
        ) {
          newWager.outcome = "loss";
          response = addResultObject(newWager, user);
        } else if (
          parseFloat(selection[1]) ===
          parseInt(competitors[0].score) + parseInt(competitors[1].score)
        ) {
          newWager.outcome = "push";
          response = addResultObject(newWager, user);
        } else {
          newWager.outcome = "win";
          response = addResultObject(newWager, user);
        }
      }
      if (selection[0] === "u") {
        if (
          parseFloat(selection[1]) >
          parseInt(competitors[0].score) + parseInt(competitors[1].score)
        ) {
          newWager.outcome = "win";
          response = addResultObject(newWager, user);
        } else if (
          parseFloat(selection[1]) ===
          parseInt(competitors[0].score) + parseInt(competitors[1].score)
        ) {
          newWager.outcome = "push";
          response = addResultObject(newWager, user);
        } else {
          newWager.outcome = "loss";
          response = addResultObject(newWager, user);
        }
      }
    } else {
      const selection = wager.selection.split("@");
      if (selection[0] === competitors[0].team) {
        if (parseInt(competitors[0].score) > parseInt(competitors[1].score)) {
          newWager.outcome = "win";
          response = addResultObject(newWager, user);
        } else if (
          parseInt(competitors[0].score) === parseInt(competitors[1].score)
        ) {
          newWager.outcome = "push";
          response = addResultObject(newWager, user);
        } else {
          newWager.outcome = "loss";
          response = addResultObject(newWager, user);
        }
      } else {
        if (parseInt(competitors[0].score) < parseInt(competitors[1].score)) {
          newWager.outcome = "win";
          response = addResultObject(newWager, user);
        } else if (
          parseInt(competitors[0].score) === parseInt(competitors[1].score)
        ) {
          newWager.outcome = "push";
          response = addResultObject(newWager, user);
        } else {
          newWager.outcome = "loss";
          response = addResultObject(newWager, user);
        }
      }
    }
  } else {
    if (status.type.state === 'in') {
      newWager.outcome = 'pending';
      response = addResultObject(newWager, user);
    }
  }
}

async function getGameById(wager) {
  let apiPath = `https://www.espn.com/${wager.sport}/game?gameId=${wager.game_id
    }&xhr=1&v=${Date.now()}`;

  const response = await fetch(apiPath)
    .then((e) => e.json())
    .catch((er) => er)
    .then((r) => r)
    .catch((er) => new Error(er));

  return response.gamepackageJSON;
}

async function addResultObject(newWager, user) {
  var amount = await calculatePayout(
    newWager.boost,
    Math.abs(newWager.amount),
    newWager.outcome
  );
  newWager.result = amount;
  var res = await User.findOneAndUpdate(
    { _id: user._id, "wagers.wager_date": newWager.wager_date },
    { "wagers.$": newWager },
    { returnNewDocument: true }
  );
  return res;
}

async function calculatePayout(boost, amountBet, result) {
  if (boost) {
    var rate = 0;
    if (boost > 0) {
      rate = (parseInt(boost) / 100) * amountBet;
    } else {
      rate = (100 / parseInt(boost)) * amountBet;
    }

    if (result === "win") {
      return Math.abs(rate);
    } else if (result === "loss") {
      return -+amountBet;
    } else {
      return 0;
    }
  } else {
    if (result === "win") {
      return amountBet;
    } else if (result === "loss") {
      return parseInt(-amountBet).toString();
    } else {
      return "0";
    }
  }
}

module.exports.handler = schedule("* * * * *", handler);
