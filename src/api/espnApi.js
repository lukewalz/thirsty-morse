import axios from 'axios';

const apiKey = 'jE7yBJVRNAwdDesMgTzTXUUSx1It41Fq';
const date = '20210309';

export async function getGames(sport) {
    const options = {
        method: 'GET',
        url: `https://api.foxsports.com/bifrost/v1/${sport}/scoreboard/segment/${date}?apikey=${apiKey}&groupId=2`,
    };

    var res = await axios.request(options).then((response) => {
        return response.data.sectionList[0].events.map(async event => {
            const options2 = {
                method: 'GET',
                url: `https://api.foxsports.com/bifrost/v1/${sport}/event/${event.id.replace(sport, '')}/data?apikey=${apiKey}`,
            };
            return axios.request(options2).then((response2) => response2.data).then(async x => {
                var game = {
                    teams: [x.header.leftTeam, x.header.rightTeam],
                    date: x.header.eventTime,
                    status: { status_id: x.header.eventStatus },
                    id: x.header.id
                }
                if (game.status.status_id === 1) {
                    game.status.status_line = `${x.header.statusLine}${x.header.statusLine2 ? '-' + x.header.statusLine2 : ''}`;
                    game.lastplay = x.eventHeadline;
                    game.boxscore = x.boxscore.boxscoreSections[2].boxscoreMatchup
                    return game
                }

                if (game.status.status_id === 2) {

                    const optionsMatchup = {
                        method: 'GET',
                        url: `https://api.foxsports.com/bifrost/v1/${sport}/event/${event.id.replace(sport, '')}/matchup?apikey=${apiKey}`,
                    };

                    var matchupResponse = await axios.request(optionsMatchup).then((responseMatchup) => responseMatchup.data).then(x => {
                        if (x.oddsSixPack) {
                            return {
                                sp: x.oddsSixPack.items[0]?.odds,
                                ml: x.oddsSixPack.items[1].odds,
                                ou: x.oddsSixPack.items[2].odds
                            }
                        }
                        else {
                            return null
                        }
                    });
                    game.odds = matchupResponse
                    console.log(game.odds)
                    if (game.odds !== null) {
                        return game

                    }

                }
            })
        });
    }).catch(function (error) {
        console.error(error);
    });

    var t = await Promise.all(res).then(p => p);

    return t;
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


