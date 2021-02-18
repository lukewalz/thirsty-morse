const fetch = require('node-fetch');
const { User } = require('./models/user');

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
    var apiPath = 'https://secure.espn.com/' + wager.sport + '/boxscore?gameId=' + wager.game_id + '&xhr=1';
    var home;
    var away;
    var gameStatus;
    var currentLine;

    if (wager.sport === 'soccer') {
        apiPath = 'https://www.espn.com/soccer/matchstats?gameId=' + wager.game_id + '&xhr=1';
    }

    await fetch(apiPath).then(e => e.json()).catch(er => er).then(r => {
        gameStatus = r.gamepackageJSON.header.competitions[0].status.type;
        home = { score: r.__gamepackage__.homeTeam.score, team: r.__gamepackage__.homeTeam.team.abbreviation };
        away = { score: r.__gamepackage__.awayTeam.score, team: r.__gamepackage__.awayTeam.team.abbreviation };
        currentLine = r.gamepackageJSON.odds;
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
            console.log('already started')
            isValid = false;
        }
        else {
            const line = currentLine.findIndex(e => e.overUnder);

            switch (wager.wager_type) {
                case 'ml':
                    if (currentLine[line].awayTeamOdds.abbreviation === wager.selection.split('@')[0].toUpperCase()) {
                        if (currentLine[line].awayTeamOdds.moneyLine === wager.selection.split('@')[1]) {
                            console.log('ok away')
                        }
                        else {
                            console.log('wrong away')
                        }
                    }
                    else {
                        if (currentLine[line].homeTeamOdds.moneyLine === wager.selection.split('@')[1]) {
                            console.log('ok home')
                        }
                        else {
                            console.log('wrong home')
                        }
                    };
                    break;
                case 'sp':
                    if (currentLine[line].awayTeamOdds.abbreviation === wager.selection.split('@')[0].toUpperCase()) {
                        if (currentLine[line].awayTeamOdds.underdog) {
                            if (Math.abs(currentLine[line].details.split(' ')[1]) === wager.selection.split('@')[1]) {
                                if (currentLine[line].spreadOdds === wager.boost) {
                                    console.log('away sp true')
                                }
                                else {
                                    console.log('away sp false: boost')
                                }
                            }
                            else {
                                console.log('away sp false: line')
                            }
                        }
                        else {
                            if (-(currentLine[line].details.split(' ')[1]) === wager.selection.split('@')[1]) {
                                if (currentLine[line].spreadOdds === wager.boost) {
                                    console.log('away sp true')
                                }
                                else {
                                    console.log('away sp false: boost')
                                }
                            }
                            else {
                                console.log('away sp false: line')
                            }
                        }
                    }
                    else {
                        if (currentLine[line].homeTeamOdds.underdog) {
                            if (Math.abs(currentLine[line].details.split(' ')[1]) === wager.selection.split('@')[1]) {
                                if (currentLine[line].spreadOdds === wager.boost) {
                                    console.log('away sp true')
                                }
                                else {
                                    console.log('away sp false: boost')
                                }
                            }
                            else {
                                console.log('away sp false: line')
                            }
                        }
                        else {
                            if (-(currentLine[line].details.split(' ')[1]) === wager.selection.split('@')[1]) {
                                if (currentLine[line].spreadOdds === wager.boost) {
                                    console.log('away sp true')
                                }
                                else {
                                    console.log('away sp false: boost')
                                }
                            }
                            else {
                                console.log('away sp false: line')
                            }
                        }
                    };
                    break;
                case 'ou':
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
