import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const DynamicDB = () => {
    const navigate = useNavigate();
    const { token } = useContext(userContext);
    
    const [stats, setStats] = useState({
        purchaseCost: 0,
        totalExpense: 0,
    });
    
    const [error, setError] = useState(null);
    
    // Fetch purchase cost and total expense
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [purchaseRes, expenseRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/stats/purchase_cost`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/stats/expenses/total`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setStats({
                    purchaseCost: purchaseRes.data.totalPurchaseCost,
                    totalExpense: expenseRes.data.totalExpense,
                });
            } catch (err) {
                setError(err);
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, [token]);
    
    const handleReport = () => {
        navigate('/dashboard/report');
    };
    
    // Function to get current month and year
    const getCurrentMonthYear = () => {
        const date = new Date();
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    };
    
    return (
        <div className="container" style={{ background: 'white' }}>
            <h1 className="text-center my-4">
                STATISTICS FOR {getCurrentMonthYear().toUpperCase()} <b onClick={handleReport} style={{ cursor: 'pointer', color: 'green' }}>(REPORT)</b>
            </h1>
            {error && <div className="alert alert-danger">{error.toString()}</div>}
            <div className="row text-center">
                {/* Purchase Cost Card */}
                <div className="col-md-6 col-sm-6 mb-4">
                    <div className="card shadow-lg border-light">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faShoppingCart} size="3x" className="text-primary mb-2" />
                            <h5>Purchase Cost</h5>
                            <p className="display-4">{stats.purchaseCost}</p>
                        </div>
                    </div>
                </div>
                {/* Total Expense Card */}
                <div className="col-md-6 col-sm-6 mb-4">
                    <div className="card shadow-lg border-light">
                        <div className="card-body">
                            <FontAwesomeIcon icon={faMoneyBillWave} size="3x" className="text-danger mb-2" />
                            <h5>Total Expenses</h5>
                            <p className="display-4">{stats.totalExpense}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicDB;
