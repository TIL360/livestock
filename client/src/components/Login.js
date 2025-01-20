import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from './context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(userContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = { username, password };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setUser({ username });
      setToken(response.data.token);
      console.log('Token received:', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="login-card" style={{
        backgroundColor: 'rgba(132, 159, 248, 0.8)',
        padding: '20px',
        borderRadius: '10px',
        width: "400px",
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 className="card-title text-center">Welcome! Please Login</h2>
        <form onSubmit={handleLogin} style={{ width: "100%" }} className='mt-4'>
          <div>
            <label className="form-label " htmlFor="username">Username:</label>
            <input className="form-input form-control" placeholder='username here...' type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="form-label" htmlFor="password">Password:</label>
            <input className="form-input form-control" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-message">{error}</p>}
          <br />
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;