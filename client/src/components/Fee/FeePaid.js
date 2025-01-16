import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";

export default function FeePaid() {
  const [feePaidDetails, setFeePaidDetails] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useContext(userContext);
  const [standards, setStandards] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState("");
  const [collectionBy, setCollectionBy] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed

  useEffect(() => {
    const fetchFeePaidDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/feepaid`, {

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
          const collectionBySet = [
            ...new Set(response.data.data.map((inv) => inv.collection_by)),
          ];
          setCollectionBy(collectionBySet);

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
  const handleCollectionByChange = (e) => setSelectedCollection(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);

  const filteredFeePaidDetails = feePaidDetails.filter((detail) => {
    const matchesStandard = selectedStandard
      ? detail.FeeStandard === selectedStandard
      : true;
    const matchesCollection = selectedCollection
      ? detail.collection_by === selectedCollection
      : true;
    const createdAt = new Date(detail.created_at);
    const matchesYear = selectedYear
      ? createdAt.getFullYear() === Number(selectedYear)
      : true;
    const matchesMonth = selectedMonth
      ? createdAt.getMonth() + 1 === Number(selectedMonth)
      : true;

    return matchesStandard && matchesCollection && matchesYear && matchesMonth;
  });

  // Logic for pagination
  const indexOfLastDetail = currentPage * itemsPerPage;
  const indexOfFirstDetail = indexOfLastDetail - itemsPerPage;
  const currentDetails = filteredFeePaidDetails.slice(
    indexOfFirstDetail,
    indexOfLastDetail
  );
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h2 className="text-center">Fee Paid Detail</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div>
      <hr/>
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
                value={selectedCollection}
                onChange={handleCollectionByChange}
                className="form-control mx-2 shadow p-2 rounded"
              >
                <option value="">Select User</option>
                {collectionBy.map((collection) => (
                  <option key={collection} value={collection}>
                    {collection}
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
<hr/>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Adm No</th>
            <th>Name</th>
            <th>Standard</th>
            <th>Collection</th>
            <th>Total Fee</th>
            <th>Collected By</th>
            <th>Payment At</th>
          </tr>
        </thead>
        <tbody>
          {currentDetails.length === 0 ? (
            <tr>
              <td colSpan="8">No fee paid records found</td>
            </tr>
          ) : (
            currentDetails.map((detail) => (
              <tr key={detail.idf}>
                <td>{detail.idf}</td>
                <td>{detail.fee_adm_no}</td>
                <td>{detail.name}</td>
                <td>{detail.FeeStandard}</td>
                <td>{detail.collection}</td>
                <td>{detail.total_fee}</td>
                <td>{detail.collection_by}</td>
                <td>{detail.payment_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      <div>
        {Array.from({ length: Math.ceil(filteredFeePaidDetails.length / itemsPerPage) }, (_, index) => (
          <button key={index + 1}
          className={`btn ${currentPage === index + 1 ? "btn-success" : "btn-primary"}`}
           onClick={() => paginate(index + 1)} >
            {index + 1}
          </button>
        ))}
      </div>
      
    </div>
  );
}
