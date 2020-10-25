import { combineReducers } from "redux";
import user from "./user";
import trailsReducer from './../trailSlice';

export default combineReducers({
    user,
    trails: trailsReducer
});
