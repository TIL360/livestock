import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from "../context/UserContext";
// import { useNavigate } from 'react-router-dom';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const { token } = useContext(userContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  // const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  // Fetch applications on component mount or when token changes
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/apply`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };
    fetchApplications();
  }, [token]);

  const handleDeleteClick = (id) => {
    setApplicationToDelete(id);
    setShowConfirm(true);
    setDeletingId(id);
  };
  
  const deleteApplication = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/apply/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(prevApplications => prevApplications.filter(app => app.apply_id !== id));
      setSuccessMessage('Record deleted successfully');
      setTimeout(() => {
        setSuccessMessage('');
        // navigate('/dashboard/animalslist');
      }, 3000);
    } catch (error) {
      console.error('Error deleting application:', error);
    } finally {
      setShowConfirm(false);
      setDeletingId(null);
    }
  };

  const handleConfirmDelete = () => {
    if (applicationToDelete) {
      deleteApplication(applicationToDelete);
    }
  };
 
  return (
    <div style={{ backgroundColor: "white" }}>
      <h1 className='text-center'>Applications</h1>
      {successMessage && (
        <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px' }}>
          {successMessage}
        </div>
      )}
      {showConfirm && (
        <div style={{ backgroundColor: 'skyblue', padding: '10px', marginBottom: '10px' }}>
          <p><b>Are you sure you want to delete this application?</b></p>
          <button className='btn btn-danger' onClick={handleConfirmDelete}>Yes</button>
          <button className='btn btn-secondary ml-3' onClick={() => setShowConfirm(false)}>No</button>
        </div>
      )}
      {applications.length > 0 ? (
        <table className='table table-bordered' style={{ backgroundColor: "transparent" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>CNIC</th>
              <th>Mobile</th>
              <th>Date</th>
              <th>Address</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, index) => (
              <tr key={application.apply_id}>
                <td>{index + 1}</td>
                <td>{application.name}</td>
                <td>{application.cnic}</td>
                <td>{application.mobile_no}</td>
                <td>{application.created_at}</td>
                <td>{application.address}</td>
                <td>{application.remarks}</td>
                <td>
                  <button className='btn btn-danger' onClick={() => handleDeleteClick(application.apply_id)} >
                    Delete
                  </button>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>No applications found.</p>
      )}
    </div>
  );
};

export default Applications;
