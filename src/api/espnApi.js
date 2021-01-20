
export async function getGames(league) {
    var apiPath = 'https://secure.espn.com/core/' + league + '/schedule?year=2020&xhr=1';
    var response = await fetch(apiPath).then(e => e.json()).then(r => r.content.schedule);
    var size = Object.keys(response).length

    var games = [];
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
            if ((g.hasOdds && g.odds.findIndex(e => e.details && e.overUnder) >= 0) || league !== 'soccer') {
                var game = {
                    competitors: g.header.competitions[0].competitors,
                    odds: g.hasOdds ? g.odds[g.odds.findIndex(e => e.details && e.overUnder)] : g.pickcenter[g.pickcenter.findIndex(e => e.details && e.overUnder)],
                    date: g.header.competitions[0].date,
                    status: g.header.competitions[0].status,
                    id: g.header.id
                };
                dto.push(game);
            }

        })


        return dto
    })
}


