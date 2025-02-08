import React, { useState, useContext } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import userContext from '../context/UserContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Registration = () => { 
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [usertype, setUsertype] = useState(''); 
    const [error, setError] = useState(''); 
    const navigate = useNavigate(); 
    const { setUser, setToken } = useContext(userContext);

    const handleRegister = async (e) => { 
        e.preventDefault(); 
        const newUser = { username, password, usertype }; 
        try { 
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, newUser, { headers: { 'Content-Type': 'application/json' } }); 
            setUser({ username }); 
            setToken(response.data.token); 
            // Clear inputs after successful registration
            setUsername('');
            setPassword('');
            setUsertype('');
            navigate('/dashboard'); 
        } catch (err) { 
            setError(err.response ? err.response.data.message : 'Registration failed. Please try again.'); 
        } 
    };

    return ( 
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}> 
            <div className="login-card" style={{ backgroundColor: 'rgba(132, 159, 248, 0.8)', padding: '20px', borderRadius: '10px', width: "400px", boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}> 
                <h2 className="card-title text-center">Register New User</h2> 
                <form onSubmit={handleRegister} style={{ width: "100%" }} className='mt-4'> 
                    <div> 
                        <label className="form-label" htmlFor="username">Username:</label> 
                        <input className="form-input form-control" placeholder='username here...' type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /> 
                    </div> 
                    <div> 
                        <label className="form-label" htmlFor="password">Password:</label> 
                        <input className="form-input form-control" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /> 
                    </div> 
                    <div> 
                        <label className="form-label" htmlFor="usertype">User Type:</label> 
                        <select className="form-input form-control" id="usertype" value={usertype} onChange={(e) => setUsertype(e.target.value)} required>
                            <option value="">Select User Type</option>
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                            <option value="Student">Student</option>
                        </select>
                    </div> 
                    {error && <p className="error-message">{error}</p>} 
                    <br /> 
                    <button type="submit" className="btn btn-primary">Register</button> 
                </form> 
            </div> 
        </div> 
    ); 
};

export default Registration;
