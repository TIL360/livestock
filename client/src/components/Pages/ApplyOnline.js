import React, { useState } from 'react';
import axios from 'axios';

const ApplicationForm = () => {
  // State variables for the form fields
  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [remarks, setRemarks] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data object
    const data = {
      name,
      cnic,
      mobile_no: mobileNo,
      address,
      remarks,
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/apply`, data);
      setMessage('Application submitted successfully!');
      setTimeout(() => {
        resetForm();
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage('Error submitting application! Please try again.');
    }
  };

  const resetForm = () => {
    setName('');
    setCnic('');
    setMobileNo('');
    setAddress('');
    setRemarks('');
    setMessage('');
  };

  return (
    <div className="card col-md-8 mx-auto" style={{ minHeight: '100vh' }}>
      <div className="align-item-center mt-4" style={{ padding: '15px' }}>
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>ہم سے رابطے کے لیے مندرجہ زیل فارم بھریں اور بھیجیں۔</h3>

          {/* Name Field */}
          <div className='mb-3'>
            <label>Name</label>
            <input
              required
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
          </div>

          {/* CNIC Field */}
          <div className='mb-3'>
            <label>CNIC</label>
            <input
              required
              className='form-control'
              value={cnic}
              onChange={(e) => setCnic(e.target.value)}
              maxLength={15}
            />
          </div>

          {/* Mobile No Field */}
          <div className='mb-3'>
            <label>Mobile No</label>
            <input
              required
              type='tel'
              className='form-control'
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              maxLength={20}
            />
          </div>

          {/* Remarks */}
          <div className='mb-3'>
            <label>Remarks</label>
            <textarea
              className='form-control'
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              maxLength={50}
            />
          </div>

          {/* Address Field */}
          <div className='mb-3'>
            <label>Address</label>
            <textarea
              className='form-control'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={50}
            />
          </div>

          {/* Submit Button */}
          <button className='btn btn-success mt-2'>Submit</button>
        </form>
        {message && (
          <div
            style={{
              marginTop: '15px',
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: message.includes('Error') ? 'red' : 'green',
              color: 'white',
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationForm;
