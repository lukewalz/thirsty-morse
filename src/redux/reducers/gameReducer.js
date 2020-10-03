import * as types from "../actions/actionTypes";

export default function gamesReducer(state = [], action) {
    switch (action.type) {
        case types.LOAD_GAMES_SUCCESS:
            return action.games;
        default:
            return null;
    }
}
