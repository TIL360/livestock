import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from "../context/UserContext";

export default function AssignTasks() {
  const [tasks, setTasks] = useState([]);
  const [standards, setStandards] = useState([]);
  const [createdAtOptions, setCreatedAtOptions] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { token, user } = useContext(userContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch standards and created options on component mount
  useEffect(() => {
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
  
    

    const fetchCreatedAtOptions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/created-at-options`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCreatedAtOptions(response.data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStandards();
    fetchCreatedAtOptions();
  }, [token]);

  const fetchTasks = async () => {
    if (!selectedStandard || !selectedDate) {
      alert('Please select both standard and date');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          task_standard: selectedStandard,
          created_task_at: selectedDate,
          user: user.username,
        },
      });
      setTasks(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (syllabus_id) => {
    navigate(`/dashboard/taskedit/${syllabus_id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(tasks.filter((task) => task.syllabus_id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="container mt-5" style={{ background: "white" }}>
      <h1 className="text-center">Assign Tasks</h1>
      <button className='btn btn-primary' onClick={() => navigate('/dashboard/taskcreate')}>Add New</button>
      
      {error && <div className="alert alert-danger">{error}</div>}
      <hr/>
      <div className='row'>
        <div className="col-md-5">
         
          <select
  id="standardSelect"
  className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
  value={selectedStandard}
  onChange={(e) => setSelectedStandard(e.target.value)}
>
  <option value="">Select Standard</option>
  {standards.map((standard) => (
    <option key={standard.standard} value={standard.standard}>
      {standard.standard}
    </option>
  ))}
</select>

        </div>
  
        <div className="col-md-5">
        
          <select
            id="dateSelect"
            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">Select Task Date</option>
            {createdAtOptions.map((option) => (
              <option key={option.created_task_at} value={option.created_task_at}>
                {option.created_task_at}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-info" onClick={fetchTasks}>Fetch Tasks</button>
        </div>
      </div>
      
      {tasks.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Task</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.syllabus_id}>
                <td>{task.syllabus_id}</td>
                <td>{task.subject}</td>
                <td>{task.task}</td>
                <td>
                  <button className="btn btn-success" onClick={() => handleEdit(task.syllabus_id)}>Edit</button>
                  <button className="btn btn-danger ml-1" onClick={() => handleDelete(task.syllabus_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tasks.length === 0 && <div className="mt-3 text-center">No tasks found</div>}
    </div>
  );
}
