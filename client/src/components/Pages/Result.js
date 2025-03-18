import React, { useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PRPdf from '../Result/PRPdf';

function Result() {
  const [admNo, setAdmNo] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!admNo) {
      setError('Please enter an admission number.');
      return;
    }
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/result/reportcard/${admNo}`);
      setResults(response.data);
      console.log(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching results. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div style={{background:"white", height:"100vh"}}>
      <h2 className='text-center'>Download Progress Report</h2>
      <div className='row'>
        <div className='col-md-6'>
          <input className='form-control mx-2 shadow p-2 rounded-pill border-3 border-info'
                 type="text"
                 value={admNo}
                 onChange={(e) => setAdmNo(e.target.value)}
                 placeholder="Enter Admission Number" />
        </div>
        <div className='col-md-2'>
          <button className='btn btn-primary' onClick={handleSearch}>Search</button>
        </div>
      </div>
      <br/>
      <hr/>
      <br/>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Marks Obtained</th>
            <th>Total Marks</th>
            <th>Position</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.Total_obt_marks || '0'}</td>
              <td>{result.Total_set_marks || '0'}</td>
              <td>{result.position}</td>
              <td>
              <PDFDownloadLink document={<PRPdf invoice={result} />} fileName={`result_${result.resultid}.pdf`} >
  {({ loading }) => (loading ? 'Loading document...' : <button className="btn btn-success"> Download PDF </button> )}
</PDFDownloadLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Result;
