import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";
import { FaEdit, FaPlusSquare, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap"; // Make sure you have react-bootstrap installed

export default function StudentList() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const { token } = useContext(userContext);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentAdmNo, setCurrentAdmNo] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [token]);

  const handleClick = () => {
    navigate("/dashboard/studentcreate");
  };

  const handleAttendance = () => {
    navigate("/dashboard/attendance");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/students/del/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(students.filter((student) => student.id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/studentedit/${id}`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.adm_no.toString().includes(search) ||
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.standard.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = (adm_no) => {
    setCurrentAdmNo(adm_no);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate("");
  };

  const handleGenerateInvoice = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/fee/insert-single`,
        { adm_no: currentAdmNo, selected_date: selectedDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(`Invoice generated for Adm No: ${currentAdmNo}`);
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
        <h1 className="text-center"><b>STUDENTS</b></h1>
        <div className="row align-items-center">
          <div className="col-md-4 text-center"></div>
          <div className="row align-items-center">
            <div className="col-md-3">
              <button className="btn btn-primary" onClick={handleClick}>
                Add New
              </button>
              <button className="btn btn-success ml-1" onClick={handleAttendance}>
                Attendance
              </button>
            </div>
            <div className="col-md-9">
              <label htmlFor="searchInput" className="form-label d-none">Search here...</label>
              <input
                type="text"
                className="form-control border-pill border-3 border-info"
                id="searchInput"
                value={search}
                onChange={handleSearch}
                placeholder="Search by Adm No, Name, or Standard"
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
              <th>Adm No</th>
              <th>Name</th>
              <th>Father</th>
              <th>Standard</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.adm_no}</td>
                <td>{student.name}</td>
                <td>{student.father}</td>
                <td>{student.standard}</td>
                <td className="d-flex justify-content-center align-items-center" style={{ height: "70px" }}>
                  {student.image && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${student.image}`}
                      alt={student.name}
                      style={{ width: "70px", height: "70px" }}
                    />
                  )}
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(student.id)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-danger ml-1" onClick={() => handleDelete(student.id)}>
                    <FaTrash />
                  </button>
                  <button className="btn btn-success ml-1" onClick={() => handleShowModal(student.adm_no)}>
                    <FaPlusSquare />
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
