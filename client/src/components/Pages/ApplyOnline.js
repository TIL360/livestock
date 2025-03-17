import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplyOnline = () => {
  const [applicationType, setApplicationType] = useState('');
  const [name, setName] = useState('');
  const [father, setFather] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [studentmobile, setStudentmobile] = useState('');
  const [fathermobile, setFathermobile] = useState('');
  const [qual, setQual] = useState('');
  const [domicile, setDomicile] = useState('');
  const [progame, setProgame] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [fnameUrdu, setFnameUrdu] = useState('');
  const [fatherCnic, setFatherCnic] = useState('');
  const [motherCnic, setMotherCnic] = useState('');
  const [fatherProfession, setFatherProfession] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [dobUrdu, setDobUrdu] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes/public`);
        setPrograms(response.data);
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('father', father);
    formData.append('cnic', cnic);
    formData.append('dob', dob);
    formData.append('email', email);
    formData.append('gender', gender);
    formData.append('studentmobile', studentmobile);
    formData.append('fathermobile', fathermobile);
    formData.append('qual', qual);
    formData.append('domicile', domicile);
    formData.append('progame', progame);
    formData.append('address', address);
    formData.append('experience', experience);
    formData.append('name_urdu', nameUrdu);
    formData.append('fname_urdu', fnameUrdu);
    formData.append('father_cnic', fatherCnic);
    formData.append('mother_cnic', motherCnic);
    formData.append('father_profession', fatherProfession);
    formData.append('religion', religion);
    formData.append('caste', caste);
    formData.append('previous_school', previousSchool);
    formData.append('dob_urdu', dobUrdu);
    formData.append('type', applicationType);
    if (image) {
      formData.append('image', image);
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`Application submitted successfully! `);
      
      // Set a timeout to reset the form after displaying the message for 3 seconds
      setTimeout(() => {
        resetForm();
      }, 3000); // 3000 milliseconds = 3 seconds
    } catch (error) {
      console.error(error);
      setMessage('Error submitting application! Please try again.');
    }
  };

  const resetForm = () => {
    setApplicationType('');
    setName('');
    setFather('');
    setCnic('');
    setDob('');
    setEmail('');
    setGender('');
    setStudentmobile('');
    setFathermobile('');
    setQual('');
    setDomicile('');
    setProgame('');
    setAddress('');
    setExperience('');
    setNameUrdu('');
    setFnameUrdu('');
    setFatherCnic('');
    setMotherCnic('');
    setFatherProfession('');
    setReligion('');
    setCaste('');
    setPreviousSchool('');
    setDobUrdu('');
    setImage(null);
    setMessage('');
  };

  return (
    <div className="card col-md-8 mx-auto" style={{height:"100vh"}}>
      <div className='align-item-center mt-4 ' style={{ height: "auto", padding: "15px" }}>
        <form onSubmit={handleSubmit}>
          <h3 className='text-center'>Application Form</h3>
         
  {/* Application Type Selection */}
          <div className='row mb-3'>
            <div className='col-md-12'>
              <label>Select Application Type</label>
              <select className='form-control' value={applicationType} onChange={(e) => setApplicationType(e.target.value)} required>
                <option value=''>Select One</option>
                <option value='job'>Apply for Job</option>
                <option value='admission'>Apply for Admission</option>
              </select>
            </div>
          </div>

          {applicationType === 'admission' && (
            <>
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
                  <input type='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
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
                  <label>Emergency Contact No</label>
                  <input type='tel' className='form-control' value={studentmobile} onChange={(e) => setStudentmobile(e.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label>Father's Mobile No</label>
                  <input required type='tel' className='form-control' value={fathermobile} onChange={(e) => setFathermobile(e.target.value)} />
                </div>
              </div>
            
              <div className='row'>
                <div className='col-md-6'>
                  <label>Domicile</label>
                  <input required className='form-control' value={domicile} onChange={(e) => setDomicile(e.target.value)} />
                </div>
                
                <div className='col-md-6'>
                  <label>Select Program</label>
                  <select className='form-control' value={progame} onChange={(e) => setProgame(e.target.value)}>
                    <option value=''>Select One</option>
                    {programs.map((program) => (
                      <option key={program.sid} value={program.standard}>{program.standard}</option>
                    ))}
                  </select>
                </div>
              
              </div>
             
              <div className='row'>
                <div className='col-md-6'>
                  <label>Name (Urdu)</label>
                  <input className='form-control' value={nameUrdu} onChange={(e) => setNameUrdu(e.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label>Father's Name (Urdu)</label>
                  <input className='form-control' value={fnameUrdu} onChange={(e) => setFnameUrdu(e.target.value)} />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <label>Father's CNIC</label>
                  <input className='form-control' value={fatherCnic} onChange={(e) => setFatherCnic(e.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label>Mother's CNIC</label>
                  <input className='form-control' value={motherCnic} onChange={(e) => setMotherCnic(e.target.value)} />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <label>Father's Profession</label>
                  <input className='form-control' value={fatherProfession} onChange={(e) => setFatherProfession(e.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label>Religion</label>
                  <input className='form-control' value={religion} onChange={(e) => setReligion(e.target.value)} />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <label>Caste</label>
                  <input className='form-control' value={caste} onChange={(e) => setCaste(e.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label>Previous School</label>
                  <input className='form-control' value={previousSchool} onChange={(e) => setPreviousSchool(e.target.value)} />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-6'>
                  <label>Date of Birth (In English)</label>
                  <input className='form-control' value={dobUrdu} onChange={(e) => setDobUrdu(e.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label>Image</label>
                  <input type='file' className='form-control' onChange={(e) => setImage(e.target.files[0])} />
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12'>
                  <label>Address</label>
                  <textarea className='form-control' value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
              </div>
             
            
            </>
          )}

          {applicationType === 'job' && (
            <>
              <div className='row'>
                <div className='col-md-6'>
                  <label>Applicant Name</label>
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
                  <input type='email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
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
                  <label>Mobile No</label>
                  <input required type='tel' className='form-control' value={studentmobile} onChange={(e) => setStudentmobile(e.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label>Experience</label>
                  <input required className='form-control' value={experience} onChange={(e) => setExperience(e.target.value)} />
                </div>
              </div>
              <div className='row'>
              <div className='col-md-6'>
                  <label>Qualification</label>
                  <input required type='text' className='form-control' value={qual} onChange={(e) => setQual(e.target.value)} />
                </div>
                <div className='col-md-6'>
                  <label>Image</label>
                  <input required type='file' className='form-control' onChange={(e) => setImage(e.target.files[0])} />
                </div>
              </div>
            </>
          )}

          <button className='btn btn-success mt-1'>Submit</button>
        </form>
      </div>
      {message && (
  <div
    style={{
      color: 'white',
      backgroundColor: message.includes('Error') ? 'red' : 'green',
      marginBottom: '15px',
      padding: '10px',
      borderRadius: '5px'
    }}
  >
    {message}
  </div>
)}
    </div>
  );
};

export default ApplyOnline;
