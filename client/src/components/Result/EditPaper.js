import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditPaper() {
  const { id } = useParams(); // Get the ID from the URL
  const { token } = useContext(userContext);
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [exam, setExam] = useState('');
  const [standard, setStandard] = useState('');

  useEffect(() => {
    const fetchDateSheetRecord = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/datesheet/datesheet/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const record = response.data; // Assuming the response returns the record directly
        setSubject(record.subject);
        setYear(record.year);
        setExam(record.exam);
        setStandard(record.standard);
  
        // Ensure date is in the correct format (YYYY-MM-DD)
        const fetchedDate = new Date(record.date);
        const formattedDate = fetchedDate.toISOString().split('T')[0]; // Get the date part
        setDate(formattedDate);
      } catch (error) {
        console.error("Error fetching date sheet record:", error);
      }
    };
  
    fetchDateSheetRecord();
  }, [id, token]);
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/datesheet/edit/${id}`, {
        subject,
        date,
        year,
        exam,
        standard,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Date Sheet entry updated successfully!");
      navigate('/dashboard/datesheet'); // Navigate back to the date sheet
    } catch (error) {
      console.error("Error updating date sheet:", error);
    }
  };

  return (
    <div className="container" style={{background:"white"}}>
      <h1>Edit Date Sheet Entry</h1>
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Year</label>
          <input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Exam</label>
          <input type="text" value={exam} onChange={(e) => setExam(e.target.value)} className="form-control" required />
        </div>
        <div className="form-group">
          <label>Standard</label>
          <input type="text" value={standard} onChange={(e) => setStandard(e.target.value)} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/datesheet')}>Back</button>
      </form>
    </div>
  );
  
}
