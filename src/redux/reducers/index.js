import { combineReducers } from "redux";
import games from "./games";
import user from "./user";

const appReducer = combineReducers({
    games,
    user
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
