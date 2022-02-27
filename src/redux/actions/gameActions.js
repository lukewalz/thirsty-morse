import * as types from "./actionTypes";
import * as espnApi from "../../api/espnApi";

export function loadGamesSuccess(games) {
  return { type: types.GET_GAMES_SUCCESS, payload: games };
}

export function loadGames(league, sport, date) {
  return async function (dispatch) {
    return espnApi.getGames(league, sport, date).then((games) => {
      return dispatch(loadGamesSuccess(games));
    });
  };
}
