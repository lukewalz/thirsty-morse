import * as types from "./actionTypes";
import * as espnApi from "../../api/espnApi";


export function loadGamesSuccess(games) {
    if (games != null) {
        return { type: types.LOAD_GAMES_SUCCESS, games };
    } else {
        return;
    }
}

export function loadGames() {
    return async function (dispatch) {
        return espnApi
            .getGames()
            .then(games => {
                dispatch(loadGamesSuccess(games));
            })
            .catch(error => {
                console.log(error);
            });
    };
}

export function loadGameDetailsSuccess(gameLine) {
    return { type: types.LOAD_GAME_DETAILS_SUCCESS, gameLine }
}


export function loadGameDetails(gameLine) {
    return async function (dispatch) {
        return espnApi
            .loadGameDetails(gameLine)
            .then(details => {
                console.log(details);
                return dispatch(loadGameDetailsSuccess(details));
            })
            .catch(error => {
                console.log(error, gameLine)
            });
    }
}
