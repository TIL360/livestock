import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";
import { PDFDownloadLink } from '@react-pdf/renderer';
import FeePdf from './FeeReport'; // Ensure this path is correct

const Reports = () => {
  const { token } = useContext(userContext);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [feeDetails, setFeeDetails] = useState(null); // Changed to null for better checks

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const fetchFeesData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/feestats/monthlyreport`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              year: selectedYear,
              month: selectedMonth
            }
          });
          setFeeDetails(response.data.data); // Adjust based on your API response
        } catch (error) {
          console.error("Error fetching fee data:", error);
        }
      };

      fetchFeesData();
    }
  }, [selectedYear, selectedMonth, token]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="container" style={{ background: "white" }}>
      <h1 className="text-center"><b>Download Fee Report</b></h1>
      <div className="row mb-3 align-items-center">
        <div className="col-md-3">
          <select value={selectedYear} onChange={handleYearChange} className="form-control mx-2">
            <option value="">Select Year</option>
            {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select value={selectedMonth} onChange={handleMonthChange} className="form-control mx-2">
            <option value="">Select Month</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
              <option key={month} value={month}>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          {feeDetails && (
            <PDFDownloadLink
              document={<FeePdf feeDetails={feeDetails} />}
              fileName={`fee_report_${selectedMonth}_${selectedYear}.pdf`}
            >
              <button className="btn btn-primary">Download Report</button>
            </PDFDownloadLink>
          )}
        </div>
      </div>
      {(!feeDetails || feeDetails.length === 0) && <p>No records found for the selected month and year.</p>}
    </div>
  );
};

export default Reports;
