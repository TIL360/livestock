import React, { useState, useEffect } from 'react';
import axios from 'axios';
import userContext from './UserContext';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ username: '' });
    const [token, setToken] = useState('');
    const [usertype, setUsertype] = useState('');
    const [standards, setStandards] = useState([]);
    const [admno, setAdmno] = useState(""); // New state for admno
    const [feeDetail, setFeeDetail] = useState({}); // New state for fee details

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

    // Log usertype whenever it changes
    useEffect(() => {
        console.log("Token:", token);
        console.log("User :", user);
        console.log("User type :", usertype);
      }, [token, user, usertype]);

    const logout = () => {
        setUser({ username: '' });
        setToken('');
    };
    
    return (
        <userContext.Provider value={{ user, setUser, token, setToken, usertype, setUsertype, logout, standards, admno, setAdmno, feeDetail, setFeeDetail }}>
            {children}
        </userContext.Provider>
    );
};

export default AuthProvider;
