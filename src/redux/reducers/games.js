import * as types from "../actions/actionTypes";

export default function games(state = [], action) {
    switch (action.type) {
        case types.LOAD_GAMES_SUCCESS:
            var size = Object.keys(action.games).length

            var games = [];
            for (let index = 0; index < size; index++) {
                games.push(...action.games[Object.keys(action.games)[index]].games);
            }
            return games;

        default:
            return null;
    }
}
