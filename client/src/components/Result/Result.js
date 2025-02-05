import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from '@react-pdf/renderer';
import PRPdf from './PRPdf'; // Import the PDF component

export default function Result() {
  const { token } = useContext(userContext);
  const navigate = useNavigate();
  const [yearOptions, setYearOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [standardOptions, setStandardOptions] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});

  const handleExamYearChange = (e) => {
    setSelectedValues({ ...selectedValues, year: e.target.value });
  };

  const handleExamNameChange = (e) => {
    setSelectedValues({ ...selectedValues, month: e.target.value });
  };

  const handleStandardChange = (e) => {
    setSelectedValues({ ...selectedValues, standard: e.target.value });
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/resultprep/selectboxes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.years) {
          setYearOptions(response.data.years.map((option) => option.year));
        }
        if (response.data.months) {
          setMonthOptions(response.data.months.map((option) => option.month));
        }
        if (response.data.standards) {
          setStandardOptions(response.data.standards.map((option) => option.result_standard));
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
        if (selectedValues.year && selectedValues.month && selectedValues.standard) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/result`, {
                    params: {
                        year: selectedValues.year,
                        month: selectedValues.month,
                        standard: selectedValues.standard,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setResults(response.data);
                console.log('Fetched results:', response.data); // Check the response
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };
    fetchData();
}, [selectedValues, token]);

  
  //edit obtain marks
  const handleEdit = (resultid) => {
    navigate(`/dashboard/resultobtmarks/${resultid}`);
  };

  return (
    <>
    <div style={{background:"white"}}>
      <div>
        <h1 className="text-center">Result</h1>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <select
            value={selectedValues.year}
            onChange={handleExamYearChange}
            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
          >
            <option>Select Year</option>
            {yearOptions.map((yearOption, index) => (
              <option key={index} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            value={selectedValues.month}
            onChange={handleExamNameChange}
            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
          >
            <option>Select Exam</option>
            {monthOptions.map((monthOption, index) => (
              <option key={index} value={monthOption}>
                {monthOption}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            value={selectedValues.standard}
            onChange={handleStandardChange}
            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
          >
            <option>Select Standard</option>
            {standardOptions.map((standardOption, index) => (
              <option key={index} value={standardOption}>
                {standardOption}
              </option>
            ))}
          </select>
        </div>
      </div>
      <hr />
      <div className="container mt-4">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Ser</th>
              <th>ID</th>
              <th>Adm No</th>
              <th>Name</th>
              <th>Standard</th>
              <th>T.Marks</th>
              <th>T.O.Marks</th>
              <th>%age</th>
              <th>Grade</th>
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((result, index) => (
                <tr key={result.resultid}>
                  <td>{index + 1}</td>
                  <td>{result.resultid}</td>
                  <td>{result.result_adm_no}</td>
                  <td>{result.name}</td>
                  <td>{result.result_standard}</td>
                  <td>{result.Total_set_marks}</td>
                  <td>{result.Total_obt_marks}</td>
                  <td>
                    {result.Total_set_marks !== 0
                      ? ((result.Total_obt_marks / result.Total_set_marks) * 100).toFixed(2)
                      : 0}
                  </td>
                  <td>
                    {result.Total_set_marks !== 0 ? (
                      ((result.Total_obt_marks / result.Total_set_marks) * 100).toFixed(2) >=
                      90 ? (
                        "A1"
                      ) : ((result.Total_obt_marks / result.Total_set_marks) * 100).toFixed(
                        2
                      ) >= 80 ? (
                        "A2"
                      ) : ((result.Total_obt_marks / result.Total_set_marks) * 100).toFixed(
                        2
                      ) >= 70 ? (
                        "B1"
                      ) : ((result.Total_obt_marks / result.Total_set_marks) * 100).toFixed(
                        2
                      ) >= 60 ? (
                        "B2"
                      ) : ((result.Total_obt_marks / result.Total_set_marks) * 100).toFixed(
                        2
                      ) >= 50 ? (
                        "C1"
                      ) : ((result.Total_obt_marks / result.Total_set_marks) * 100).toFixed(
                        2
                      ) >= 40 ? (
                        "C2"
                      ) : (
                        "F"
                      )
                    ) : (
                      ""
                    )}
                  </td>
                  <td className='text-center'>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(result.resultid)}
                  >
                    Edit
                  </button>
                  <PDFDownloadLink
  document={<PRPdf invoice={result} />}
  fileName={`result_${result.resultid}.pdf`}
>
  {({ loading }) => (loading ? 'Loading document...' : <button className="btn btn-success ml-1"> PDF </button>)}
</PDFDownloadLink>



                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No Results Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
