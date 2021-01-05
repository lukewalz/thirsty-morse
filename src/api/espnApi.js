
export async function getGames(league) {
    var apiPath = 'https://secure.espn.com/core/' + league + '/schedule?year=2020&xhr=1';
    var response = await fetch(apiPath).then(e => e.json()).then(r => r.content.schedule);
    var size = Object.keys(response).length

    var games = [];
    for (let index = 0; index < size; index++) {
        games.push(...response[Object.keys(response)[index]].games);
    }

    return Promise.all(games.map(g => {
        var id = g.id
        return fetch('https://secure.espn.com/core/' + league + '/game?gameid=' + id + '&xhr=1').then(e => e.json()).then(f => f.gamepackageJSON);
    })).then(r => r)
}


