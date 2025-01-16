import React, { useState } from "react";
import userContext from './UserContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ username: ''});
    const [token, setToken] = useState('');

    // Logout function (optional)
    const logout = () => {
        setUser({ username: '', });
        setToken('');
    };

    return (
        <userContext.Provider value={{ user, setUser, token, setToken, logout }}>
            {children}
        </userContext.Provider>
    );
};

export default AuthProvider;
