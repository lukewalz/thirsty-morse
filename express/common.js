const fetch = require('node-fetch');

async function determineResults(wagers) {
    var apiPath = 'https://secure.espn.com/college-football/boxscore?gameId=' + wagers[0].game_id + '&xhr=1';
    var home;
    var away;
    await fetch(apiPath).then(e => e.json()).then(r => {
        home = { score: r.__gamepackage__.homeTeam.score, team: r.__gamepackage__.homeTeam.team.abbreviation };
        away = { score: r.__gamepackage__.awayTeam.score, team: r.__gamepackage__.awayTeam.team.abbreviation };
    });

    if (wagers[0].wager_type === 'sp') {
        const selection = wagers[0].selection.split('@');
        if (selection[0] === home.team) {
            var diff = parseInt(home.score) + parseInt(selection[1]);
            if (diff > away.score) {
                const newWager = Object.assign({}.wagers[0]);
                newWager.status = 'final';
                newWager.outcome = 'win';
                await User.findByIdAndUpdate(
                    { _id: user._id, wagers: wager[0] },
                    { $push: { wagers: newWager } },
                    { new: true }
                );
            }
            else {
                return 'LOSS'
            }
        }
        else {
            var diff = parseInt(away.score) + parseInt(selection[1]);
            if (diff > home.score) {
                return 'WIN'
            }
            else {
                return 'LOSS'
            }
        }


    }
    else if (wagers[0].wager_type === 'ml') {

    }
    else {

    }
}

module.exports = determineResults;