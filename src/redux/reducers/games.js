import * as types from "../actions/actionTypes";

export default function games(state = [], action) {
    switch (action.type) {
        case types.LOAD_GAMES_SUCCESS:
            return action.games;
        case types.LOAD_GAME_DETAILS_SUCCESS:
            if (action.gameLine != null) {
                return state.map(item => {
                    if (item.id !== action.gameLine[0].id) {
                        // This isn't the item we care about - keep it as-is
                        return item;
                    } else {
                        var o = Object.assign({}, item);
                        if (action.gameLine[0].lines[0] !== undefined) {
                            o.lines = action.gameLine[0].lines[0].formattedSpread;
                        }
                        o.team_data = action.gameLine.logo;
                        o.home_team_stats = action.gameLine.homeTeamStats;
                        o.away_team_stats = action.gameLine.awayTeamStats;

                        var updateValue = Object.assign({}, item, o);
                        // Otherwise, this is the one we want - return an updated value
                        return {
                            ...item,
                            ...updateValue
                        };
                    }
                });
            }
            else {
                return state
            }

        default:
            return null;
    }
}
