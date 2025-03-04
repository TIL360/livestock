import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import userContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const { token } = useContext(userContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");



  const handleInitiateAttendance = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/attendance/initiate-attendance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Successfully initiated attendance`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error inserting attendance:", error);
      alert("Failed to initiate attendance");
    }
  };



  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setAttendanceRecords(response.data.attendanceRecords);
        } else {
          console.error("Error fetching attendance records:", response);
        }
      } catch (error) {
        console.error("Error fetching attendance records:", error);
      }
    };
  
    fetchAttendanceRecords();
  }, [token]);

  const updateAttendance = async (att_id, status) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/attendance/update/${att_id}`, // Use the API_URL
        { attendance: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAttendanceRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.att_id === att_id ? { ...record, attendance: status } : record
        )
      );
      setMessage(`Attendance updated successfully for ID ${att_id}`);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/attendance`, { // Use the API_URL
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAttendanceRecords(response.data.attendanceRecords);
      navigate("/dashboard/attendance");
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
      record.att_adm_no.toString().includes(search) ||
      record.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleclick = (e) => {
    navigate('/dashboard/attreport');
  };

  return (
    <>
      <div style={{background:"white"}}>
        <h1 className="text-center">
          <b>ATTENDANCE</b>
        </h1>
        <hr />
        <div className="flex">
          <button
            className="btn btn-primary btn-sm mb-1 shadow ml-4 rounded"
            onClick={handleInitiateAttendance}
          >
            <b>Generate Attendance</b>
          </button>
          
          <div className="ml-2 col-md-6">
            <label htmlFor="searchInput" className="form-label d-none">
              Search here...
            </label>
            <input
              type="text"
              className="form-control border-pill border-3 border-info"
              id="searchInput"
              value={search}
              onChange={handleSearch}
              placeholder="Search by Adm No or Name"
            />
          </div>
          <button 
          className="btn btn-primary ml-4"
          onClick={handleclick}
          >Attendance Report</button>
        </div>
        <div className="row align-items-center"></div>
      </div>
      <hr />
      <div>
        {message && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Adm No</th>
              <th>Name</th>
              <th>Standard</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendanceRecords.map((record) => (
              <tr key={record.att_id}>
                <td>{record.att_id}</td>
                <td>{record.att_adm_no}</td>
                <td>{record.name}</td>
                <td>{record.attstandard}</td>
                <td>{record.curr_date}</td>
                <td className="text-center">
                  <button
                    className="btn btn-success"
                    onClick={() => updateAttendance(record.att_id, "P")}
                  >
                    P
                  </button>
                  <button
                    className="btn btn-danger ml-1"
                    onClick={() => updateAttendance(record.att_id, "A")}
                  >
                    A
                  </button>
                  <button
                    className="btn btn-danger ml-1"
                    onClick={() => updateAttendance(record.att_id, "L")}
                  >
                    L
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Attendance;
