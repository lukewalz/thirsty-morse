import * as types from "../actions/actionTypes";
import produce from "immer"


const INITIAL_STATE = []


export const games = produce((draft, action) => {
    switch (action.type) {
        case types.GET_GAMES_SUCCESS: {
            return action.payload
        }
        case types.GET_ALL_GAMES_SUCCESS: {
            return [...draft, action.payload];
        }
        default:
            return draft;
    }
}, INITIAL_STATE);