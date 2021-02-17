import * as types from '../actions/actionTypes';
import Cookies from 'universal-cookie';
import produce from "immer"
const _ = require('lodash');

const cookies = new Cookies();


function isAuth() {
    var auth = cookies.get('userSession') && !!localStorage.getItem("user");
    if (auth === undefined) {
        return false;
    }
    return auth;
}
const INITIAL_STATE = {
    isAuthUser: isAuth(),
    user: JSON.parse(localStorage.getItem("user")) || {},
    isLoading: false,
    error: null,
    wagers: []
};


export const user = produce((draft, action) => {
    switch (action.type) {
        case types.LOGIN_SUCCESS: {
            const userObject = _.pick(action.payload, ['_id', 'username', 'firstName', 'lastName']);
            const wagersObject = _.pick(action.payload, ['wagers']).wagers;
            localStorage.setItem("user", JSON.stringify(userObject));
            draft.user = userObject;
            draft.wagers = wagersObject
            draft.isAuthUser = isAuth();
            break;
        }
        case types.ADD_USER_SUCCESS: {
            localStorage.setItem("user", JSON.stringify(action.payload));
            draft.user = action.payload;
            draft.isAuthUser = isAuth();
            break;
        }
        case types.LOGOUT_SUCCESS: {
            draft.user = {};
            draft.isAuthUser = isAuth();
            break
        }
        case types.ADD_WAGER_SUCCESS: {
            draft.wagers.push(action.payload);
            break;
        }
        case types.GET_WAGERS_SUCCESS: {
            draft.wagers = action.payload;
            break;
        }
        default:
            return draft;
    }
}, INITIAL_STATE);