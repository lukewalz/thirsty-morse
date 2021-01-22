import * as types from "./actionTypes";
import * as lspnApi from "../../api/lspnApi";
import Cookies from 'universal-cookie';

export function operationSuccess(user, error) {
    console.log(user)
    if (user !== null) {
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
                return dispatch(operationSuccess(user, null))
            })
            .catch(error => {
                return dispatch(operationSuccess(null, error))
            });
    };
}

export function register(username, password, firstName, lastName) {
    return async function (dispatch) {
        return lspnApi
            .register(username, password, firstName, lastName)
            .then(user => {
                return dispatch(operationSuccess(user, null))
            })
            .catch(error => {
                return dispatch(operationSuccess(null, error))
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
                return dispatch(operationSuccess(w, null))
            })
            .catch(error => {
                return dispatch(operationSuccess(null, error))
            });
    };
}

export function loadUpdatedWagers() {
    return async function (dispatch) {
        return lspnApi
            .getWagers()
            .then(w => {
                return dispatch(operationSuccess(w, null))
            })
            .catch(error => {
                return dispatch(operationSuccess(null, error))
            });
    }
}

