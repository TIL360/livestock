import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash} from "react-icons/fa";


export default function DateSheet() {
  const { token } = useContext(userContext);
  const navigate = useNavigate();

  const [subjectOptions, setSubjectOptions] = useState([]);
  const [date, setDate] = useState('');
  const [yearOptions, setYearOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [standardOptions, setStandardOptions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [dateSheetRecords, setDateSheetRecords] = useState([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/resultprep/selectboxes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log(response.data);
    
        if (response.data.years) {
          setYearOptions(response.data.years.map((option) => option.year));
        }
        if (response.data.months) {
          setExamOptions(response.data.months.map((option) => option.month));
        }
        if (response.data.standards) {
          setStandardOptions(response.data.standards.map((option) => option.result_standard));
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
  
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/resultprep/subjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data); 
        setSubjectOptions(response.data); 
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
  
    fetchMetadata();
    fetchSubjects();
  }, [token]);
  
  useEffect(() => {
    const fetchDateSheetRecords = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/datesheet/papersadded`, { headers: { Authorization: `Bearer ${token}` } });
        setDateSheetRecords(response.data.records);
      } catch (error) {
        console.error("Error fetching date sheet records:", error);
      }
    };
    fetchDateSheetRecords();
  }, [token]);

  useEffect(() => {
    const fetchFilteredDateSheetRecords = async () => {
      if (selectedYear && selectedExam && selectedStandard) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/datesheet/papersadded`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { year: selectedYear, exam: selectedExam, standard: selectedStandard },
          });
          setDateSheetRecords(response.data.records);
        } catch (error) {
          console.error("Error fetching filtered date sheet records:", error);
        }
      }
    };

    fetchFilteredDateSheetRecords();
  }, [selectedYear, selectedExam, selectedStandard, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/datesheet/add`, {
            subject: selectedSubject,
            date,
            year: selectedYear,
            exam: selectedExam,
            standard: selectedStandard,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        alert("Paper added in Date Sheet successfully!");

        // Refresh the records after adding
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/datesheet/papersadded`, { headers: { Authorization: `Bearer ${token}` } });
        setDateSheetRecords(response.data.records);
    } catch (error) {
        if (error.response && error.response.data.error) {
            alert(error.response.data.error); // Display the specific error message
        } else {
            console.error("Error adding date sheet:", error);
        }
    }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/datesheet/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("Date Sheet entry deleted successfully!");
      // Refresh the records after deletion
      setDateSheetRecords(dateSheetRecords.filter(record => record.id !== id));
    } catch (error) {
      console.error("Error deleting date sheet entry:", error);
    }
  };

  const handleEdit = (id) => {

    navigate(`/dashboard/editpaper/${id}`);  };


  const handleViewDateSheet = () => {
    navigate('/dashboard/datesheetprint'); 
  };

  return (
    <div className="container" style={{background:"white"}}>
      <h1 style={{ textAlign: 'center' }}>PREPARE DATE SHEET</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="form-group col-md-2">
            <label>Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="form-control">
              <option>Select Subject</option>
              {subjectOptions.map((subject, index) => (
                <option key={index} value={subject.subject}>{subject.subject}</option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-2">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control" required />
          </div>

          <div className="form-group col-md-2">
            <label>Year</label>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="form-control">
              <option>Select Year</option>
              {yearOptions.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-2">
            <label>Exam</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="form-control">
              <option>Select Exam</option>
              {examOptions.map((exam, index) => (
                <option key={index} value={exam}>{exam}</option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-2">
            <label>Standard</label>
            <select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} className="form-control">
              <option>Select Standard</option>
              {standardOptions.map((standard, index) => (
                <option key={index} value={standard}>{standard}</option>
              ))}
            </select>
          </div>
          <div className='form-group col-md-2'>
            <button type="submit" className="btn btn-primary mt-4">Add</button>
            <button type="button" className="btn btn-secondary ml-1 mt-4" onClick={handleViewDateSheet}>View</button>
          </div>
        </div>
        <br/>
      </form>
      <hr/>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Date</th>
            <th>Year</th>
            <th>Exam</th>
            <th>Standard</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {dateSheetRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.subject}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>{record.year}</td>
              <td>{record.exam}</td>
              <td>{record.standard}</td>
              <td>
              <button className="btn btn-primary" onClick={() => handleEdit(record.id)}><FaEdit/></button>
              <button className="btn btn-danger ml-1" onClick={() => handleDelete(record.id)}><FaTrash/> </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
