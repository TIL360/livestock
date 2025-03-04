import React, { useState, useContext } from "react";
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
        mobile: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaffData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setStaffData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                            <label><b>Image</b></label>
                            <input type="file" className="form-control" onChange={handleImageChange} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Add Staff</button>
                    <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={handleback}>Back</button>
                </form>
            </div>
        </div>
    );
}
