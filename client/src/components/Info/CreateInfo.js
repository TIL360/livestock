import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from "../context/UserContext";

export default function CreateInfo() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const { token, user } = useContext(userContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('created_by', user.username); // Add the username here
    if (image) {
      formData.append('image', image);
    }
  
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/info/add`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard/infos');
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };
  

  const handleBack = () => {
    navigate('/dashboard/infos');
}
  return (
    <div className="container mt-5" style={{background:"white"}}>
      <h1 className='text-center'>Add New Announcement</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement Title..."
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Announcement Description..."
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add</button>
        <button type="button" className="btn btn-secondary ms-2 ml-1" onClick={handleBack}>Back</button>
                    
      </form>
    </div>
  );
}
