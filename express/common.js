const fetch = require('node-fetch');
const { User } = require('./models/user');

async function determineResults(wager, user) {
    var apiPath = 'https://secure.espn.com/' + wager.sport + '/boxscore?gameId=' + wager.game_id + '&xhr=1';
    var home;
    var away;
    var gameStatus;

    if (wager.sport === 'soccer') {
        apiPath = 'https://www.espn.com/soccer/matchstats?gameId=' + wager.game_id + '&xhr=1'
    }

    await fetch(apiPath).then(e => e.json()).catch(er => er).then(r => {
        gameStatus = r.gamepackageJSON.header.competitions[0].status.type;
        home = { score: r.__gamepackage__.homeTeam.score, team: r.__gamepackage__.homeTeam.team.abbreviation };
        away = { score: r.__gamepackage__.awayTeam.score, team: r.__gamepackage__.awayTeam.team.abbreviation };
    }).catch(er => console.log(er));

    const newWager = Object.assign({}, wager);

    if (gameStatus.completed === false) {
        newWager.status = gameStatus.shortDetail.toLowerCase;
        newWager.outcome = 'push';
        addResultObject(newWager, user);
        return;
    }

    newWager.status = 'final';

    if (wager.wager_type === 'sp') {
        const selection = wager.selection.split('@');
        if (selection[0] === home.team) {
            var diff = parseFloat(home.score) + parseFloat(selection[1]);
            if (diff > parseInt(away.score)) {
                newWager.outcome = 'win'
                addResultObject(newWager, user);
            }
            else if (diff === parseInt(away.score)) {
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
            if (diff > parseInt(home.score)) {
                newWager.outcome = 'win'
                addResultObject(newWager, user)
            }
            else if (diff === parseInt(home.score)) {
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
        if (selection[0] === 'o') {
            if (parseFloat(selection[1]) > (parseInt(home.score) + parseInt(away.score))) {
                newWager.outcome = 'loss'
                addResultObject(newWager, user)
            }
            else if (parseFloat(selection[1]) === (parseInt(home.score) + parseInt(away.score))) {
                newWager.outcome = 'push'
                addResultObject(newWager, user)
            }
            else {
                newWager.outcome = 'win'
                addResultObject(newWager, user)
            }
        }
        if (selection[0] === 'u') {
            if (parseFloat(selection[1]) > (parseInt(home.score) + parseInt(away.score))) {
                newWager.outcome = 'win'
                addResultObject(newWager, user)
            }
            else if (parseFloat(selection[1]) === (parseInt(home.score) + parseInt(away.score))) {
                newWager.outcome = 'push'
                addResultObject(newWager, user)
            }
            else {
                newWager.outcome = 'loss'
                addResultObject(newWager, user)
            }
        }

    } else {

    }
}

async function log(type, user, funct) {
    const path = 'https://compassionate-almeida-c1cf6f.netlify.app/.netlify/functions/server/text';
    var number = 4029812986;
    var message = `${user} executed funtion: ${type} with a status: ${funct}`;
    var carrier = 'verizon';

    fetch(path, {
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ number, message, carrier })
    })
}

async function addResultObject(newWager, user) {
    var res = await User.findOneAndUpdate({ "_id": user._id, "wagers.wager_date": newWager.wager_date },
        { "wagers.$": newWager });
}

module.exports = { determineResults, log };
