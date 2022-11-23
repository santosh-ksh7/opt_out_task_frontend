import {dec_cart, inc_cart, login, logout, set_cart} from "./action_type"

export function login_creator(){
    return{
        type: login
    }
}

export function logout_creator(){
    return{
        type: logout
    }
}

export function inc_cart_creator(){
    return{
        type: inc_cart
    }
}

export function dec_cart_creator(){
    return{
        type: dec_cart
    }
}

export function set_cart_creator(data){
    return{
        type: set_cart,
        payload: data
    }
}