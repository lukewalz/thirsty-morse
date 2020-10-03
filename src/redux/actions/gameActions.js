import * as types from "./actionTypes";
import * as espnApi from "../../api/espnApi";


export function loadGamesSuccess(games) {
    return { type: types.LOAD_GAMES_SUCCESS, games };
}

export function loadGames() {
    return async function (dispatch) {
        return espnApi
            .getGames()
            .then(games => {
                dispatch(loadGamesSuccess(games.data));
            })
            .catch(error => {
                console.log(error);
            });
    };
}