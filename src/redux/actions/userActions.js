import * as types from "./actionTypes";
import * as lspnApi from "../../api/lspnApi";
import Cookies from 'universal-cookie';

export function loginUserSuccess(user, error) {
    if (user != null) {
        return {
            type: types.API_SUCCESS, payload:
            {
                isAuthUser: true,
                user: user,
                isLoading: false,
                error: error
            }
        };
    } else {
        return {
            type: types.API_ERROR, payload:
            {
                isAuthUser: false,
                user: user,
                isLoading: false,
                error: error
            }
        }
    }
}

export function registerUserSuccess(user, error) {
    if (user != null) {
        return {
            type: types.API_SUCCESS, payload:
            {
                isAuthUser: true,
                user: user,
                isLoading: false,
                error: error
            }
        };
    } else {
        return {
            type: types.API_ERROR, payload:
            {
                isAuthUser: false,
                user: user,
                isLoading: false,
                error: error
            }
        }
    }
}

export function placeWagerSuccess(wager, error) {
    if (wager != null) {
        return {
            type: types.API_SUCCESS, payload:
            {
                user: wager,
                isLoading: false,
                error: error
            }
        };
    } else {
        return {
            type: types.API_ERROR, payload:
            {
                wager: wager,
                isLoading: false,
                error: error
            }
        }
    }
}


export function logoutUserSuccess() {
    return {
        type: types.LOGOUT
    };
}

export function login(username, password) {
    return async function (dispatch) {
        return lspnApi
            .login(username, password)
            .then(user => {
                return dispatch(loginUserSuccess(user, null))
            })
            .catch(error => {
                return dispatch(loginUserSuccess(null, error))
            });
    };
}

export function register(username, password, firstName, lastName) {
    return async function (dispatch) {
        return lspnApi
            .register(username, password, firstName, lastName)
            .then(user => {
                return dispatch(registerUserSuccess(user, null))
            })
            .catch(error => {
                return dispatch(registerUserSuccess(null, error))
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
                console.log(w)
                return dispatch(placeWagerSuccess(w, null))
            })
            .catch(error => {
                return dispatch(placeWagerSuccess(null, error))
            });
    };
}

