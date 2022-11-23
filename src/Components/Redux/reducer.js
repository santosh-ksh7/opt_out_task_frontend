import {dec_cart, inc_cart, login, logout, set_cart} from "./action_type"

const initial_state = {
    isLoggedIn: false,
    cart: 0
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


export function cart_reducer(state = initial_state, action){
    switch(action.type){
        case inc_cart : return{
            ...state,
            cart: state.cart + 1
        }
        case dec_cart : return{
            ...state,
            cart: state.cart - 1
        }
        case set_cart : return{
            ...state,
            cart: action.payload
        }
        default: return state
    }
}