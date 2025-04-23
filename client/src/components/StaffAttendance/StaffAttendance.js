import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import userContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const StaffAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const { token } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchAttendanceRecords();
    }
  }, [token]);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/staffatt`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setAttendanceRecords(response.data.attendanceRecords || []);
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setMessage("Failed to fetch attendance records.");
    }
  };

  const handleInitiateAttendance = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/staffatt/initiate-attendance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAttendanceRecords(); // Refresh records after initiation
      navigate('/dashboard/staffattendance');
    } catch (error) {
      console.error("Error initiating attendance:", error);
      alert("Failed to initiate attendance");
    }
  };

  const updateAttendance = async (att_id, status) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/staffatt/update/${att_id}`,
        { attendance: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Filter out the updated record from the attendanceRecords state
      setAttendanceRecords((prevRecords) => 
        prevRecords.filter((record) => record.att_id !== att_id)
      );

      setMessage(`Attendance updated successfully for ID ${att_id}`);
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Failed to update attendance");
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredAttendanceRecords = attendanceRecords.filter((record) => {
    return (
      record.att_adm_no?.toString().includes(search) ||
      record.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div style={{ background: "white" }}>
      <h1 className="text-center"><b>STAFF ATTENDANCE</b></h1>
      <hr />
      <div className="flex">
        <button
          className="btn btn-primary btn-sm mb-1 shadow ml-4 rounded"
          onClick={handleInitiateAttendance}
        >
          <b>Generate Attendance</b>
        </button>

        <div className="ml-2 col-md-6">
          <input
            type="text"
            className="form-control border-pill border-3 border-info"
            value={search}
            onChange={handleSearch}
            placeholder="Search by Adm No or Name"
          />
        </div>
        <button 
          className="btn btn-primary ml-4"
          onClick={() => navigate('/dashboard/staffattreport')}
        >
          Attendance Report
        </button>
      </div>

      <hr />
      {message && <div className="alert alert-success" role="alert">{message}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>CNIC</th>
            <th>Name</th>
          
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendanceRecords.map((record) => (
            <tr key={record.att_id}>
              <td>{record.att_id}</td>
              <td>{record.cnic_att}</td>
              <td>{record.name}</td>
             
              <td className="text-center">
                {['P', 'A', 'L'].map((status) => (
                  <button
                    key={status}
                    className={`btn ${status === 'P' ? 'btn-success' : 'btn-danger'} ml-1`}
                    onClick={() => updateAttendance(record.att_id, status)}
                  >
                    {status}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffAttendance;
