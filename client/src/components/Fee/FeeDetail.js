import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from '@react-pdf/renderer';
import FeePdf from './Feepdf';
import { FaWallet, FaTrash } from "react-icons/fa";


const FeeDetail = () => {
  const navigate = useNavigate();
  const [invdetails, setInvdetails] = useState([]);
  const [error, setError] = useState(null);
  const { token, standards } = useContext(userContext);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 50;
  const [fetchData, setFetchData] = useState(false);

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
        } else {
          console.error("Expected an array of invoices, but got:", response.data.data);
        }
      } catch (error) {
        setError(error);
        console.error("Error fetching invoices:", error);
      }
    };
    if (fetchData) {
      fetchInvoices();
    }
  }, [token, fetchData]);

  const handleFetchData = () => {
    setFetchData(true);
  };

  const handleInsertFees = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/fee/insert-fees`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Inserted Records: ${response.data.insertedRecords}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error inserting fees:", error);
      alert("Failed to insert fees");
    }
  };

  const handleCollect = (idf) => {
    navigate(`/dashboard/feecollection/${idf}`);
  };

  const handleStandardChange = (e) => {
    setSelectedStandard(e.target.value);
    setCurrentPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setCurrentPage(1);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setCurrentPage(1);
  };

  const handlePaid = () => {
    navigate("/dashboard/feepaid");
  };

  const handleUnpaid = () => {
    navigate("/dashboard/unpaidfee");
  };

  const filteredInvdetails = invdetails.filter((inv) => {
    return (
      (selectedStandard === "" || inv.FeeStandard === selectedStandard) &&
      (selectedYear === "" || inv.fyear === selectedYear) &&
      (selectedMonth === "" || inv.fmonth === selectedMonth)
    );
  });

  const totalPages = Math.ceil(filteredInvdetails.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentInvDetails = filteredInvdetails.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (idf) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
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

  return (
    <div className="container" style={{ background: "white" }}>
      {error && <div className="alert alert-danger">{error.toString()}</div>}
      <div className="card-body">
      <div className="col-md-12 text-center">
  <h1 className="text-center"><b>FEE RECORD</b></h1>
</div>
<div className="row mb-3 align-items-center">
  <div className="col-md-3">
    <select value={selectedStandard} onChange={handleStandardChange} className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info">
      <option value=""><b>Select Standard</b></option>
      {standards.map((standard) => (
        <option key={standard.sid} value={standard.standard}> Class: {standard.standard} </option>
      ))}
    </select>
  </div>
  <div className="col-md-3">
    <select value={selectedYear} onChange={handleYearChange} className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info">
      <option value="">Select Year</option>
      {[2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
        <option key={year} value={year}> Year: {year} </option>
      ))}
    </select>
  </div>
  <div className="col-md-3">
    <select value={selectedMonth} onChange={handleMonthChange} className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info">
      <option value="">Select Month</option>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
        <option key={month} value={month}> Month No: {month} </option>
      ))}
    </select>

  </div>
  <div className="col-md-3">
  <button className="btn btn-primary btn-sm mb-1 shadow p-2 rounded" onClick={handleFetchData}>
      Go
    </button>
  </div>
</div>
<div>
  <button className="btn btn-primary btn-sm mb-1 shadow p-2 rounded" onClick={handleInsertFees}>
    <b>Generate Invoices</b>
  </button>
  <button className="btn btn-success ml-1 btn-sm mb-1 shadow p-2 rounded" onClick={handlePaid}>
    <b>Fee Paid Detail</b>
  </button>
  <button className="btn btn-danger ml-1 btn-sm mb-1 shadow p-2 rounded" onClick={handleUnpaid}>
    <b>Unpaid Fee Detail</b>
  </button>
  <PDFDownloadLink document={<FeePdf feeDetails={filteredInvdetails} />} fileName="fee_report.pdf">
    <button className="btn btn-warning ml-1 btn-sm mb-1 shadow p-2 rounded">
      Download Report
    </button>
  </PDFDownloadLink>
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
        <td colSpan="11">No invoices found</td>
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
            <button className="btn btn-success" onClick={() => handleCollect(inv.idf)}>
              <FaWallet/>
            </button>
            <button className="btn btn-danger ml-1" onClick={() => handleDelete(inv.idf)}>
              <FaTrash/>
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
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
    };
    
    export default FeeDetail;