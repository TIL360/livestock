import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // Make sure react-bootstrap is installed

export default function GoatList() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const { token } = useContext(userContext);
  
  const [goats, setGoats] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2;

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  // eslint-disable-next-line
  const [currentId, setCurrentId] = useState(""); // For invoice/gen

  // Fetch goats from API
  useEffect(() => {
    const fetchGoats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/animals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoats(response.data);
      } catch (error) {
        console.error("Error fetching goats:", error);
      }
    };
    fetchGoats();
  }, [token]);

  const handleClick = () => {
    navigate("/dashboard/animalcreate");
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/animalsedit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/animals/del/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoats(goats.filter((goat) => goat.id !== id));
      } catch (error) {
        console.error("Error deleting goat:", error);
      }
    }
  };

  const handleInactive = () => {
    navigate(`/dashboard/animalssold`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredGoats = goats.filter((goat) =>
    (goat.id && goat.id.toString().includes(search)) ||
    (goat.description && goat.description.toLowerCase().includes(search.toLowerCase())) ||
    (goat.purchase_date && goat.purchase_date.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredGoats.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentGoats = filteredGoats.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate("");
  };

  const handleGenerateInvoice = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/fee/insert-single`,
        { id: currentId, selected_date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`Invoice generated for Goat ID: ${currentId}`);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="text-center"><b>AVAILABLE ANIMALS</b></h1>
        <div className="row align-items-center">
          <div className="col-md-5 text-center"></div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <button className="btn btn-primary" onClick={handleClick}>Add New</button>
              <button className="btn btn-warning ml-1" onClick={handleInactive}>Sold</button>
            </div>
            <div className="col-md-7">
              <label htmlFor="searchInput" className="form-label d-none">Search here...</label>
              <input
                type="text"
                className="form-control border-pill border-3 border-info"
                id="searchInput"
                value={search}
                onChange={handleSearch}
                placeholder="Search by ID, Description, or Purchase Date"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Description</th>
              <th>Image</th>
              <th>Cost</th>
              <th>Purchase Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentGoats.map((goat) => (
              <tr key={goat.id}>
                <td>{goat.id}</td>
                <td>{goat.description}</td>
                <td className="d-flex justify-content-center align-items-center">
                  {goat.image && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${goat.image}`}
                      alt={goat.description}
                      style={{ width: "400px", height: "200px" }}
                    />
                  )}
                </td>
                <td>{goat.cost}</td>
                <td>{goat.purchase_date}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(goat.id)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-danger ml-1" onClick={() => handleDelete(goat.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
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

      {/* Modal for Invoice Generation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Generate Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="invoiceDate" className="form-label">Select Date:</label>
          <input
            type="date"
            className="form-control"
            id="invoiceDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleGenerateInvoice}>
            Generate Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
