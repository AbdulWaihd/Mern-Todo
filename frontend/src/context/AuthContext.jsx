import { createContext, useEffect, useReducer, useState } from 'react';

export const AuthContext = createContext();

const authReducer = (state, action) => {
    switch(action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
        setAuthReady(true);
    }, []);

    console.log('AuthContext state:', state);

    if (!authReady) {
        return <div className="loading-screen">Loading Taskflow...</div>;
    }

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
