import { combineReducers } from "redux";
import gamesReducer from "./gameReducer";

const appReducer = combineReducers({
    gamesReducer
});

const rootReducer = (state, action) => {

    return appReducer(state, action);
};

export default rootReducer;
