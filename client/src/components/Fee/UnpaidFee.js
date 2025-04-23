import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";

export default function UnpaidFee() {
  const [feePaidDetails, setFeePaidDetails] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useContext(userContext);
  const [standards, setStandards] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchFeePaidDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/unpaid`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        

        if (response.data && Array.isArray(response.data.data)) {
          setFeePaidDetails(response.data.data);
          const standardsSet = [
            ...new Set(response.data.data.map((inv) => inv.FeeStandard)),
          ];
          setStandards(standardsSet);
         

          // Extracting years and months from `created_at`
          const yearsSet = [
            ...new Set(
              response.data.data
                .map((inv) => new Date(inv.created_at).getFullYear())
                .filter(Boolean)
            ),
          ];
          const monthsSet = [
            ...new Set(
              response.data.data
                .map((inv) => new Date(inv.created_at).getMonth() + 1)
                .filter(Boolean)
            ),
          ];

          // Setting the years and months state
          setYears(yearsSet);
          setMonths(monthsSet);
        } else {
          console.error(
            "Expected an array of invoices, but got:",
            response.data.data
          );
        }

        if (!response.data.success) {
          setError("Failed to fetch fee paid details.");
        }
      } catch (error) {
        setError("Error fetching fee paid details. Please try again later.");
        console.error("Error fetching fee paid details:", error);
      }
    };

    fetchFeePaidDetails();
  }, [token]);

  const handleStandardChange = (e) => setSelectedStandard(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  const filteredFeePaidDetails = feePaidDetails.filter((detail) => {
    const matchesStandard = selectedStandard
      ? detail.FeeStandard === selectedStandard
      : true;
        const createdAt = new Date(detail.created_at);
    const matchesYear = selectedYear
      ? createdAt.getFullYear() === Number(selectedYear)
      : true;
    const matchesMonth = selectedMonth
      ? createdAt.getMonth() + 1 === Number(selectedMonth)
      : true;

    return matchesStandard && matchesYear && matchesMonth;
  });

  return (
    <div className="container" style={{background:"white"
    }}>
      <h2 className="text-center">Unpaid Fee Detail</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div>
        <table>
          <tr>
            <td>
              <select
                value={selectedStandard}
                onChange={handleStandardChange}
                className="form-control mx-2 shadow p-2 rounded"
              >
                <option value="">Select Standard</option>
                {standards.map((standard) => (
                  <option key={standard} value={standard}>
                    {standard}
                  </option>
                ))}
              </select>
            </td>
           
            <td>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="form-control mx-2 shadow p-2 rounded"
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="form-control mx-2 shadow p-2 rounded"
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </td>
          </tr>
        </table>
      </div>

      <table className="table table-bordered">
      <thead>
  <tr>
    <th>Id</th>
    <th>Adm No</th>
    <th>Name</th>
    <th>Class</th>
    <th>Fee M/Y</th> {/* You might want to clarify in the header that it's showing Year and Month */}
    <th>Fee</th>
    <th>Arrears</th>
    <th>Total Fee</th>
  </tr>
</thead>
<tbody>
  {filteredFeePaidDetails.length === 0 ? (
    <tr>
      <td colSpan="8">No fee paid records found</td>
    </tr>
  ) : (
    filteredFeePaidDetails.map((detail) => (
      <tr key={detail.idf}>
        <td>{detail.idf}</td>
        <td>{detail.fee_adm_no}</td>
        <td>{detail.name}</td>
        <td>{detail.FeeStandard}</td>
        <td>{`${detail.fyear || "Nmonthly_fee_feetbl	/A"} / ${detail.fmonth || "N/A"}`}</td>
        <td>{detail.monthly_fee_feetbl}</td>
        <td>{detail.total_arrears}</td>
        <td>{detail.total_fee}</td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
  );
}
