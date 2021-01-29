import * as types from "./actionTypes";
import * as lspnApi from "../../api/lspnApi";
import Cookies from 'universal-cookie';

export function operationSuccess(user, error) {
    return {

    };
}

export function loginUserSuccess(user) {
    return {
        type: types.LOGIN_SUCCESS,
        payload: user
    }
}

export function loadWagersSuccess(wagers) {
    return {
        type: types.GET_WAGERS_SUCCESS,
        payload: wagers
    }
}

export function placeWagerSuccess(wager) {
    return {
        type: types.ADD_WAGER_SUCCESS,
        payload: wager
    }
}




export function logoutUserSuccess() {
    return {
        type: types.LOGOUT_SUCCESS
    };
}

export function addUserSuccess(user) {
    return {
        type: types.ADD_USER_SUCCESS,
        payload: user

    }
}

export function login(username, password) {
    /// clear first
    localStorage.removeItem("user");
    const cookies = new Cookies();
    cookies.remove('userSession');

    return async function (dispatch) {
        return lspnApi
            .login(username, password)
            .then(user => {
                return dispatch(loginUserSuccess(user))
            })
            .catch(error => {
                throw error;
            });
    };
}

export function register(username, password, firstName, lastName) {
    return async function (dispatch) {
        return lspnApi
            .register(username, password, firstName, lastName)
            .then(user => {
                return dispatch(addUserSuccess(user))
            })
            .catch(error => {
                throw error;
            });
    };
}

export function logout() {
    localStorage.removeItem("user");
    const cookies = new Cookies();
    cookies.remove('userSession');
    return async function (dispatch) {
        return dispatch(logoutUserSuccess())
    };
}

export function placeWager(wager) {
    return async function (dispatch) {
        return lspnApi
            .placeWager(wager)
            .then(w => {
                return dispatch(placeWagerSuccess(w))
            })
            .catch(error => {
                throw error;
            });
    };
}

export function loadUpdatedWagers() {
    return async function (dispatch) {
        return lspnApi
            .getWagers()
            .then(wagers => {
                return dispatch(loadWagersSuccess(wagers))
            })
            .catch(error => {
                throw error;
            });
    }
}

