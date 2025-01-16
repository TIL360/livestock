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
        image: '',
    });
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/staff/${staffid}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Fetched staff data:", response.data); // Add this line
                setStaffData(response.data);
            } catch (error) {
                console.error("Error fetching staff:", error);
            } finally {
                setLoading(false); // Set loading to false
            }
        };
        fetchStaff();
    }, [staffid, token]);

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
