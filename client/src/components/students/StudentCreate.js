import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from '../context/UserContext';

export default function StudentCreate() {
  const [rollNo, setRollNo] = useState('');
  const [admNo, setAdmNo] = useState('');
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [father, setFather] = useState('');
  const [nameurdu, setNameurdu] = useState('');
  const [fatherurdu, setFatherurdu] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);
  const [admDate, setAdmDate] = useState('');
  const [admStandard, setAdmStandard] = useState('');
  const [currentStandard, setCurrentStandard] = useState(''); // New state for current standard
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [fatherCnic, setFatherCnic] = useState('');
  const [motherCnic, setMotherCnic] = useState('');
  const [fatherProfession, setFatherProfession] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [dobUrdu, setDobUrdu] = useState('');
  const [standards, setStandards] = useState([]);

  const navigate = useNavigate();
  const { token } = useContext(userContext);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStandards(response.data);
      } catch (err) {
        console.error("Error fetching standards:", err);
      }
    };
    fetchStandards();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('roll_no', rollNo);
    formData.append('adm_no', admNo);
    formData.append('name', name);
    formData.append('father', father);
    formData.append('nameurdu', nameurdu);
formData.append('fatherurdu', fatherurdu);
    formData.append('monthly_fee', monthlyFee);
    formData.append('status', status);
    formData.append('image', image);
    formData.append('section', section);
    formData.append('adm_date', admDate);
    formData.append('adm_standard', admStandard);
    formData.append('current_standard', currentStandard); // Add current standard to formData
    formData.append('mobile', mobile);
    formData.append('email', email);
    formData.append('dob', dob);
    formData.append('address', address);
    formData.append('gender', gender);
    formData.append('father_cnic', fatherCnic);
    formData.append('mother_cnic', motherCnic);
    formData.append('father_profession', fatherProfession);
    formData.append('religion', religion);
    formData.append('caste', caste);
    formData.append('previous_school', previousSchool);
    formData.append('dob_urdu', dobUrdu);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/students`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/dashboard/studentlist');
    } catch (err) {
      console.error("Error creating student:", err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/studentlist');
  };

  return (
    <div className="card col-md-8 mx-auto">
      <div className="card-header">
        <h2 className="text-center">New Student</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Adm No and Image */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label><b>Adm No</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Adm No..."
                onChange={(e) => setAdmNo(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="col-md-4">
              <label><b>Roll No</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Roll No..."
                onChange={(e) => setRollNo(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="col-md-4">
              <label><b>Image</b></label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
              />
            </div>
          </div>

          {/* Student and Father's Name */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label><b>Student Name</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Student Name..."
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="col-md-6">
              <label><b>Student Name (Urdu)</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Student Name (Urdu)..."
                onChange={(e) => setNameurdu(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="col-md-6">
              <label><b>Father's Name</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Father's Name..."
                onChange={(e) => setFather(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
            <div className="col-md-6">
              <label><b>Father's Name (Urdu)</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Father's Name (Urdu)..."
                onChange={(e) => setFatherurdu(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Admission Date, Standard and Current Standard */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label><b>Admission Date</b></label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setAdmDate(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label><b>Date of Birth</b></label>
              <input
                type="date"
                className="form-control"
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label><b>Admission Standard</b></label>
              <select
                className="form-control"
                required
                onChange={(e) => setAdmStandard(e.target.value)}
                value={admStandard}
              >
                <option value="">Select Standard...</option>
                {standards.map((std) => (
                  <option key={std.sid} value={std.standard}>
                    {std.standard}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current Standard */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label><b>Current Standard</b></label>
              <select
                className="form-control"
                required
                onChange={(e) => setCurrentStandard(e.target.value)} // Handle change for Current Standard
                value={currentStandard}
              >
                <option value="">Select Current Standard...</option>
                {standards.map((std) => (
                  <option key={std.sid} value={std.standard}>
                    {std.standard}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label><b>Section</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Section here..."
                onChange={(e) => setSection(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mobile and Email */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label><b>Mobile</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Mobile..."
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="col-md-4">
              <label><b>Email</b></label>
              <input
                type="email"
                className="form-control"
                placeholder="Email..."
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label><b>Status</b></label>
              <select
                className="form-control"
                required
                onChange={(e) => setStatus(e.target.value)}
                value={status}
              >
                <option value="">Select Status...</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Date of Birth and Monthly Fee */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label><b>Date of Birth (Urdu)</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Date of Birth (Urdu)..."
                onChange={(e) => setDobUrdu(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label><b>Monthly Fee</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Monthly Fee..."
                onChange={(e) => setMonthlyFee(e.target.value)}
              />
            </div>
          </div>

          {/* Gender and CNICs */}
          <div className="row mb-3">
            <div className="col-md-4">
              <label><b>Gender</b></label>
              <select
                className="form-control"
                required
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              >
                <option value="">Select Gender...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="col-md-4">
              <label><b>Father's CNIC</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Father's CNIC..."
                onChange={(e) => setFatherCnic(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label><b>Mother's CNIC</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Mother's CNIC..."
                onChange={(e) => setMotherCnic(e.target.value)}
              />
            </div>
          </div>

          {/* Mother's CNIC and Father's Profession */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label><b>Father's Profession</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Father's Profession..."
                onChange={(e) => setFatherProfession(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label><b>Religion</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Religion..."
                onChange={(e) => setReligion(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label><b>Caste</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Caste..."
                onChange={(e) => setCaste(e.target.value)}
              />
            </div>
          </div>

          {/* Previous School and Address */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label><b>Previous School</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Previous School..."
                onChange={(e) => setPreviousSchool(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label><b>Address</b></label>
              <input
                type="text"
                className="form-control"
                placeholder="Address..."
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Submit and Back buttons */}
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">Add Record</button>
            <button type="button" className="btn btn-secondary ml-1" onClick={handleBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
