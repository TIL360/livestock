import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import userContext from "../context/UserContext"; 
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Images() {
  const { token } = useContext(userContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [records, setRecords] = useState([]);
  
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchRecords = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/image`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image file to upload."); // Alert user if no image is selected
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      resetForm();
      fetchRecords(); // Fetch records after submitting
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/image/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const openEditPage = (record) => {
    console.log("Navigating to edit page with record ID:", record.id);  // Debug log
    navigate(`/dashboard/editimage/${record.id}`);
};


  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
  };

  return (
    <div className="container mt-5" style={{ background: "white" }}>
      <h2 className="text-center">Upload Image</h2>
      <form onSubmit={handleSubmit} className="mb-4"> <div className='row'> <div className='col-md-3'>

 

      <input
        type="text"
        className="form-control"
        placeholder='Title goes here...'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    
    </div>
    <div className='col-md-6'>
    <input
        type="text"
        className="form-control"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

    </div>

  <div className='col-md-3'>
  <label className="form-label">Choose Image</label>
      <input
        type="file"
        className="form-control"
        placeholder='Image here...'
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        required
      />
  </div>
    </div>

   

    


    <hr/>
    <button type="submit" className="btn btn-primary">Upload</button>
  </form>


      <h3 className="text-center">Uploaded Images</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{record.title}</td>
              <td>{record.description}</td>
              <td className="text-center">
                {record.photo && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/webimages/${record.photo}`}
                    alt={record.title}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
              </td>
              <td>
                <button className='btn btn-primary' onClick={() => openEditPage(record)}><FaEdit /></button>
                <button className='btn btn-danger ml-1' onClick={() => handleDelete(record.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 