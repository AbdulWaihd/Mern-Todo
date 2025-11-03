/* eslint-disable react-refresh/only-export-components */

import {createContext, useEffect, useReducer} from 'react';

export const AuthContext = createContext();

const initalState = {
    user: null,
    
};
// Create Reducer Function
const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        default:
            return state;
    }
};
// Create Provider Component
export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initalState);
// Load user from localStorage (so session persists after refresh)
    useEffect(() => {
        const storedUser=JSON.parse(localStorage.getItem('user'));
        if(storedUser) {
            dispatch({type: 'LOGIN', payload: storedUser});
        }
    }, []);
    console.log('AuthContext state:', state);
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}

