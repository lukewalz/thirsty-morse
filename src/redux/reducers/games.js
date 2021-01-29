import * as types from "../actions/actionTypes";
import produce from "immer"


const INITIAL_STATE = []


export const games = produce((draft, action) => {
    switch (action.type) {
        case types.GET_GAMES_SUCCESS: {
            return action.payload
        }
    }
}, INITIAL_STATE);