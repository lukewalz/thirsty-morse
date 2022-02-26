import { current } from "immer";

export async function getGames(league, date, sport) {
  var apiPath = `https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=${sport}&league=${league}&region=us&lang=en`;
  var response = await fetch(apiPath)
    .then((e) => e.json())
    .then((r) => r.sports[0].leagues[0].events);

  return response;
}

export async function getGameById(league, game_id) {
  var gameOrMatch = league === "soccer" ? "match" : "game";

  var game = await fetch(
    "https://secure.espn.com/core/" +
      league +
      "/" +
      gameOrMatch +
      "?gameid=" +
      game_id +
      "&xhr=1&v=" +
      Date.now()
  )
    .then((e) => e.json())
    .then((f) => f.gamepackageJSON)
    .then((g) => {
      var game = {
        competitors: g.header.competitions[0].competitors,
        odds:
          league === "soccer"
            ? g.odds[g.odds.findIndex((e) => e.details && e.overUnder)]
            : g.pickcenter[
                g.pickcenter.findIndex((e) => e.details && e.overUnder)
              ],
        date: g.header.competitions[0].date,
        status: g.header.competitions[0].status,
        id: g.header.id,
        lastPlay: g.commentary
          ? g.commentary[g.commentary.length - 1]?.text
          : g.plays
          ? g.plays[g.plays.length - 1]?.text
          : "",
        boxScore: g.boxscore.teams,
      };
      return game;
    });
  return game;
}
