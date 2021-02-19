const fetch = require('node-fetch');
const { User } = require('../models/user');

async function determineResults(wager, user) {
    var { gameStatus, home, away } = await getGameById(wager);

    const newWager = Object.assign({}, wager);

    if (gameStatus.completed === false) {
        if (gameStatus.state === 'in') {
            newWager.status = 'pending';
            newWager.outcome = 'tbd';
            addResultObject(newWager, user);
            return;
        }
        else if (gameStatus.state === 'pre') {
            return;
        }
        else {
            newWager.status = gameStatus.shortDetail.toLowerCase();
            newWager.outcome = 'push';
            addResultObject(newWager, user);
            return;
        }

    }
    else {
        newWager.status = 'final';
        if (newWager.wager_type === 'sp') {
            const selection = newWager.selection.split('@');
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
            const selection = wager.selection.split('@');
            if (selection[0] === home.team) {
                if (parseInt(home.score) > parseInt(away.score)) {
                    newWager.outcome = 'win'
                    addResultObject(newWager, user)
                }
                else if (parseInt(home.score) === parseInt(away.score)) {
                    newWager.outcome = 'push'
                    addResultObject(newWager, user)
                }
                else {
                    newWager.outcome = 'loss'
                    addResultObject(newWager, user)
                }
            }
            else {
                if (parseInt(home.score) < parseInt(away.score)) {
                    newWager.outcome = 'win'
                    addResultObject(newWager, user)
                }
                else if (parseInt(home.score) === parseInt(away.score)) {
                    newWager.outcome = 'push'
                    addResultObject(newWager, user)
                }
                else {
                    newWager.outcome = 'loss'
                    addResultObject(newWager, user)
                }
            }
        }
    }

}

async function getGameById(wager) {
    //https://secure.espn.com/core/' + league + '/' + gameOrMatch + '?gameid=' + id + '&xhr=1
    var apiPath = 'https://secure.espn.com/core/' + wager.sport + '/game?gameId=' + wager.game_id + '&xhr=1';
    var home;
    var away;
    var gameStatus;
    var currentLine;

    if (wager.sport === 'soccer') {
        apiPath = 'https://secure.espn.com/core/' + league + '/' + gameOrMatch + '?gameid=' + id + '&xhr=1';
    }

    console.log(apiPath);

    await fetch(apiPath).then(e => e.json()).catch(er => er).then(r => {
        gameStatus = r.gamepackageJSON.header.competitions[0].status.type;
        home = { score: r.__gamepackage__.homeTeam.score, team: r.__gamepackage__.homeTeam.team.abbreviation };
        away = { score: r.__gamepackage__.awayTeam.score, team: r.__gamepackage__.awayTeam.team.abbreviation };
        currentLine = r.gamepackageJSON.odds || r.gamepackageJSON.pickcenter;
        // (r.gamepackageJSON.odds && r.gamepackageJSON.odds.findIndex(e => e.details && e.overUnder) || r.gamepackageJSON.pickcenter && r.gamepackageJSON.pickcenter.findIndex(e => e.details && e.overUnder))
    }).catch(er => new Error(er));

    return { gameStatus, home, away, currentLine };
}

async function addResultObject(newWager, user) {
    var amount = await calculatePayout(newWager.boost, Math.abs(newWager.amount), newWager.outcome);
    newWager.result = amount;
    var res = await User.findOneAndUpdate({ "_id": user._id, "wagers.wager_date": newWager.wager_date },
        { "wagers.$": newWager });
}

async function calculatePayout(boost, amountBet, result) {
    if (boost) {
        var rate = 0;
        if (boost > 0) {
            rate = ((parseInt(boost) / 100) * amountBet)
        }
        else {
            rate = ((100 / parseInt(boost)) * amountBet)
        }

        if (result === 'win') {
            return Math.abs(rate);
        }
        else if (result === 'loss') {
            return - + amountBet
        } else {
            return 0
        }
    }
    else {
        if (result === 'win') {
            return amountBet;
        }
        else if (result === 'loss') {
            return (parseInt(-amountBet)).toString()
        } else {
            return "0"
        }
    }

}

async function validateWager(wager) {
    try {
        var isValid = false;
        var { gameStatus, currentLine } = await getGameById(wager);

        // step 1: validate game hasn't started
        if (!gameStatus || gameStatus.state !== 'pre') {
            isValid = false;
        }
        else {
            const line = currentLine.findIndex(e => e.details && e.overUnder);

            const spreadSource = currentLine[line].details.split(' ');
            const submitted = wager.selection.split('@');

            const mlAwaySource = currentLine[line].awayTeamOdds.moneyLine;
            const mlHomeSource = currentLine[line].homeTeamOdds.moneyLine;

            switch (wager.wager_type) {
                case 'ml':
                    if (parseInt(submitted[1]) === parseInt(mlAwaySource)
                        || parseInt(submitted[1]) === parseInt(mlHomeSource)) {
                        isValid = true
                    }
                    else {
                        isValid = false;
                    }
                    break;
                case 'sp':
                    if (parseFloat(spreadSource[1]) === parseFloat(submitted[1]) && spreadSource[0] === submitted[0]) {
                        if (currentLine[line].awayTeamOdds.spreadOdds === wager.boost) {
                            isValid = true;
                        }
                        else if (currentLine[line].homeTeamOdds.spreadOdds === wager.boost) {
                            isValid = true;
                        }
                        else {
                            isValid = false;
                        }
                    }
                    else if (parseFloat(spreadSource[1]) === -parseFloat(submitted[1]) && spreadSource[0] !== submitted[0]) {
                        if (currentLine[line].awayTeamOdds.spreadOdds === wager.boost) {
                            isValid = true;
                        }
                        else if (currentLine[line].homeTeamOdds.spreadOdds === wager.boost) {
                            isValid = true;
                        }
                        else {
                            isValid = false;
                        }
                    }
                    else {
                        isValid = false;
                    }

                    break;
                case 'ou':
                    if (parseInt(submitted[1]) === parseInt(currentLine[line].overUnder)) {
                        isValid = true;
                    }
                    else {
                        isValid = false;
                    }
                    break;
                default:
                    break;
            }

            return isValid;




        }
    }
    catch (er) {
        console.log(er);
        return false;
    }
}

module.exports = { determineResults, validateWager };
