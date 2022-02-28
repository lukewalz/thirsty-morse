// import { current } from "immer";

export async function getGames(league, sport, date) {
  let apiPath = `https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=${sport}&league=${league}&region=us&lang=en&dates=${date}&v=${Date.now()}`;
  if (league.search('college') > -1) apiPath += '&groups=50';
  const response = await fetch(apiPath)
    .then((e) => e.json())
    .then((r) => r.sports[0].leagues[0].events);

  return response;
}

export async function getGameById(league, game_id) {
  const apiPath = `https://www.espn.com/${league}/game?gameId=${game_id}&xhr=1&v=${Date.now()}`;

  const response = await fetch(apiPath)
    .then((e) => e.json())
    .catch((er) => er)
    .then((r) => r)
    .catch((er) => new Error(er));

  return response.gamepackageJSON;
}
