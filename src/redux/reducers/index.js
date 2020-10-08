import { combineReducers } from "redux";
import games from "./games";

const appReducer = combineReducers({
    games
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
