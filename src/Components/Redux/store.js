import { applyMiddleware, combineReducers, createStore } from "redux"
import logger from "redux-logger";
import {cart_reducer, login_reducer} from "./reducer"


const root_reducer = combineReducers({
    user_login : login_reducer,
    user_cart : cart_reducer
})

export const store = createStore(root_reducer, applyMiddleware(logger));