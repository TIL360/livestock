import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";

export default function StudentList() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const { token } = useContext(userContext);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // items to display per page

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleDelete = async (admNo) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://theoaksserver.theoaksschool.xyz/students/${admNo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudents(students.filter((student) => student.adm_no !== admNo));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleEdit = (admNo) => {
    navigate(`/dashboard/studentedit/${admNo}`);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredStudents = students.filter((student) => {
    return (
      student.adm_no.toString().includes(search) ||
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.standard.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredStudents.length / recordsPerPage);

  // Calculate the records to be displayed on the current page
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + recordsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            </div>
            <div className="col-md-9">
              <label htmlFor="searchInput" className="form-label d-none ">Search here...</label>
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
                      src={`http://theoaksserver.theoaksschool.xyz/${student.image}`}
                      alt={student.name}
                      style={{ width: "70px", height: "70px" }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(student.adm_no)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(student.adm_no)}
                  >
                    Delete
                  </button>
                </td>
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
    </div>
  );
}
