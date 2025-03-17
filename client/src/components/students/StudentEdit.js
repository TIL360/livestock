import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import userContext from "../context/UserContext";

export default function StudentEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState({
    adm_no: "",
    name: "",
    standard: "",
    image: "",
    monthly_fee: "",
    status: "",
    father: "",
    adm_date: "",
    adm_standard: "", // Added adm_standard
    mobile: "",
    address: "",
    email: "",
    name_urdu: "",
    fname_urdu: "",
    dob_urdu: "",
    father_cnic: "",
    mother_cnic: "",
    religion: "",
    caste: "",
    gender: "",
    father_profession: "",
    previous_school: "",
    roll_no: "",
    dob: ""
  });
  const [newImage, setNewImage] = useState(null);

  const { token, standards } = useContext(userContext);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/students/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched student data:", response.data);
        console.log('Standards:', standards);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };
    fetchStudent();
  }, [id, token, standards]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append updated data to formData
    formData.append('adm_no', student.adm_no);
    formData.append('name', student.name);
    formData.append('standard', student.standard);
    formData.append('monthly_fee', student.monthly_fee);
    formData.append('status', student.status);
    formData.append('father', student.father);
    formData.append('adm_date', student.adm_date);
    formData.append('adm_standard', student.adm_standard); // Added adm_standard
    formData.append('mobile', student.mobile);
    formData.append('address', student.address);
    formData.append('email', student.email);
    formData.append('name_urdu', student.name_urdu);
    formData.append('fname_urdu', student.fname_urdu);
    formData.append('dob_urdu', student.dob_urdu);
    formData.append('father_cnic', student.father_cnic);
    formData.append('mother_cnic', student.mother_cnic);
    formData.append('religion', student.religion);
    formData.append('caste', student.caste);
    formData.append('gender', student.gender);
    formData.append('father_profession', student.father_profession);
    formData.append('previous_school', student.previous_school);
    formData.append('roll_no', student.roll_no);
    formData.append('dob', student.dob);

    if (newImage) {
      formData.append('image', newImage); // Append new image if available
    }

    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/students/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Pass state while navigating
      navigate('/dashboard/studentlist', { state: { message: 'Student updated successfully!' } });
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/studentList');
  }

  return (
    <>
      <div className="card col-md-8 mx-auto">
        <div style={{ backgroundColor: "white" }} className="row">
          <h1 className='text-center'>Edit Student Record</h1>
          <form onSubmit={handleSubmit}>

            <div className="row mb-3">
              <div className="form-group col-md-6">
                <label htmlFor="adm_no"><b>Admission Number</b></label>
                <input type="text" className="form-control" id="adm_no" name="adm_no" value={student.adm_no} onChange={handleChange} disabled />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="roll_no"><b>Roll No</b></label>
                <input type="text" className="form-control" id="roll_no" name="roll_no" value={student.roll_no} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label htmlFor="name"><b>Name</b></label>
                <input type="text" className="form-control" id="name" name="name" value={student.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="father"><b>Father's Name</b></label>
                <input type="text" className="form-control" id="father" name="father" value={student.father} onChange={handleChange} />
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="name_urdu"><b>طالب علم</b></label>
                  <input type="text" placeholder="طالب علم کا نام اردو میں تھریر کریں۔۔۔" className="form-control" id="name_urdu" name="name_urdu" value={student.name_urdu} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="fname_urdu"><b>ولدیت</b></label>
                  <input type="text" className="form-control" id="fname_urdu" name="fname_urdu" value={student.fname_urdu} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="father_cnic"><b>Father (CNIC)</b></label>
                  <input type="text" className="form-control" id="father_cnic" name="father_cnic" value={student.father_cnic} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="mother_cnic"><b>Mother's CNIC</b></label>
                  <input type="text" className="form-control" id="mother_cnic" name="mother_cnic" value={student.mother_cnic} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="religion"><b>Religion</b></label>
                  <input type="text" className="form-control" id="religion" name="religion" value={student.religion} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label htmlFor="caste"><b>Caste</b></label>
                  <input type="text" className="form-control" id="caste" name="caste" value={student.caste} onChange={handleChange} />
                </div>
              </div>
              <div className="row mb-3">
                <div className="form-group col-md-6">
                  <label htmlFor="standard"><b>Current Standard</b></label>
                  <select
                    className="form-select"
                    id="standard"
                    name="standard"
                    value={student.standard}
                    onChange={handleChange}
                    required
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
                  <label htmlFor="adm_standard"><b>Admission Standard</b></label>
                  <select
                    className="form-select"
                    id="adm_standard"
                    name="adm_standard"
                    value={student.adm_standard} // Added adm_standard
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Admission Standard...</option>
                    {standards.map((std) => (
                      <option key={std.sid} value={std.standard}>
                        {std.standard}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            


              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="gender"><b>Gender</b></label>
                  <select
                    className="form-select"
                    id="gender"
                    name="gender"
                    value={student.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select></div>
                <div className="col-md-6">
                  <label htmlFor="father_profession"><b>Father Profession</b></label>
                  <input type="text" className="form-control" id="father_profession" name="father_profession" value={student.father_profession} onChange={handleChange} />
                </div>
              </div>
              <div className="row mb-3">
              
                <div className="col-md-6">
                <label htmlFor="dob"><b>Date of Birth</b></label>
                <input type="date" className="form-control" id="dob" name="dob" value={student.dob} onChange={handleChange} />
              </div>
                <div className="col-md-6">
                  <label htmlFor="dob_urdu"> <b>DoB (in English)</b> </label>
                  <input type="text" className="form-control" id="dob_urdu" name="dob_urdu" value={student.dob_urdu} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="status"><b>Status</b></label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={student.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status...</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="monthly_fee"><b>Monthly Fee</b></label>
                  <input type="text" placeholder="Monthly Fee, if free then write Free here.." className="form-control" id="monthly_fee" name="monthly_fee" value={student.monthly_fee} onChange={handleChange} />
                </div>
              </div>
            </div>







            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="adm_date"><b>Admission Date</b></label>
                <input type="date" className="form-control" id="adm_date" name="adm_date" value={student.adm_date} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="mobile"><b>Mobile</b></label>
                <input type="text" className="form-control" id="mobile" name="mobile" value={student.mobile} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="address"><b>Address</b></label>
                <input type="text" className="form-control" id="address" name="address" value={student.address} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="email"><b>Email</b></label>
                <input type="email" className="form-control" id="email" name="email" value={student.email} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
            <div className="col-md-6">
                  <label htmlFor="previous_school"><b>Previous School</b></label>
                  <input type="text" className="form-control" id="previous_school" name="previous_school" value={student.previous_school} onChange={handleChange} />
                </div>
              <div className="form-group col-md-6">
                <label htmlFor="image"><b>Image</b></label>
                <input
                  className="form-control"
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                />
                {student.image && (
                  <img src={`${process.env.REACT_APP_API_URL}/${student.image}`} alt={student.name} style={{ width: "100px", height: "100px", marginTop: "10px" }} />
                )}
              </div>
            </div>


            <button type="submit" className="btn btn-primary">Update Student</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={handleBack}>Back</button>
          </form>
        </div>
      </div>
    </>
  );
}
