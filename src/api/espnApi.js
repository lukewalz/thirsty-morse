import { current } from "immer";



export async function getGames(league, date) {

    var apiPath = 'https://secure.espn.com/core/' + league + '/schedule/_/date/' + date + '?xhr=1';
    var games = [];

    if (league === 'nhl') {
        apiPath = 'https://site.web.api.espn.com/apis/v2/scoreboard/header?sport=hockey&league=nhl&region=us&lang=en'
        var response = await fetch(apiPath).then(e => e.json()).then(r => r.sports[0].leagues[0].events);
        var dto = [];
        response.map(g => {
            if (g.odds) {
                var game = {
                    competitors: Array.from(g.competitors).map(c => ({ team: c })),
                    odds: g.odds,
                    date: g.date,
                    status: g.fullStatus,
                    id: g.id,
                    lastPlay: g.commentary ? g.commentary[g.commentary.length - 1]?.text : g.plays ? g.plays[g.plays.length - 1]?.text : '',
                    boxScore: g.boxscore?.teams
                };

                game.competitors[0].team.logos = [];
                game.competitors[1].team.logos = [];
                game.competitors[0].team.logos.push({ href: g.competitors[0].logo });
                game.competitors[1].team.logos.push({ href: g.competitors[1].logo });

                if (g.odds.homeTeamOdds.split(' ')[0] === game.competitors[0].team.abbreviation) {
                    g.odds.homeTeamOdds.moneyLine = game.odds.homeTeamOdds.moneyLine
                }

                dto.push(game);
            }
        })
        return dto;
    }
    else {
        var response = await fetch(apiPath).then(e => e.json()).then(r => r.content.schedule);
        var size = Object.keys(response).length

        for (let index = 0; index < size; index++) {
            games.push(...response[Object.keys(response)[index]].games);
        }

        return Promise.all(games.map(g => {
            var gameOrMatch = league === 'soccer' ? 'match' : 'game';
            var id = g.id
            return fetch('https://secure.espn.com/core/' + league + '/' + gameOrMatch + '?gameid=' + id + '&xhr=1&v=' + Date.now()).then(e => e.json()).then(f => f.gamepackageJSON);
        })).then(r => {
            var dto = [];
            r.map(g => {
                if (((g.odds && g.odds.findIndex(e => e.details && e.overUnder) >= 0)) || (g.pickcenter && g.pickcenter.findIndex(e => e.details && e.overUnder) >= 0)) {
                    var game = {
                        competitors: g.header.competitions[0].competitors,
                        odds: league === 'soccer' ? g.odds[g.odds.findIndex(e => e.details && e.overUnder)] : g.pickcenter[g.pickcenter.findIndex(e => e.details && e.overUnder)],
                        date: g.header.competitions[0].date,
                        status: g.header.competitions[0].status,
                        id: g.header.id,
                        lastPlay: g.commentary ? g.commentary[g.commentary.length - 1]?.text : g.plays ? g.plays[g.plays.length - 1]?.text : '',
                        boxScore: g.boxscore.teams
                    };
                    dto.push(game);
                }
                return true;
            })

            return dto
        })
    }
}

export async function getGameById(league, game_id) {
    var gameOrMatch = league === 'soccer' ? 'match' : 'game';

    var game = await fetch('https://secure.espn.com/core/' + league + '/' + gameOrMatch + '?gameid=' + game_id + '&xhr=1&v=' + Date.now()).then(e => e.json()).then(f => f.gamepackageJSON)
        .then(g => {

            var game = {
                competitors: g.header.competitions[0].competitors,
                odds: league === 'soccer' ? g.odds[g.odds.findIndex(e => e.details && e.overUnder)] : g.pickcenter[g.pickcenter.findIndex(e => e.details && e.overUnder)],
                date: g.header.competitions[0].date,
                status: g.header.competitions[0].status,
                id: g.header.id,
                lastPlay: g.commentary ? g.commentary[g.commentary.length - 1]?.text : g.plays ? g.plays[g.plays.length - 1]?.text : '',
                boxScore: g.boxscore.teams
            };
            return game;
        })
    return game;
}


