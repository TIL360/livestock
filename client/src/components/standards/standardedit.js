import React, { useEffect, useState, useContext } from 'react'; 
import axios from 'axios'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import userContext from '../context/UserContext';

export default function StandardEdit() { 
    const { sid } = useParams(); // Get the id from the URL 
    const [standard, setStandard] = useState(''); // Initialize as a string
    const { token } = useContext(userContext); 
    const navigate = useNavigate(); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchStandard = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/fetches/${sid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Assuming response.data.standard is a string
                setStandard(response.data.standard);
            } catch (error) {
                console.error("Error fetching standard:", error.response.data);
                setErrorMessage("Error fetching standard: " + error.response.data);
            }
        };
        fetchStandard();
    }, [sid, token]);

    const handleChange = (e) => {
        setStandard(e.target.value); // Set standard directly as a string
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Standard data being sent:", { standard }); // Log the data being updated
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/classes/update/${sid}`, { standard }, {
                headers: { Authorization: `Bearer ${token}` },
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

    const handleBack = () => {
        navigate('/dashboard/standards');
    };

    return (
        <div style={{background:"white"}}>
            <h1 className='text-center'>Edit Standard</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="sid">ID</label>
                    <input
                        type="text"
                        className="form-control"
                        name="sid"
                        value={sid} // Display the sid directly
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="standard">Standard</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="standard" 
                        value={standard} // Use the string directly
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-success">Update Standard</button>
                <button type="button" className="btn btn-secondary ml-1" onClick={handleBack}>Back</button>
            </form>
        </div>
    );
}
