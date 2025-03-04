import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";
import { FaTrash, FaEdit} from "react-icons/fa";


export default function Standards() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [standards, setStandards] = useState([]);
  const { token } = useContext(userContext);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStandards(response.data);
      } catch (error) {
        console.error("Error fetching standards:", error.response ? error.response.data : error);
      }
    };
    
    fetchStandards();
  }, [token]);

  const handleEdit = (sid) => {
    navigate(`/dashboard/standardedit/${sid}`);
  };

  const handleDelete = async (sid) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this standard?");
    if (confirmDelete) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/classes/${sid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStandards((prev) => prev.filter((standard) => standard.sid !== sid));
      } catch (error) {
        console.error("Error deleting standard:", error);
      }
    }
  };

  const handlecreate = () => {
    navigate('/dashboard/standardcreate');
  }

  // Calculate total pages
  const totalPages = Math.ceil(standards.length / recordsPerPage);
  
  // Calculate the records to be displayed on the current page
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentStandards = standards.slice(startIndex, startIndex + recordsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div style={{ background: "white" }}>
        <h1 className="text-center" ><b>STANDARDS</b></h1>
      
      <div className="card-body">
        <button className="btn btn-primary" onClick={handlecreate}>
          New Standard
        </button>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>Standard</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentStandards.map((standard) => (
              <tr key={standard.sid}>
                <td>{standard.sid}</td>
                <td>{standard.standard}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(standard.sid)}
                  >
                    <FaEdit/>
                  </button> 
                  <button
                    className="btn btn-danger ml-1"
                    onClick={() => handleDelete(standard.sid)}
                  >
                    <FaTrash/>
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
    </>
  );
}
