import { handleResponse } from "./apiUtils";

export async function getGames() {
    var week = getNumberOfWeek();
    var apiPath = 'https://api.collegefootballdata.com/games?year=2020&seasonType=regular&week=' + week;
    var file = await fetch(apiPath, {
        method: "GET"
    });

    var gameList = await handleResponse(file);

    return gameList;
}

function getNumberOfWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return (Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7) - 35);
}

export async function loadGameDetails(game) {
    var apiPath = 'https://api.collegefootballdata.com/lines?year=2020&gameId=' + game.id
    var file = await fetch(apiPath, {
        method: "GET"
    });

    var gameDetails = await handleResponse(file);

    gameDetails = Object.assign({}, gameDetails)
    var logo = await loadLogos(game);
    var team_history = await loadTeamStats(game.home_team, game.away_team);
    var o = Object.assign({}, gameDetails);
    o.logo = logo;
    o.awayTeamStats = team_history[0];
    o.homeTeamStats = team_history[1];
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

async function loadTeamStats(homeTeam, awayTeam) {
    var path = 'https://api.collegefootballdata.com/stats/season/advanced?year=2020&team=';
    var awayResponse = await fetch(path + awayTeam).then(e => e.json()).then(r => r);
    var homeResponse = await fetch(path + homeTeam).then(e => e.json()).then(r => r);
    return [awayResponse, homeResponse]
}




