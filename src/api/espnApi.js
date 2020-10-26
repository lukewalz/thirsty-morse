
export async function getGames(league, wk = 8) {
    var apiPath = 'https://secure.espn.com/core/' + league + '/schedule?week=' + wk + '&year=2020&xhr=1';
    return fetch(apiPath).then(e => e.json()).then(r => r.content.schedule);
}




