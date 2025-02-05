import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from '../context/UserContext';

export default function StudentCreate() {
  const [admno, setAdmNo] = useState('');
  const [name, setName] = useState('');
  const [standard, setStandard] = useState('');
  const [image, setImage] = useState(null);
  const [monthlyFee, setMonthlyFee] = useState('');
  const [status, setStatus] = useState('');
  const [father, setFather] = useState('');
  const [admDate, setAdmDate] = useState('');
  const [admStandard, setAdmStandard] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [standards, setStandards] = useState([]);

  const navigate = useNavigate();
  const { token } = useContext(userContext);

  axios.defaults.withCredentials = true;

  // Fetch standards from API
  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(response.data); // Check data received
        setStandards(response.data); // Set standards to state
      } catch (err) {
        console.error("Error fetching standards:", err);
      }
    };
    fetchStandards();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('admno', admno);
    formData.append('name', name);
    formData.append('standard', standard);
    formData.append('image', image);
    formData.append('monthly_fee', monthlyFee);
    formData.append('status', status);
    formData.append('father', father);
    formData.append('adm_date', admDate);
    formData.append('adm_standard', admStandard);
    formData.append('mobile', mobile);
    formData.append('address', address);
    formData.append('email', email);

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
    <>
      <div className="card col-md-8 mx-auto">
        <div className="card-header">
          <h2 className="text-center">New Student</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
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
            </div>

            <div className="row">
              <div className="col-md-6">
                <label><b>Standard</b></label>
                <select
                  className="form-control"
                  required
                  onChange={(e) => setStandard(e.target.value)}
                  value={standard}
                >
                  <option value="">Select Standard...</option>
                  {standards.map((std) => (
                    <option key={std.sid} value={std.standard}>
                      {std.standard}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label><b>Image</b></label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*" // Allow only image files
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label><b>Monthly Fee</b></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Monthly Fee..."
                  onChange={(e) => setMonthlyFee(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
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

            <div className="row">
              <div className="col-md-6">
                <label><b>Father's Name</b></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Father's Name..."
                  onChange={(e) => setFather(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
                <label><b>Admission Date</b></label>
                <input
                  type="date"
                  required
                  className="form-control"
                  onChange={(e) => setAdmDate(e.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
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
              <div className="col-md-6">
                <label><b>Mobile</b></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Mobile..."
                  onChange={(e) => setMobile(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label><b>Address</b></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address..."
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
                <label><b>Email</b></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email..."
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <button type="submit" className="btn btn-primary">Add Record</button>
              <button type="button" className="btn btn-secondary ml-1" onClick={handleBack}>Back</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
