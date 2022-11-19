import {login, logout} from "./action_type"

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