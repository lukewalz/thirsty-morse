import * as types from '../actions/actionTypes';
import Cookies from 'universal-cookie';
import produce from "immer"

const cookies = new Cookies();


function isAuth() {
    var auth = cookies.get('userSession') && !!localStorage.getItem("user");
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
            localStorage.setItem("user", JSON.stringify(action.payload));
            draft.user = action.payload;
            draft.isAuthUser = isAuth();
            break;
        }
        case types.ADD_USER_SUCCESS: {

        }
        case types.LOGOUT_SUCCESS: {
            draft.user = {};
            draft.isAuthUser = isAuth();
            break
        }
        case types.ADD_WAGER_SUCCESS: {
            var t = Object.assign({}, draft);
            t.user.wagers.push(action.payload);
            draft = t;
            console.log(t);
            break;

        }
        case types.GET_WAGERS_SUCCESS: {
            draft.user.wagers = action.payload;
            break;
        }
    }
}, INITIAL_STATE);