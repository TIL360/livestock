import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from "../context/UserContext";

export default function TaskCreate() {
  const { token, user } = useContext(userContext);
  const [standard, setStandard] = useState('');
  const [subject, setSubject] = useState('');
  const [task, setTask] = useState('');
  const [standards, setStandards] = useState([]);
  const navigate = useNavigate();

  // Static subjects list
  const subjectsList = [
    "English", "Maths", "Urdu", "Islamiat", "Pak Study", "S.Study", 
    "Home Economics", "Chemistry", "Biology", "Computer", "Arabic"
  ];

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/standards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStandards(response.data.data); // Access the 'data' property
      } catch (err) {
        console.error("Error fetching standards:", err);
      }
    };
    fetchStandards();
  }, [token]);
  

  const handleStandardChange = (e) => {
    const selectedStandard = e.target.value;
    setStandard(selectedStandard);
    setSubject(''); // Reset subject when standard changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/tasks/new-task`, 
        { 
          user: user.username, 
          task_standard: standard, 
          subject, 
          task, 
          created_task_at: currentDate 
        }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStandard('');
      setSubject('');
      setTask('');
      navigate('/dashboard/assigntasks'); 
    } catch (err) {
      console.error(err.message);
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="container mt-5" style={{ background: "white" }}>
      <h1 className="text-center">Create New Task</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label"><b>Standard</b></label>
          <select className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info" value={standard} onChange={handleStandardChange} required>
            <option value="">Select Standard</option>
            {standards.map(std => (
              <option key={std.sid} value={std.standard}>{std.standard}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label"><b>Subject</b></label>
          <select className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info" value={subject} onChange={(e) => setSubject(e.target.value)} required disabled={!standard}>
            <option value="">Select Subject</option>
            {subjectsList.map((sub, index) => (
              <option key={index} value={sub}>{sub}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label"><b>Task</b></label>
          <textarea className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info" value={task} onChange={(e) => setTask(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}
