import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function FeeDetail() {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [invdetails, setInvdetails] = useState([]);
  const [error, setError] = useState(null);
  const [standards, setStandards] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const { token } = useContext(userContext);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // items to display per page

  useEffect(() => {
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fee`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    

      if (Array.isArray(response.data.data)) {
          setInvdetails(response.data.data);
        const standards = [
          ...new Set(response.data.data.map((inv) => inv.FeeStandard)),
        ];
        setStandards(standards);
        const years = [...new Set(response.data.data.map((inv) => inv.fyear))];
        setYears(years);
        const months = [...new Set(response.data.data.map((inv) => inv.fmonth))];
        setMonths(months);
      } else {
        console.error(
          "Expected an array of invoices, but got:",
          response.data.data
        );
      }
    } catch (error) {
      setError(error);
      console.error("Error fetching invoices:", error);
      

    }
  };
  
  fetchInvoices();
}, [token]);


  const handleCollect = (idf) => {
    navigate(`/dashboard/feecollection/${idf}`);
  };

  const handleStandardChange = (e) => {
    setSelectedStandard(e.target.value);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1); // Reset page on filter change
  };

  const handlepaid = (e) => {
    navigate("/dashboard/feepaid");
  };

  const handleunpaid = (e) => {
    navigate("/dashboard/unpaidfee");
  };

  const filteredInvdetails = invdetails.filter((inv) => {
    return (
      (selectedStandard === "" || inv.FeeStandard === selectedStandard) &&
      (selectedYear === "" || inv.fyear === selectedYear) &&
      (selectedMonth === "" || inv.fmonth === selectedMonth)
    );
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredInvdetails.length / recordsPerPage);

  // Calculate the records to be displayed on the current page
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentInvDetails = filteredInvdetails.slice(startIndex, startIndex + recordsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Delete and Insert functions remain the same...

  const handleDelete = async (idf) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/fee/${idf}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvdetails(invdetails.filter((inv) => inv.idf !== idf));
        alert("Record deleted successfully.");
      } catch (error) {
        setError(error);
        console.error("Error deleting record:", error);
      }
    } else {
      console.log("Delete operation canceled.");
    }
  };

  const handleInsertFees = async () => {
    try {
      const response = await axios.post(
        "${process.env.REACT_APP_API_URL}/fee/insert-fees",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(`Inserted Records: ${response.data.insertedRecords}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error inserting fees:", error);
      alert("Failed to insert fees");
    }
  };

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error.toString()}</div>}
      <div className="card-body">
        <div className="col-md-12 text-center">
          <h1 className="text-center"><b>FEE RECORD</b></h1>
          
        </div>
        <div className="row mb-3 align-items-center">
          <div className="col-md-4">
            <select
              value={selectedStandard}
              onChange={handleStandardChange}
              className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
            >
              <option value=""><b>Select Standard</b></option>
              {standards.map((standard) => (
                <option key={standard} value={standard}>
                  Class: {standard}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
            >
              <option value="">Select Year</option>
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
                  Month No: {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <button
            className="btn btn-primary btn-sm mb-1 shadow p-3 rounded"
            onClick={handleInsertFees}
          >
            <b>Generate Invoices</b>
          </button>
          <button
            className="btn btn-success ml-1 btn-sm mb-1 shadow p-3 rounded"
            onClick={handlepaid}
          >
            <b>Fee Paid Detail</b>
          </button>
          <button
            className="btn btn-danger ml-1 btn-sm mb-1 shadow p-3 rounded"
            onClick={handleunpaid}
          >
            <b>Unpaid Fee Detail</b>
          </button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Adm No</th>
              <th>Standard</th>
              <th>Monthly Fee</th>
              <th>Fine</th>
              <th>Arrears</th>
              <th>Balance</th>
              <th>Total Fee</th>
              <th>Collection</th>
              <th>M / Y</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentInvDetails.length === 0 ? (
              <tr>
                <td colSpan="6">No invoices found</td>
              </tr>
            ) : (
              currentInvDetails.map((inv) => (
                <tr key={inv.idf}>
                  <td>{inv.idf}</td>
                  <td>{inv.fee_adm_no}</td>
                  <td>{inv.FeeStandard}</td>
                  <td>{inv.monthly_fee}</td>
                  <td>{inv.fine_fee}</td>
                  <td>{inv.arrears}</td>
                  <td>{inv.balance}</td>
                  <td>{inv.total_fee}</td>
                  <td>{inv.collection}</td>
                  <td>
                     {inv.fmonth} / {inv.fyear}
                  </td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleCollect(inv.idf)}
                    >
                      Collect
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(inv.idf)}
                    >
                      Delete
                    </button>
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
