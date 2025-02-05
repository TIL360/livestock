import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from "../context/UserContext";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const { token } = useContext(userContext);
    const [showConfirm, setShowConfirm] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/apply`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
        fetchApplications();
    }, [token]);

    const deleteApplication = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/apply/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(applications.filter(application => application.applyid !== id));
            setSuccessMessage('Record deleted successfully');
            setShowConfirm(false); // Hide confirmation dialog
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const handleDeleteClick = (id) => {
        setApplicationToDelete(id);
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (applicationToDelete) {
            deleteApplication(applicationToDelete);
        }
    };

    return (
        <div style={{ backgroundColor: "white" }}>
            <h1 className='text-center'>Applications</h1>

            {successMessage && 
                <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px' }}>
                    {successMessage}
                </div>
            }

            {showConfirm && 
                <div  style={{ backgroundColor: 'skyblue', padding: '10px', marginBottom: '10px' }}>
                    <p><b>Are you sure you want to delete this application?</b></p>
                    <button className='btn btn-danger' onClick={handleConfirmDelete}>Yes</button>
                    <button className='btn btn-secondary ml-3' onClick={() => setShowConfirm(false)}>No</button>
                </div>
            }

            <table className='table table-bordered' style={{ backgroundColor: "transparent" }}>
                <thead>
                    <tr>
                        <th>Ser</th>
                        <th>Name</th>
                        <th>Father</th>
                        <th>Mobile</th>
                        <th>Father Mobile</th>
                        <th>Gender</th>
                        <th>Domicile</th>
                        <th>Marks</th>
                        <th>Programe</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application, index) => (
                        <tr key={application.id}>
                            <td>{index + 1}</td>
                            <td>{application.name}</td>
                            <td>{application.father}</td>
                            <td>{application.studentmobile}</td>
                            <td>{application.fathermobile}</td>
                            <td>{application.gender}</td>
                            <td>{application.domicile}</td>
                            <td>{application.matricmarks}</td>
                            <td>{application.progame}</td>
                            <td>
                                <button
                                    className='btn btn-danger'
                                    onClick={() => handleDeleteClick(application.applyid)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                        
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Applications;
