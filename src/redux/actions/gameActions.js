import * as types from "./actionTypes";
import * as espnApi from "../../api/espnApi";


export function loadGamesSuccess(games) {
    return { type: types.LOAD_GAMES_SUCCESS, games };
}

export function gameChangedSuccess(game, change) {
    return { type: types.GAME_CHANGED_SUCCESS, game, change }
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

export function changeGame(game, change) {
    return async function (dispatch) {
        dispatch(gameChangedSuccess(game, change));
    }
}