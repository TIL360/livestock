import React, { useState } from 'react';
import axios from 'axios';

export default function Taskview() {
  const [admNo, setAdmNo] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [standard, setStandard] = useState('');

  const handleSearch = async () => {
    if (!admNo) {
      setError('Please enter an admission number.');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/view?admno=${admNo}`);
      
      if (response.data.data.length === 0) {
        setError('No tasks found');
        setTasks([]);
      } else {
        setError('');
        setTasks(response.data.data);
        
        const firstResult = response.data.data[0];
        setName(firstResult.name);
        setStandard(firstResult.standard);
      }
    } catch (err) {
      setError('Error fetching tasks. Please try again later.');
      console.error(err);
    }
  };

  // Function to format date to "DD-MMM-YYYY"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options);
  };
  

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '20px', background: "white", height: "100vh" }}>
      <h2>Student Online Diary / Home Work</h2>
      <hr/>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="input-group mb-3">
            <input type="text" className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info" placeholder="Enter Admission Number" value={admNo} onChange={(e) => setAdmNo(e.target.value)} />
            <button className="btn btn-primary btn-sm mb-1 shadow p-2 rounded" onClick={handleSearch}> Search </button>
          </div>
        </div>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <hr/>
      <hr/>
      <div>
        {tasks.length > 0 ? (
          <div>
            <h3>Assigned Tasks to {name} Class {standard}</h3>
            <hr/>
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col" style={{width:"15%"}}>Date</th>
                  <th scope="col" style={{width:"15%"}}>Teacher</th>
                  <th scope="col" style={{width:"15%"}}>Subject</th>
                  <th scope="col" style={{width:"70%"}}>Task</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.syllabus_id}>
                    <td>{formatDate(task.created_at)}</td> {/* Format date here */}
                    <td>{task.user}</td>
                    <td>{task.subject}</td>
                    <td>{task.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !error && <p>No tasks available. Please search.</p>
        )}
      </div>
    </div>
  );
}
