import { applyMiddleware, createStore } from "redux"
import logger from "redux-logger";
import {login_reducer} from "./reducer"

export const store = createStore(login_reducer, applyMiddleware(logger));