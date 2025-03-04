import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DateSheetPdf from './DateSheetPdf';
import { FaFilePdf } from 'react-icons/fa';

export default function DateSheetPrint() {
  const navigate = useNavigate();
  const { token } = useContext(userContext);
  const [dateSheetData, setDateSheetData] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [standardOptions, setStandardOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [fetchData, setFetchData] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/resultprep/selectboxes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setYearOptions(response.data.years.map(option => option.year));
        setExamOptions(response.data.months.map(option => option.month));
        setStandardOptions(response.data.standards.map(option => option.result_standard));
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, [token]);

  useEffect(() => {
    const fetchDateSheetData = async () => {
      if (selectedYear && selectedExam) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/datesheet/report`, {
            params: {
              year: selectedYear,
              exam: selectedExam,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDateSheetData(response.data.records);
        } catch (error) {
          console.error("Error fetching date sheet data:", error);
        }
      }
    };
    if (fetchData) {
      fetchDateSheetData();
    }
  }, [selectedYear, selectedExam, token, fetchData]);

  const handleFetchData = () => {
    setFetchData(true);
  };

  const handleBack = () => {
    navigate('/dashboard/datesheet');
  };

  // Function to format date as "dd-MMM-yy"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  // Group data by date
  const groupedData = dateSheetData.reduce((acc, curr) => {
    const dateKey = curr.date; // Assuming curr.date is a string representation of the date
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(curr);
    return acc;
  }, {});

  return (
    <div style={{ background: "white" }}>
      <h1 className='text-center'>Date Sheet - {selectedExam} {selectedYear}</h1>
      <div className="row">
        <div className="col-md-4">
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="form-control">
            <option value="">Select Year</option>
            {yearOptions.map((yearOption, index) => (
              <option key={index} value={yearOption}>{yearOption}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="form-control">
            <option value="">Select Exam</option>
            {examOptions.map((examOption, index) => (
              <option key={index} value={examOption}>{examOption}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary ml-1" onClick={handleFetchData}>Go</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={handleBack}>Add Paper</button>
          {dateSheetData.length > 0 && (
            <PDFDownloadLink 
              document={<DateSheetPdf dateSheetData={dateSheetData} standardOptions={standardOptions} selectedExam={selectedExam} selectedYear={selectedYear} />} 
              fileName={`date_sheet_${selectedExam}_${selectedYear}.pdf`}>
              <button className="btn btn-success ml-1"> 
                <FaFilePdf /> 
              </button>
            </PDFDownloadLink>
          )}
        </div>
      </div>
      <hr />
      {dateSheetData.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              {standardOptions.map((standard, index) => (
                <th key={index}>{standard}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).map((dateKey, index) => (
              <tr key={index}>
                <td>{formatDate(dateKey)}</td>
                {standardOptions.map((standard, idx) => {
                  const subjects = groupedData[dateKey].filter(item => item.standard === standard);
                  return <td key={idx}>{subjects.length > 0 ? subjects[0].subject : '-'}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
