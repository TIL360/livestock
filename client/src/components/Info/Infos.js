import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import userContext from "../context/UserContext";
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Infos() {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();
  const { token } = useContext(userContext);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/info`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/info/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <div className="container mt-5" style={{background:"white"}}>
      <h1 className='text-center'>Announcements</h1>
      <button className="btn btn-primary mb-3" onClick={() => navigate('/dashboard/createinfo')}>Create New</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement) => (
            <tr key={announcement.id}>
              <td>{announcement.title}</td>
              <td>{announcement.description}</td>
              <td>{announcement.image ? <img  src={`${process.env.REACT_APP_API_URL}/${announcement.image}`} alt="Announcement" style={{ width: "70px", height: "70px" }} /> : 'No Image'}</td>
              <td>
                <button className="btn btn-warning" onClick={() => navigate(`/dashboard/infoedit/${announcement.id}`)}><FaEdit/></button>
                <button className="btn btn-danger ml-1" onClick={() => handleDelete(announcement.id)}><FaTrash/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
