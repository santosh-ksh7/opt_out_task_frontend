import {login, logout} from "./action_type"

const initial_state = {
    isLoggedIn: false
}


export function login_reducer(state = initial_state, action){
    switch(action.type){
        case login : return{
            ...state,
            isLoggedIn: true
        }
        case logout : return{
            ...state,
            isLoggedIn: false
        }
        default: return state
    }
}