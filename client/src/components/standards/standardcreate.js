// standardcreate.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/UserContext';

export default function StandardCreate() {
    const [standard, setStandard] = useState('');
    const { token } = useContext(userContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setStandard(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending POST request
            await axios.post(`${process.env.REACT_APP_API_URL}/classes`, { standard }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccessMessage('Standard created successfully!');
            setTimeout(() => {
                navigate('/dashboard/standards'); // Navigate after success
            }, 2000);
        } catch (error) {
            console.error('Error creating standard:', error);
            setErrorMessage('Error creating standard');
        }
    };
const handleback = (e) => {
    navigate('/dashboard/standards');
}
    return (
        <div className='container-fluid'>
            <h1 className='text-center'>Create New Standard</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="standard"><b>Standard</b></label>
                    <input
                        type="text"
                        className="form-control"
                        name="standard"
                        value={standard}
                        onChange={handleChange}
                        required
                        autoComplete='off'
                    />
                </div>
                <button type="submit" className="btn btn-success">Create Standard</button>
                <button type="submit" className="btn btn-secondary ml-1" onClick={handleback}>Back</button>
            </form>
        </div>
    );
}
