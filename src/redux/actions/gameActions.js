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

