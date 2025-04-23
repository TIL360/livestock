import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext"; // Make sure this context exists

export default function StaffAdd() {
    const navigate = useNavigate();
    const { token } = useContext(userContext);
    const [staffData, setStaffData] = useState({
        name: '',
        father_name: '',
        cnic: '',
        salary: '',
        allowance: '',
        image: null,
        mobile: '',
        doj: '',
        appointment: '',
        standard: '',
        status: '',
        email: '',
        address: ''
    });
    const [standards, setStandards] = useState([]);
    const [imageError, setImageError] = useState(''); // State for image error message
    const [submitError, setSubmitError] = useState(''); // State for submit error message

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaffData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024 * 5) { // Check if file size exceeds 5MB
                setImageError('File size must be less than 5MB');
                setStaffData(prev => ({ ...prev, image: null })); // Reset the image
            } else {
                setImageError(''); // Clear any existing error
                setStaffData(prev => ({ ...prev, image: file }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure there are no errors before submitting
        if (imageError) {
            return;
        }
        const formData = new FormData();
        Object.entries(staffData).forEach(([key, value]) => formData.append(key, value));
    
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/staff/staff-add`, formData, { 
                headers: { 
                    'Content-Type': 'multipart/form-data', 
                    Authorization: `Bearer ${token}` 
                }
            });
            navigate('/dashboard/stafflist');
        } catch (err) {
            console.error("Error adding staff:", err);
            if (err.response && err.response.data.error) {
                // Check for specific error message from backend
                setSubmitError('Oops! A staff member with this CNIC already exists. Please use a different CNIC.');
            } else {
                setSubmitError('An error occurred while adding staff. Please try again later.');
            }
        }
    };
    

    const handleback = () => {
        navigate('/dashboard/stafflist');
    }

    return (
        <div className="card col-md-8 mx-auto">
            <div className="card-header">
                <h2 className="text-center">Add New Staff</h2>
            </div>
            <div className="card-body">
                {submitError && <div className="alert alert-danger">{submitError}</div>} {/* Display submit error */}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Name</b></label>
                            <input type="text" className="form-control" name="name" onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Father's Name</b></label>
                            <input type="text" className="form-control" name="father_name" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>CNIC</b></label>
                            <input type="text" className="form-control" name="cnic" onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Mobile</b></label>
                            <input type="text" className="form-control" name="mobile" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Salary</b></label>
                            <input type="text" className="form-control" name="salary" onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Allowance</b></label>
                            <input type="text" className="form-control" name="allowance" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Date of Joining</b></label>
                            <input type="date" className="form-control" name="doj" onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Appointment</b></label>
                            <select name="appointment" className="form-control" onChange={handleChange}>
                                <option value="">Select Appointment</option>
                                <option value="MD">MD</option>
                                <option value="Asst Director">Asst Director</option>
                                <option value="Principal">Principal</option>
                                <option value="Coordinator">Coordinator</option>
                                <option value="Admin">Admin</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Helper Teacher">Helper Teacher</option>
                                <option value="Janitorial Staff">Janitorial Staff</option>
                                <option value="Guard">Guard</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Status</b></label>
                            <select name="status" className="form-control" onChange={handleChange}>
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label><b>Standard</b></label>
                            <select name="standard" className="form-control" onChange={handleChange}>
                                <option value="">Select Standard</option>
                                {standards.map((std) => (
                                    <option key={std.id} value={std.id}>{std.standard}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Email</b></label>
                            <input type="email" className="form-control" name="email" onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Address</b></label>
                            <input type="text" className="form-control" name="address" onChange={handleChange} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Image</b></label>
                            <input type="file" className="form-control" onChange={handleImageChange} />
                            {imageError && <div className="text-danger">{imageError}</div>} {/* Error message */}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Add Staff</button>
                    <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={handleback}>Back</button>
                </form>
            </div>
        </div>
    );
}
