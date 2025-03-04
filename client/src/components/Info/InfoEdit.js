import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import userContext from "../context/UserContext";

export default function InfoEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const navigate = useNavigate();
  const { token, user } = useContext(userContext); // Get user context

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/info/edit/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTitle(response.data.title);
        setDescription(response.data.description);
        setExistingImage(response.data.image);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };

    fetchAnnouncement();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('updated_by', user.username); // Add the username here

    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/info/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard/infos');
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/infos');
  }

  return (
    <div className="container mt-5" style={{background:"white"}}>
      <h1 className='text-center'>Edit Announcement</h1>
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
          <label className="form-label">Current Image:</label>
          {existingImage ? <img src={`${process.env.REACT_APP_API_URL}/${existingImage}`} alt="Existing" className="img-thumbnail" style={{ width: "100px", height: "100px" }} /> : 'No image uploaded'}
        </div>
        <div className="mb-3">
          <label className="form-label">Image:</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Info</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={handleBack}>Back</button>
      </form>
    </div>
  );
}
