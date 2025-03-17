import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGraduate, faMoneyBillWave, faDollarSign, faClipboardCheck, faMoneyCheck } from '@fortawesome/free-solid-svg-icons';

const DynamicDB = () => {
    const navigate = useNavigate();
    const { token } = useContext(userContext);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalSalaries: 0,
        totalCollections: 0,
        totalReceiveables: 0,
        totalExpense: 0,
        totalfee: 0,
    });

    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchStats = async () => {
          try {
              const response = await axios.get(`${process.env.REACT_APP_API_URL}/feestats/stats`, { headers: { Authorization: `Bearer ${token}` } });
              setStats({
                  totalStudents: response.data.totalStudents,
                  totalSalaries: response.data.totalSalaries,
                  totalCollections: response.data.totalCollections,
                  totalReceiveables: response.data.totalReceiveables || 0,
                  totalExpense: response.data.totalExpenses,
                  totalfee: response.data.totalfee,
              });
          } catch (err) {
              setError(err);
              console.error('Error fetching statistics:', err);
          }
      };
    
      fetchStats();
    }, [token]);
    
    const handleReport = () => {
        navigate('/dashboard/report');
    };

    // Function to get the current month and year
    const getCurrentMonthYear = () => {
        const date = new Date();
        const options = { year: 'numeric', month: 'long' }; // Format options
        return date.toLocaleDateString('en-US', options); // Returns 'March 2025' for example
    };

    return (
        <div className="container" style={{ background: 'white' }}>
           <h1 className="text-center my-4">
    STATISTICS FOR {getCurrentMonthYear().toUpperCase()} <b onClick={handleReport} style={{ cursor: 'pointer', color: 'green' }}>(REPORT)</b>
</h1>

            {error && <div className="alert alert-danger">{error.toString()}</div>}
            <div className="row text-center">
                <div className="col-md-6 col-sm-6 mb-4">
                    <div className="card shadow-lg border-light">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faUserGraduate} size="3x" className="text-primary mb-2" />
                            <h5>Total Students</h5>
                            <p className="display-4">{stats.totalStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6 mb-4">
                    <div className="card shadow-lg border-light">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faClipboardCheck} size="3x" className="text-success mb-2" />
                            <h5>Total Fee Collection</h5>
                            <p className="display-4">{stats.totalCollections}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6 mb-4">
                    <div className="card shadow-lg border-light">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faDollarSign} size="3x" className="text-warning mb-2" />
                            <h5>Total Salaries</h5>
                            <p className="display-4">{stats.totalSalaries}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6 mb-4">
                    <div className="card shadow-lg border-light">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faMoneyBillWave} size="3x" className="text-danger mb-2" />
                            <h5>Total Receiveable</h5>
                            <p className="display-4">{stats.totalfee}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-6 mb-4">
                    <div className="card shadow-lg border-light">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faMoneyCheck} size="3x" className="text-danger mb-2" />
                            <h5>Expenses</h5>
                            <p className="display-4">{stats.totalExpense}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicDB;
