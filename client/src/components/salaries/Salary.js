import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios"; 
import userContext from "../context/UserContext"; 
import { useNavigate } from "react-router-dom";

export default function Salary() {
    axios.defaults.withCredentials = true;

    const navigate = useNavigate();
    const [salaryDetails, setSalaryDetails] = useState([]); 
    const [error, setError] = useState(null); 
    const [months, setMonths] = useState([]); 
    const [years, setYears] = useState([]); 
    const [selectedYear, setSelectedYear] = useState(""); 
    const [selectedMonth, setSelectedMonth] = useState(""); 
    const { token } = useContext(userContext);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1); 
    const recordsPerPage = 10; 

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/salary`, { 
                    headers: { 
                        Authorization: `Bearer ${token}`, 
                    }, 
                });

                if (Array.isArray(response.data.data)) {
                    setSalaryDetails(response.data.data); 
                    const uniqueMonths = [...new Set(response.data.data.map((sal) => sal.month))];
                    const uniqueYears = [...new Set(response.data.data.map((sal) => sal.year))];
                    
                    setMonths(uniqueMonths); 
                    setYears(uniqueYears);
                } else {
                    console.error("Expected an array of salary details, but got:", response.data.data); 
                }
            } catch (error) {
                setError(error); 
                console.error("Error fetching salary details:", error); 
            }
        };

        fetchSalaries();
    }, [token]);

    const handleYearChange = (e) => { 
        setSelectedYear(e.target.value); 
        setCurrentPage(1); 
    };

    const handleMonthChange = (e) => { 
        setSelectedMonth(e.target.value); 
        setCurrentPage(1); 
    };

    const filteredSalaryDetails = salaryDetails.filter((sal) => {
        return (
            (selectedYear === "" || sal.year === selectedYear) && 
            (selectedMonth === "" || sal.month === selectedMonth)
        );
    });

    const totalPages = Math.ceil(filteredSalaryDetails.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage; 
    const currentSalaryDetails = filteredSalaryDetails.slice(startIndex, startIndex + recordsPerPage);

    const handlePageChange = (pageNumber) => { 
        setCurrentPage(pageNumber); 
    };
    const handleedit = (salaryid) => {
        navigate(`/dashboard/leaves/${salaryid}`);
      };
    return (
        <div className="container" style={{background:"white"}}>
            {error && <div className="alert alert-danger">{error.toString()}</div>}
            <div className="card-body">
                <h1 className="text-center"><b>SALARY RECORD</b></h1>

                <div className="row mb-3 align-items-center">
                    <div className="col-md-4">
                        <select
                            value={selectedYear}
                            onChange={handleYearChange}
                            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
                        >
                            <option value=""><b>Select Year</b></option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    Year: {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <select
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
                        >
                            <option value="">Select Month</option>
                            {months.map((month) => (
                                <option key={month} value={month}>
                                    Month: {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Staff ID</th>
                            <th>Name</th>
                            <th>Salary</th>
                            <th>Allce</th>
                            <th>Security</th>
                            <th>Leaves</th>
                            <th>Deduction </th>
                            <th>Net Salary</th>
                            <th>M & Y</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSalaryDetails.length === 0 ? (
                            <tr>
                                <td colSpan="5">No salary records found</td>
                            </tr>
                        ) : (
                            currentSalaryDetails.map((sal) => (
                                <tr key={sal.salaryid}>
                                    <td>{sal.salaryid}</td>
                                    <td>{sal.staff_id}</td>
                                    <td>{sal.name}</td>
                                    <td>{sal.salary}</td>
                                    <td>{sal.allowance}</td>
                                    <td>{sal.security}</td>
                                    <td>{sal.leave_availed}</td>
                                    <td>{sal.deduction}</td>
                                    <td>{sal.net_salary}</td>
                                    <td>{sal.month} / {sal.year}</td>
                                    <td className="text-center">
  <button className="btn btn-primary" onClick={() => handleedit(sal.salaryid)}>Add Leaves</button>
</td>
                                </tr>
                            ))
                        )}
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
        </div>
    );
}
