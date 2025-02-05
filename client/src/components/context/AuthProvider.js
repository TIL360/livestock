import React, { useState, useEffect } from "react";
import axios from "axios";
import userContext from './UserContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ username: ''});
    const [token, setToken] = useState('');
    const [standards, setStandards] = useState([]);

    useEffect(() => {
        const fetchStandards = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStandards(response.data);
            } catch (error) {
                console.error("Error fetching standards:", error);
            }
        };

        if (token) {
            fetchStandards();
        }
    }, [token]);

    const logout = () => {
        setUser({ username: '' });
        setToken('');
    
    };
    
    return (
        <userContext.Provider value={{ user, setUser, token, setToken, logout, standards }}>
            {children}
        </userContext.Provider>
    );
};

export default AuthProvider;
