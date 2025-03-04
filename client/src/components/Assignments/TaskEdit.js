import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import userContext from "../context/UserContext";

export default function TaskEdit() {
  const { syllabus_id } = useParams();
  const { token } = useContext(userContext);
  const [taskData, setTaskData] = useState({});
  const [standards, setStandards] = useState([]);
  const navigate = useNavigate();

  // Static subjects list
  const subjectsList = [
    "English", "Maths", "Urdu", "Islamiat", "Pak Study", "S.Study", 
    "Home Economics", "Chemistry", "Biology", "Computer", "Arabic"
  ];
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/${syllabus_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaskData(response.data);
      } catch (err) {
        console.error(err.message);
      }
    };
  
    const fetchStandards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/standards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStandards(response.data.data); // Access the 'data' property
        console.log(response.data.data);
      } catch (err) {
        console.error("Error fetching standards:", err);
      }
    };
  
    fetchTask();
    fetchStandards();
  }, [syllabus_id, token]);
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/tasks/${syllabus_id}`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard/assigntasks'); // Redirect after update
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!standards.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5" style={{ background: "white" }}>
      <h1 className="text-center">Edit Task</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label"><b>Standard</b></label>
          <select className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info" value={taskData.task_standard || ''} onChange={(e) => setTaskData({ ...taskData, task_standard: e.target.value })} required>
            <option value="">Select Standard</option>
            {standards.map(std => (
              <option key={std.sid} value={std.standard}>{std.standard}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label"><b>Subject</b></label>
          <select className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info" value={taskData.subject || ''} onChange={(e) => setTaskData({ ...taskData, subject: e.target.value })} required>
            <option value="">Select Subject</option>
            {subjectsList.map((sub, index) => (
              <option key={index} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label"><b>Task</b></label>
          <textarea className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info" value={taskData.task || ''} onChange={(e) => setTaskData({ ...taskData, task: e.target.value })} required />
        </div>
        <button type="submit" className="btn btn-success">Update</button>
        <button type="button" className="btn btn-secondary ml-2" onClick={() => navigate('/dashboard/assigntasks')}>Back</button>
      </form>
    </div>
  );
}
