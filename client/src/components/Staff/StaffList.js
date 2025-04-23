import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";

export default function StaffList() {
    const navigate = useNavigate();
    const { token } = useContext(userContext);
    const [staff, setStaff] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [staffPerPage] = useState(5); // Change this value to set items per page

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/staff`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(response.data);
                setStaff(response.data);
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
        };
        fetchStaff();
    }, [token]);

    const handleDelete = async (staffId) => {
        const confirmMessage = "Are you sure you want to delete this staff member?";
        if (window.confirm(confirmMessage)) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/staff/${staffId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Staff member deleted successfully.");
                setStaff(staff.filter(s => s.staffid !== staffId));
            } catch (error) {
                console.error("Error deleting staff:", error);
                alert("Error deleting staff member. Please try again.");
            }
        }
    };

    const handleAdd = () => {
        navigate('/dashboard/staffadd');
    }
    const handleattendance = () => {
        navigate('/dashboard/staffattendance');
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredStaff = staff.filter((s) => {
        return (
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            String(s.cnic).includes(search) // Treat CNIC as string
        );
    });

    // Pagination logic
    const indexOfLastStaff = currentPage * staffPerPage;
    const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
    const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);

    const totalPages = Math.ceil(filteredStaff.length / staffPerPage);


    const handlesalries = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/salary/insert-salary`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert(`Inserted Records: ${response.data.insertedRecords}`);
            navigate("/dashboard/stafflist");
        } catch (error) {
            console.error("Error inserting salaries:", error);
            alert("Failed to insert salaries");
        }
    };
    const handlesalarydetail = (e) => {
        navigate('/dashboard/salary');
    };

    return (
        <div className="card">
                <h1 className="text-center"><b>STAFF</b></h1>
                <hr/>
                <div className="card-header d-flex align-items-center">
    <button className="btn btn-primary" onClick={handleAdd}>Add </button>
    <button className="btn btn-success flex-grow-1 ml-1" onClick={handlesalries}>Initiate </button>
    <button className="btn btn-success flex-grow-1 ml-1" onClick={handlesalarydetail}>Salaries </button>
    <button className="btn btn-success flex-grow-1 ml-1" onClick={handleattendance}>Attendance </button>
    
    <input 
        type="text" 
        className="form-control border-pill border-3 border-info ms-2 ml-1" 
        value={search} 
        onChange={handleSearch} 
        placeholder="Search by Name or CNIC" 
        style={{ height: '38px', lineHeight: '38px' }} // Adjust as needed
    />
</div>

            <div className="card-body">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>CNIC</th>
                            <th>Appointment</th>
                            <th>Standard</th>
                            <th>Mobile</th>
                            <th>Image</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStaff.map((s) => (
                            <tr key={s.staffid}>
                                <td>{s.staffid}</td>
                                <td>{s.name}</td>
                                <td>{s.cnic}</td>
                                <td>{s.appointment}</td>
                                <td>{s.standard}</td>
                                <td>{s.mobile}</td>
                                <td className="text-center">
                                    <img
                                        src={`${process.env.REACT_APP_API_URL}/${s.image}`} 
                                        alt="Current" 
                                        className="text-center"
                                        style={{ width: "70px", height: "70px", marginTop: "2px" }} 
                                    />
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-info" onClick={() => navigate(`/dashboard/staffedit/${s.staffid}`)}>Edit</button>
                                    <button className="btn btn-danger ml-1" onClick={() => handleDelete(s.staffid)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination Controls */}
                <div className="pagination-controls">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button 
                            key={index + 1} 
                            onClick={() => setCurrentPage(index + 1)} 
                            className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-light'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
