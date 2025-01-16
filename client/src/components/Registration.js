import React, { useState } from "react"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

const Registration = () => { 
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [usertype, setUsertype] = useState(''); 
    const navigate = useNavigate(); 

    // Form submit function
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        console.log('Submitting form with:', { username, password, usertype });
    
        axios.post(`${process.env.REACT_APP_API_URL}/user/signup`, { username, password, usertype })
            .then(res => {
                console.log('Response:', res.data); 
                navigate('/');
            })
            .catch(err => {
                console.error('Error:', err.response ? err.response.data : err); 
                alert("Registration failed!"); 
            });
    }

    return ( 
        <div className="container col-md-4 mh-100 my-5" style={{ boxShadow: "2px 2px 2px 2px" }}>
            <h1 className="my-4 text-center">Registration Page</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>User Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="usernameInput"
                        placeholder="User Name"
                        autoComplete="off"
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="passwordInput">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="passwordInput"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Usertype</label>
                    <input
                        type="text"
                        className="form-control"
                        id="usertypeInput"
                        placeholder="Usertype"
                        onChange={(e) => setUsertype(e.target.value)}
                        required 
                    />
                </div>
             
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
            <br /><br />
        </div>
    );
}

export default Registration;
