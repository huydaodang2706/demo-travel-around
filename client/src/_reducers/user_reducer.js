import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
} from '../_actions/types';
 

const user = (state={},action) => {
    switch(action.type){
        case REGISTER_USER:
            // console.log(action.payload)
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            // console.log('Auth user data: ' + JSON.stringify(action.payload))
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        default:
            return state;
    }
}

export default user