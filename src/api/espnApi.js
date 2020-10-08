import Games from "../Games";
import { handleResponse, handleError } from "./apiUtils";

export async function getGames() {
    var apiPath = 'https://api.collegefootballdata.com/games?year=2020&seasonType=regular&week=6'
    var file = await fetch(apiPath, {
        method: "GET"
    });

    var gameList = await handleResponse(file);

    return gameList;
}

export async function loadGameDetails(game) {
    var apiPath = 'https://api.collegefootballdata.com/lines?year=2020&gameId=' + game.id
    var file = await fetch(apiPath, {
        method: "GET"
    });

    var gameDetails = await handleResponse(file);

    gameDetails = Object.assign({}, gameDetails)
    var logo = await loadLogos(game);
    var o = Object.assign({}, gameDetails);
    o.logo = logo;
    var updateValue = Object.assign({}, gameDetails, o);
    return updateValue;
}

async function loadLogos(team) {
    var path = 'https://api.collegefootballdata.com/teams/fbs?year=2020';
    var response = await fetch(path).then(e => e.json()).then(r => r);
    var home_logo = await response.filter(item => item.id === team.home_id);
    var away_logo = await response.filter(item => item.id === team.away_id);
    return [home_logo, away_logo];
}




