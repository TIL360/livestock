import React, { useState } from 'react';
import axios from 'axios';

const ApplyOnline = () => {
  const [name, setName] = useState('');
  const [father, setFather] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [studentmobile, setStudentmobile] = useState('');
  const [fathermobile, setFathermobile] = useState('');
  const [matricmarks, setMatricmarks] = useState('');
  const [fsc, setFsc] = useState('');
  const [domicile, setDomicile] = useState('');
  const [progame, setProgame] = useState('');
  const [address, setAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name,
      father,
      cnic,
      dob,
      email,
      gender,
      studentmobile,
      fathermobile,
      matricmarks,
      fsc,
      domicile,
      progame,
      address,
    };
    console.log(formData);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/apply`, formData);
      console.log(response.data);
      setSuccessMessage('Application submitted successfully!');
      // Clear the form fields
      setName('');
      setFather('');
      setCnic('');
      setDob('');
      setEmail('');
      setGender('');
      setStudentmobile('');
      setFathermobile('');
      setMatricmarks('');
      setFsc('');
      setDomicile('');
      setProgame('');
      setAddress('');
    } catch (error) {
      console.error(error);
      alert('Error submitting application!');
    }
  };

  return (
    <div className="card col-md-8 mx-auto">
      <div className='align-item-center mt-4 ' style={{ height: "auto", padding: "15px" }}>
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>Application Form</h3>
          {successMessage && <div style={{ color: 'green', marginBottom: '15px' }}>{successMessage}</div>}
          
          <div className='row'>
            <div className='col-md-6'>
              <label>Student Name</label>
              <input required className='form-control' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='col-md-6'>
              <label>Father Name</label>
              <input required className='form-control' value={father} onChange={(e) => setFather(e.target.value)} />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>CNIC</label>
              <input required className='form-control' value={cnic} onChange={(e) => setCnic(e.target.value)} />
            </div>
            <div className='col-md-6'>
              <label>Date of Birth</label>
              <input required type='date' className='form-control' value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Email</label>
              <input required type='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='col-md-6'>
              <label>Gender</label>
              <select className='form-control' value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value=''>Select Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Student Mobile No</label>
              <input required type='tel' className='form-control' value={studentmobile} onChange={(e) => setStudentmobile(e.target.value)} />
            </div>
            <div className='col-md-6'>
              <label>Father's Mobile No</label>
              <input required type='tel' className='form-control' value={fathermobile} onChange={(e) => setFathermobile(e.target.value)} />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Matric Marks</label>
              <input required type='number'placeholder='If apply for Teacher, add 0 here' className='form-control' value={matricmarks} onChange={(e) => setMatricmarks(e.target.value)} />
            </div>
            <div className='col-md-6'>
              <label>F.Sc Marks</label>
              <input required type='number' placeholder='If apply for Teacher, add 0 here' className='form-control' value={fsc} onChange={(e) => setFsc(e.target.value)} />
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Domicile</label>
              <input required className='form-control' value={domicile} onChange={(e) => setDomicile(e.target.value)} />
            </div>
            <div className='col-md-6'>
              <label>Select Programe</label>
              <select className='form-control' value={progame} onChange={(e) => setProgame(e.target.value)}>
                <option value=''>Select One</option>
                <option value='PG'>PG</option>
                <option value='Nursery'>Nursery</option>
                <option value='One'>One</option>
                <option value='2nd'>2nd</option>
                <option value='3rd'>3rd</option>
                <option value='4th'>4th</option>
                <option value='5th'>5th</option>
                <option value='6th'>6th</option>
                <option value='7th'>7th</option>
                <option value='8th'>8th</option>
                <option value='9th'>9th</option>
                <option value='10'>10th</option>
                <option value='Teacher'>Teacher</option>
               
              </select>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <label>Address</label>
              <textarea className='form-control' value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
          <button className='btn btn-success mt-1'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyOnline;
