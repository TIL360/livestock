import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AnimalsSold() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const { token } = useContext(userContext);

  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10; // or your preferred number

  // Fetch inactive animals
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/animals/sold`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnimals(response.data);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };
    fetchAnimals();
  }, [token]);

  const handleAddNew = () => {
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
        setAnimals(animals.filter((animal) => animal.id !== id));
      } catch (error) {
        console.error("Error deleting animal:", error);
      }
    }
  };

  const handleInactive = () => {
    navigate("/dashboard/animalslist");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filter based on search
  const filteredAnimals = animals.filter((animal) =>
    (animal.id && animal.id.toString().includes(search)) ||
    (animal.description && animal.description.toLowerCase().includes(search.toLowerCase())) ||
    (animal.purchase_date && animal.purchase_date.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAnimals.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentAnimals = filteredAnimals.slice(startIndex, startIndex + recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  

  

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="text-center"><b>SOLD OUT</b></h1>
        <div className="row align-items-center">
          <div className="col-md-5 text-center"></div>
          <div className="row align-items-center">
            <div className="col-md-5">
              <button className="btn btn-primary" onClick={handleAddNew}>Add New</button>
              <button className="btn btn-success ml-1" onClick={handleInactive}>Active List</button>
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
              <th>Sold Amount</th>
              <th>Purchase Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAnimals.map((animal) => (
              <tr key={animal.id}>
                <td>{animal.id}</td>
                <td>{animal.description}</td>
                <td className="d-flex justify-content-center align-items-center">
                  {animal.image && (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${animal.image}`}
                      alt={animal.description}
                      style={{ width: "400px", height: "200px" }}
                    />
                  )}
                </td>
                <td>{animal.sell_amount}</td>
                <td>{animal.purchase_date}</td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEdit(animal.id)}>
                    <FaEdit />
                  </button>
                  <button className="btn btn-danger ml-1" onClick={() => handleDelete(animal.id)}>
                    <FaTrash />
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
