import * as types from "../actions/actionTypes";

export default function gamesReducer(state = [], action) {
    switch (action.type) {
        case types.LOAD_GAMES_SUCCESS:
            return action.games;
        case types.GAME_CHANGED_SUCCESS:

            return state.map(item => {
                if (item.home_team !== action.game.home_team) {
                    // This isn't the item we care about - keep it as-is
                    return item;
                } else {
                    // Otherwise, this is the one we want - return an updated value
                    return {
                        ...item,
                        ...action
                    };

                }
            });
        default:
            return null;
    }
}
