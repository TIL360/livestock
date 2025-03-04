import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate} from '@fortawesome/free-solid-svg-icons';

const DynamicDB = () => {
  const { token } = useContext(userContext);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSalaries: 0,
    totalCollections: 0,
    totalReceiveables: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const responses = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/fee/students/count`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/fee/salary/total`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/fee/collections/total`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/fee/receiveables/total`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [
          studentResponse,
          feeResponse,
          salaryResponse,
          collectionResponse,
        ] = responses;

        setStats({
          totalStudents: studentResponse.data.totalStudents,
          totalSalaries: feeResponse.data.total, 
          totalfee: salaryResponse.data.total,          
          totalCollections: collectionResponse.data.total,
        });
      } catch (err) {
        setError(err);
        console.error('Error fetching statistics:', err);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="container" style={{background:'white'}}>
      <h1 className="text-center my-4 ">STATISTICS</h1>
      {error && <div className="alert alert-danger">{error.toString()}</div>}
      <div className="row text-center">
        <div className="col-md-3 col-sm-6 mb-4 ">
          <div className="card shadow-lg border-light">
            <div className="card-body">
              <FontAwesomeIcon icon={faUserGraduate} size="3x" className="text-primary mb-2" />
              <h5>Total Students</h5>
              <p className="display-4">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default DynamicDB;
