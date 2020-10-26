import * as types from "./actionTypes";
import * as espnApi from "../../api/espnApi";


export function loadGamesSuccess(games) {
    if (games != null) {
        return { type: types.LOAD_GAMES_SUCCESS, games };
    } else {
        return;
    }
}

export function loadGames(league, week) {
    return async function (dispatch) {
        return espnApi
            .getGames(league, week)
            .then(games => {
                return dispatch(loadGamesSuccess(games));
            })
            .catch(error => {
                console.log(error);
            });
    };
}

