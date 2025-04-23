import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import userContext from "../context/UserContext";

export default function StaffEdit() {
    const navigate = useNavigate();
    const { staffid } = useParams();
    const { token } = useContext(userContext);
    const [staffData, setStaffData] = useState({
        name: '',
        father_name: '',
        cnic: '',
        salary: '',
        allowance: '',
        mobile: '',
        doj: '',
        appointment: '',
        standard: '',
        status: '',
        email: '',
        address: '',
        image: '',
    });
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [standards, setStandards] = useState([]); // State to hold standards

    // Fetch staff details
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/staff/${staffid}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStaffData(response.data);
            } catch (error) {
                console.error("Error fetching staff:", error);
            } finally {
                setLoading(false); // Set loading to false
            }
        };
        fetchStaff();
    }, [staffid, token]);

    // Fetch standards
    useEffect(() => {
        const fetchStandards = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStandards(response.data); // Set standards from fetched data
            } catch (err) {
                console.error("Error fetching standards:", err);
            }
        };
        fetchStandards();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStaffData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Include staff data
        Object.entries(staffData).forEach(([key, value]) => formData.append(key, value));
        
        // Check if newImage exists
        if (newImage) {
            formData.append('image', newImage);
        }
        
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/staff/${staffid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data); // Check the response
            navigate('/dashboard/stafflist');
        } catch (err) {
            console.error("Error updating staff:", err);
        }
    };
    
    if (loading) return <div>Loading...</div>; // Show a loading message

    const handleback = () => {
        navigate('/dashboard/stafflist');
    }

    return (
        <div className="card col-md-8 mx-auto">
            <div className="card-header">
                <h2 className="text-center">Edit Staff</h2>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Name</b></label>
                            <input type="text" className="form-control" name="name" value={staffData.name} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Father's Name</b></label>
                            <input type="text" className="form-control" name="father_name" value={staffData.father_name} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>CNIC</b></label>
                            <input type="text" className="form-control" name="cnic" value={staffData.cnic} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Mobile</b></label>
                            <input type="text" className="form-control" name="mobile" value={staffData.mobile} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Salary</b></label>
                            <input type="text" className="form-control" name="salary" value={staffData.salary} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Allowance</b></label>
                            <input type="text" className="form-control" name="allowance" value={staffData.allowance} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Date of Joining</b></label>
                            <input type="date" className="form-control" name="doj" value={staffData.doj} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Appointment</b></label>
                            <select name="appointment" className="form-control" value={staffData.appointment} onChange={handleChange}>
                                <option value="">Select Appointment</option>
                                <option value="Principal">Principal</option>
                                <option value="Co-ordinator">Co-ordinator</option>
                                <option value="Teacher">Teacher</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Status</b></label>
                            <select name="status" className="form-control" value={staffData.status} onChange={handleChange}>
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label><b>Standard</b></label>
                            <select name="standard" className="form-control" value={staffData.standard} onChange={handleChange}>
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
                            <input type="email" className="form-control" name="email" value={staffData.email} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label><b>Address</b></label>
                            <input type="text" className="form-control" name="address" value={staffData.address} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label><b>Image</b></label>
                            <input type="file" className="form-control" onChange={handleImageChange} />
                            {staffData.image && (
                                <img src={`${process.env.REACT_APP_API_URL}/${staffData.image}`} alt="Current" style={{ width: "100px", height: "100px", marginTop: "10px" }} />
                            )}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Update Staff</button>
                    <button type="button" className="btn btn-secondary mt-3 ml-2" onClick={handleback}>Back</button>
                </form>
            </div>
        </div>
    );
}
