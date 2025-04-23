import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditImage() {
  const navigate = useNavigate();
  const { token } = useContext(userContext);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [oldPhoto, setOldPhoto] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photo: '',
  });

  useEffect(() => {
    const fetchImageDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/image/edit/${id}`);
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          photo: response.data.photo || '',
        });
        setOldPhoto(response.data.photo || ''); 
        setErrorMessage("");
      } catch (error) {
        console.error('Error fetching image details:', error);
        setErrorMessage('Error fetching image details.');
      } finally {
        setLoading(false);
      }
    };
    fetchImageDetails();
  }, [id, token]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prevState) => ({ ...prevState, photo: e.target.files[0] }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);

    // Only append the new image if it exists
    if (formData.photo && formData.photo instanceof File) {
        data.append('photo', formData.photo);
    } else {
        // Append the old photo if no new one is uploaded
        data.append('oldPhoto', oldPhoto);
    }
    
    try {
        await axios.patch(`${process.env.REACT_APP_API_URL}/image/update/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
        });
        navigate('/dashboard/images');
    } catch (error) {
        console.error('Error updating image:', error);
        setErrorMessage(error.response?.data.error || 'Error updating image.');
    }
};

  
  const handleBack = () => {
    navigate("/dashboard/images");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5" style={{ background: "white" }}>
      <h2>Edit Image</h2>
      {errorMessage && (
        <div className="alert alert-warning" role="alert">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input type="text" name="description" className="form-control" value={formData.description} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
  <label className="form-label">Image</label>
  <input type="file" className="form-control" onChange={handleImageChange} accept="image/*" />
  {oldPhoto && (
    <img
        src={`${process.env.REACT_APP_API_URL}/uploads/webimages/${oldPhoto}`}
        alt="Current"
        style={{ width: '100px', height: '100px' }}
    />
)}


</div>
        <div className='row'>
          <button className="btn btn-success col-md-2 ml-3" type="submit"> Update </button>
          <button className="btn btn-secondary ml-1 col-md-2" type="button" onClick={handleBack}> Back </button>
        </div>
      </form>
    </div>
  );
}