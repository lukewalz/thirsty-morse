const fetch = require('node-fetch');
const { User } = require('./models/user');

async function determineResults(wager, user) {
    var apiPath = 'https://secure.espn.com/college-football/boxscore?gameId=' + wager.game_id + '&xhr=1';
    var home;
    var away;
    await fetch(apiPath).then(e => e.json()).then(r => {
        home = { score: r.__gamepackage__.homeTeam.score, team: r.__gamepackage__.homeTeam.team.abbreviation };
        away = { score: r.__gamepackage__.awayTeam.score, team: r.__gamepackage__.awayTeam.team.abbreviation };
    });

    const newWager = Object.assign({}, wager);
    newWager.status = 'final';

    if (wager.wager_type === 'sp') {
        const selection = wager.selection.split('@');
        if (selection[0] === home.team) {
            var diff = parseFloat(home.score) + parseFloat(selection[1]);

            if (diff > away.score) {
                newWager.outcome = 'win'
                addResultObject(newWager, user);
            }
            else if (diff === away.score) {
                newWager.outcome = 'push'
                addResultObject(newWager, user)
            }
            else {
                newWager.outcome = 'loss'
                addResultObject(newWager, user);
            }
        }
        else {
            var diff = parseFloat(away.score) + parseFloat(selection[1]);
            if (diff > home.score) {
                newWager.outcome = 'win'
                addResultObject(newWager, user)
            }
            else if (diff === home.score) {
                newWager.outcome = 'push'
                addResultObject(newWager, user)
            }
            else {
                newWager.outcome = 'loss'
                addResultObject(newWager, user)
            }
        }


    }
    else if (wager.wager_type === 'ou') {
        const selection = wager.selection.split('@');
        if (wager.selection[0] === 'o') {
            if (wager.selection[1] > (home.score + away.score))
                newWager.outcome = 'win'
            addResultObject(newWager, user)
        }
        else if (wager.selection[1] === (home.score + away.score)) {
            newWager.outcome = 'push'
            addResultObject(newWager, user)
        }
        else {
            newWager.outcome = 'loss'
            addResultObject(newWager, user)
        }
    } else {

    }
}

async function addResultObject(newWager, user) {
    console.log(newWager.wager_date)
    await User.findOneAndUpdate({ "_id": user._id, "wagers.wager_date": newWager.wager_date },
        { "wagers.$": newWager });
}

module.exports = determineResults;