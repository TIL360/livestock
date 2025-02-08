import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateUser = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useContext(userContext);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    
    const credentials = { currentPassword, newPassword };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/change-password`, credentials, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(response.data.message);
      // Clear the input fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Password change failed. Please try again.');
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
        <h2 className="card-title text-center">Change Password</h2>
        <form onSubmit={handleChangePassword} style={{ width: "100%" }} className='mt-4'>
          <div>
            <label className="form-label" htmlFor="currentPassword">Current Password:</label>
            <input className="form-input form-control" type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="mt-2">
            <label className="form-label" htmlFor="newPassword">New Password:</label>
            <input className="form-input form-control" type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="mt-2">
            <label className="form-label" htmlFor="confirmPassword">Confirm New Password:</label>
            <input className="form-input form-control" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <p className="error-message text-danger">{error}</p>}
          <br />
          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
