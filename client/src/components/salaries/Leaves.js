// LeavesEdit.js
import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios"; 
import { useNavigate, useParams } from "react-router-dom"; 
import userContext from "../context/UserContext";

export default function LeavesEdit() {
    const navigate = useNavigate();
    const { salaryid } = useParams(); // Getting salaryid from URL parameters
    const { token } = useContext(userContext);
    const [leaveDays, setLeaveDays] = useState(0); // State for leave days
    const [security, setSecurity] = useState(0); // State for leave days
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalaryInfo = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/salary/${salaryid}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setLeaveDays(response.data.leave_availed);
            setSecurity(response.data.security);
          } catch (error) {
            console.error("Error fetching salary info:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchSalaryInfo();
      }, [salaryid, token]);

    const handleLeaveDaysChange = (e) => {
        setLeaveDays(e.target.value);
      };
      
      const handleSecurityChange = (e) => {
        setSecurity(e.target.value);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.patch(`${process.env.REACT_APP_API_URL}/salary/update-leaves/${salaryid}`, {
            leave_availed: leaveDays,
            security: security, // Add security field
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(response.data);
          navigate('/dashboard/salary');
        } catch (error) {
          console.error("Error updating leaves:", error);
        }
      };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container">
            <h1 className="text-center"><b>Update Leaves</b></h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="leaveDays">Leave Days:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="leaveDays"
                        value={leaveDays}
                        onChange={handleLeaveDaysChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="leaveDays">Security:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="leaveDays"
                        value={security}
                        onChange={handleSecurityChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
            </form>
        </div>
    );
}
