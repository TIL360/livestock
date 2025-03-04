import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnnouncementPublished() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Fetch announcements from the backend
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/info`); // Replace YOUR_PORT with the actual port number
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div style={{ background: "white", padding: "20px", height:"100vh" }}>
      <h2 className='text-center'>Important Announcements</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px', width:"10%" }}>Date</th>
            <th style={{ border: '1px solid black', padding: '8px', width:"20%" }}>Title</th>
            <th style={{ border: '1px solid black', padding: '8px', width:"70%" }}>Announcement</th>
           
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement) => (
            <tr key={announcement.id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {new Date(announcement.created_at).toLocaleDateString()} {/* Format the date as needed */}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {announcement.title}
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                {announcement.description}
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

 
}
