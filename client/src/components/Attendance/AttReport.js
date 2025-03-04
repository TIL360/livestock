import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';

export default function AttReport() {
  const { token } = useContext(userContext);
  const [standards, setStandards] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // Items to display per page

  // Fetch standards, years, and months when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const standardsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/attendance/standards`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStandards(standardsResponse.data);

        const yearsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/attendance/years`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setYears(yearsResponse.data);

        const monthsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/attendance/months`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMonths(monthsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleFetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/attsheet?attstandard=${selectedStandard}&attyear=${selectedYear}&attmonth=${selectedMonth}`, {
          headers: { Authorization: `Bearer ${token}` }
        }
      ); 
      setAttendanceRecords(response.data.attendanceRecords);
      setCurrentPage(1); // Reset to first page when fetching new attendance
    } catch (error) {
      console.error("Error fetching attendance records:", error);
    }
  };

  const daysInMonth = selectedYear && selectedMonth ? new Date(selectedYear, selectedMonth, 0).getDate() : 0;

  // Calculate total pages for pagination
  const totalPages = Math.ceil(attendanceRecords.length / recordsPerPage);

  // Calculate records to show on current page
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentAttendanceRecords = attendanceRecords.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div style={{background:"white"}}>
      <h3 className='text-center'><strong><u>ATTENDANCE REPORT</u></strong></h3>
      <hr/>
      <div className="row mb-3 align-items-center">
        <div className="col-md-2">
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info "
          >
            <option value="" disabled>Select Standard</option>
            {standards.map((standard) => (
              <option key={standard.attstandard} value={standard.attstandard}>
                {standard.attstandard}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
          >
            <option value="" disabled>Select Year</option>
            {years.map((year) => (
              <option key={year.year} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
          >
            <option value="" disabled>Select Month</option>
            {months.map((month) => (
              <option key={month.month} value={month.month}>
                {month.month}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleFetchAttendance} className="btn btn-primary btn-sm mb-1 shadow p-3 rounded-pill col-md-2">
          <strong>Fetch Attendance</strong>
        </button>
      </div>
      
      <hr className='border-2'/>
      {currentAttendanceRecords.length > 0 && (
        <div>
          <h4 className='text-center text-success'> ISLAMIC SCHOLAR PUBLIC SCHOOL - ATTENDANCE SHEET ({selectedMonth} of {selectedYear})</h4>
          <h5 className='text-center text-danger'>STANDARD: <b className='text-success'>{selectedStandard}</b></h5>
          <table className="table table-bordered mt-3 border-2">
            <thead>
              <tr>
                <th>Ser</th>
                <th>Adm No & Name</th>
                {Array.from({ length: daysInMonth }, (_, index) => (
                  <th key={index + 1}>{index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentAttendanceRecords.map((record, index) => (
                <tr key={record.att_adm_no}>
                  <td>{startIndex + index + 1}</td>
                  <td>{record.att_adm_no} {record.name}</td>
                  {record.attendance.map((att, i) => (
                    <td key={i}>{att}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`btn ${currentPage === index + 1 ? "btn-success" : "btn-primary"}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
