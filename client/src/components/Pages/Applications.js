import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from "../context/UserContext";
import Modal from './Modal'; // Import the Modal component
import { useNavigate } from 'react-router-dom';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const { token } = useContext(userContext);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [applicationToAccept, setApplicationToAccept] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [applicationType, setApplicationType] = useState('');
    const [applicationToDelete, setApplicationToDelete] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/apply`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Fetched applications:', response.data); // Log the fetched applications
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
         
        fetchApplications();
    }, [token]);

    const deleteApplication = async (id) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/apply/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(applications.filter(application => application.applyid !== id));
            setSuccessMessage('Record deleted successfully');
            setShowConfirm(false);
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

    const handleAcceptClick = async (application) => {
        if (application.type === 'job') {
            // Directly insert the job application into staff_tbl
            await acceptJobApplication(application);
        } else {
            // If it's an admission application, show the modal
            setApplicationToAccept(application);
            setShowModal(true);
        }
    };

    const acceptJobApplication = async (application) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/apply/staff`, {
                ...application,
                // You can include additional data if needed
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccessMessage('Job application is accepted and recorded successfully!');
            setApplications(applications.filter(app => app.applyid !== application.applyid));
            setTimeout(() => {
                navigate('/dashboard/studentlist');
            }, 8000);
        } catch (error) {
            console.error('Error accepting job application:', error);
        }
    };

    const handleModalSubmit = async (admNo) => {
        console.log('Application to accept:', applicationToAccept); // Log this to see all properties
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/apply/basicinfo`, {
                adm_no: admNo,
                ...applicationToAccept,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccessMessage('Application is accepted and recorded successfully!');
            setTimeout(() => {
                navigate('/dashboard/studentlist');
            }, 8000);
            setShowModal(false);
            setApplications(applications.filter(app => app.applyid !== applicationToAccept.applyid));
        } catch (error) {
            console.error('Error accepting application:', error);
        }
    };

    const filteredApplications = applicationType ? applications.filter(app => app.type === applicationType) : applications;

    return (
        <div style={{ backgroundColor: "white" }}>
            <h1 className='text-center'>Applications</h1>

            {successMessage && <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px' }}>{successMessage}</div>}

            {showConfirm && (
                <div style={{ backgroundColor: 'skyblue', padding: '10px', marginBottom: '10px' }}>
                    <p><b>Are you sure you want to delete this application?</b></p>
                    <button className='btn btn-danger' onClick={handleConfirmDelete}>Yes</button>
                    <button className='btn btn-secondary ml-3' onClick={() => setShowConfirm(false)}>No</button>
                </div>
            )}

            <div className="mb-3">
                <label style={{ fontWeight: 'bold' }}>Select Type</label>
                <select className='mx-2 shadow p-2 rounded-pill border-3 border-info' value={applicationType} onChange={(e) => setApplicationType(e.target.value)}>
                    <option value=''>All Applications</option>
                    <option value='job'>Job Applications</option>
                    <option value='admission'>Admission Applications</option>
                </select>
            </div>

            {applicationType ? (
                <table className='table table-bordered' style={{ backgroundColor: "transparent" }}>
                    <thead>
                        <tr>
                            <th>Ser</th>
                            <th>Name</th>
                            <th>CNIC</th>
                            <th>DOB</th>
                            <th>Mobile</th>
                            {applicationType === 'job' && (
                                <>
                                    <th>Qual</th>
                                    <th>Experience</th>
                                    <th>Image</th>
                                </>
                            )}
                            {applicationType === 'admission' && (
                                <>
                                    <th>Father <br /> Name</th>
                                    <th>DOB <br /> In Urdu</th>
                                    <th>Name <br />Urdu</th>
                                    <th>Father <br />Urdu</th>
                                    <th>Domicile</th>
                                    <th>Class</th>
                                </>
                            )}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((application, index) => (
                                <tr key={application.applyid}>
                                    <td>{index + 1}</td>
                                    <td>{application.name}</td>
                                    <td>{application.cnic}</td>
                                    <td>{application.dob}</td>
                                    <td>{application.studentmobile}</td>
                                    {applicationType === 'job' && (
                                        <>
                                            <td>{application.qual}</td>
                                            <td>{application.exp}</td>
                                            <td><img src={`${process.env.REACT_APP_API_URL}/${application.image}`} alt="application" style={{ width: '50px', height: '50px' }} /></td>
                                        </>
                                    )}
                                    {applicationType === 'admission' && (
                                        <>
                                            <td>{application.father}</td>
                                            <td>{application.dob_urdu}</td>
                                            <td>{application.name_urdu}</td>
                                            <td>{application.fname_urdu}</td>
                                            <td>{application.domicile}</td>
                                            <td>{application.progame}</td>
                                        </>
                                    )}
                                    <td>
                                        <button className='btn btn-danger' onClick={() => handleDeleteClick(application.applyid)}>Delete</button>
                                        <button 
                                            className='btn btn-success ml-1' 
                                            onClick={() => handleAcceptClick(application)} 
                                        >
                                            Accept
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="100%" className="text-center">No applications found for this type.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Please select an application type to display data.</p>
            )}

            {/* Modal for entering adm_no */}
            <Modal 
                show={showModal}
                onClose={() => setShowModal(false)} 
                onSubmit={handleModalSubmit} 
            />
        </div>
    );
};

export default Applications;
