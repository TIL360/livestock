import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import userContext from '../context/UserContext';

export default function StandardEdit() {
    const { sid } = useParams(); // Get the id from the URL
    const [standard, setStandard] = useState({ standard: '' });
    const { token } = useContext(userContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchStandard = async () => {
            if (!sid) {
                console.error("SID is undefined");
                return;
            }
            
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/fetche/${sid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Fetched standard:", response.data);
                setStandard(response.data);
            } catch (error) {
                setErrorMessage("Error fetching the standard");
                console.error("Error fetching the standard:", error);
            }
        };
        fetchStandard();
    }, [sid, token]);
    
    

    const handleChange = (e) => {
        setStandard({ ...standard, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Standard data being sent:", standard); // Log the data being updated
        try {
          await axios.put(`${process.env.REACT_APP_API_URL}/classes/${sid}`, { standard: standard.standard }, {
            headers: { Authorization: `Bearer ${token}`, },
          });
          setSuccessMessage('Standard updated successfully!');
          setTimeout(() => {
            navigate('/dashboard/standards');
          }, 2000);
        } catch (error) {
            console.error('Error updating standard:', error);
            setErrorMessage('Error updating standard');
          }
      };
      const handleback = (e) => {
        navigate('/dashboard/standards');
    }

    return (
        <div>
            <h1>Edit Standard</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="standard">ID</label>
                    <input
                        type="text"
                        className="form-control"
                        name="standard"
                        value={standard.sid}
                        onChange={handleChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="standard">Standard</label>
                    <input
                        type="text"
                        className="form-control"
                        name="standard"
                        value={standard.standard}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Update Standard</button>
                <button type="submit" className="btn btn-secondary ml-1" onClick={handleback}>Back</button>
            </form>
        </div>
    );
}
