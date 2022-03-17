const fetch = require("node-fetch");
const { User } = require("../models/user");

async function getGameById(wager) {
  let apiPath = `https://www.espn.com/${wager.sport}/game?gameId=${
    wager.game_id
  }&xhr=1&v=${Date.now()}`;

  const response = await fetch(apiPath)
    .then((e) => e.json())
    .catch((er) => console.log("er1", er))
    .then((r) => r)
    .catch((err) => console.log("er2", err));

  return response.gamepackageJSON;
}
async function validateWager(wager) {
  try {
    let isValid = false;
    const { header, pickcenter } = await getGameById(wager);

    // step 1: validate game hasn't started
    if (
      !header.competitions[0].status.type ||
      header.competitions[0].status.type.state !== "pre"
    ) {
      isValid = false;
    } else {
      const line = pickcenter.find((e) => e.provider.id === "45");

      const spreadSource = line.details.split(" ");
      const submitted = wager.selection.split("@");

      const mlAwaySource = line.awayTeamOdds.moneyLine;
      const mlHomeSource = line.homeTeamOdds.moneyLine;

      switch (wager.wager_type) {
        case "ml":
          if (
            parseInt(submitted[1]) === parseInt(mlAwaySource) ||
            parseInt(submitted[1]) === parseInt(mlHomeSource)
          ) {
            isValid = true;
          } else {
            isValid = false;
          }
          break;
        case "sp":
          if (
            parseFloat(spreadSource[1]) === parseFloat(submitted[1]) &&
            spreadSource[0] === submitted[0]
          ) {
            if (line.awayTeamOdds.spreadOdds === wager.boost) {
              isValid = true;
            } else if (line.homeTeamOdds.spreadOdds === wager.boost) {
              isValid = true;
            } else {
              isValid = false;
            }
          } else if (
            parseFloat(spreadSource[1]) === -parseFloat(submitted[1]) &&
            spreadSource[0] !== submitted[0]
          ) {
            if (line.awayTeamOdds.spreadOdds === wager.boost) {
              isValid = true;
            } else if (line.homeTeamOdds.spreadOdds === wager.boost) {
              isValid = true;
            } else {
              isValid = false;
            }
          } else {
            isValid = false;
          }

          break;
        case "ou":
          if (parseInt(submitted[1]) === parseInt(line.overUnder)) {
            isValid = true;
          } else {
            isValid = false;
          }
          break;
        default:
          break;
      }

      return isValid;
    }
  } catch (er) {
    return false;
  }
}

module.exports = { validateWager };
