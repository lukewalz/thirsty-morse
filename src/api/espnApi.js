import { handleResponse } from "./apiUtils";

export async function getGames() {
    var week = getNumberOfWeek();

    var apiPath = 'https://api.collegefootballdata.com/games?year=2020&seasonType=regular&week=' + week;
    var e = await fetch(apiPath, { method: "GET" });
    var json_e = await e.json();

    var c = Promise.all(json_e.map((item) => {
        return loadGameDetails(item).then((details) => {
            var o = Object.assign({}, item);
            o.lines = details[0].lines[0].formattedSpread;
            o.over_under = details[0].lines[0].overUnder;
            o.logos = details.logo;
            return o;
        }).catch(err => console.log('no formatted spread on this'))
    }));


    var finalResult = c.then(w => w);

    return finalResult;
}

function getNumberOfWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return (Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7) - 35);
}

async function loadGameDetails(game) {
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




