import { API_SUCCESS, API_ERROR, SET_LOADER, LOGOUT } from '../actions/actionTypes';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


function isAuth() {
    var auth = cookies.get('userSession') && !!localStorage.getItem("user");
    return auth;
}

export default function user(

    state = {
        isAuthUser: isAuth(),
        user: JSON.parse(localStorage.getItem("user")) || {},
        isLoading: false,
        error: null
    },
    action
) {
    switch (action.type) {
        case API_SUCCESS:
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            return { ...state, isAuthUser: true, user: action.payload.user, error: null };
        case API_ERROR:
            return { ...state, isAuthUser: false, user: {}, error: action.payload.error };
        case SET_LOADER:
            return { ...state, isLoading: action.payload };
        case LOGOUT:
            return { ...state, isAuthUser: false, user: {} };
        default:
            return state;
    }
};