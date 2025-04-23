import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";
import { FaEdit, FaTrash, FaWallet } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const FeeSearch = () => {
    const { token, admno, setAdmno, feeDetail, setFeeDetail } = useContext(userContext);
    const location = useLocation();
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [dataFetched, setDataFetched] = useState(false);
    const [deleteError, setDeleteError] = useState(""); // New state for delete error message

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
            setTimeout(() => {
                setMessage(null);
            }, 4000);
        }
    }, [location.state?.message]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/fee/search/${admno}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success && response.data.data.length > 0) {
                setFeeDetail(response.data.data);
                setDataFetched(true);
                setDeleteError(""); // Clear delete error message
            } else {
                alert("No data found for the given admission number.");
                setDataFetched(false);
            }
        } catch (error) {
            console.error("Error fetching student:", error);
            alert("Error fetching the student data.");
        }
    };

    const handleCollect = (idf) => {
        navigate(`/dashboard/feecollection/${idf}`);
    };

    const handleEdit = (idf) => {
        navigate(`/dashboard/feeedit/${idf}`);
    };

    const handleDel = async (idf) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this fee record?");
        
        if (!confirmDelete) {
            return; // Do nothing
        }
    
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/fee/${idf}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                alert("Fee record deleted successfully!");
                setDataFetched(false);
                setAdmno("");
                setFeeDetail([]); // Clear fee detail
                setDeleteError(""); // Clear delete error message
            } else {
                // Set error message if deletion is not successful
                setDeleteError("Fee already collected for this invoice, hence cannot be deleted.");
            }
        } catch (error) {
            console.error("Error deleting fee record:", error);
            setDeleteError("Fee already collected, hence cannot be deleted."); // Set error message
        }
    };
    

    return (
        <>
            <div style={{ background: "white" }}>
                {message && (
                    <p style={{ color: "white", background: "green", fontSize: "20px" }}>
                        {message}
                    </p>
                )}
                <div className="row mt-2">
                    <div className="col-md-2 ml-2">
                        <label>
                            <b>Search by Adm No</b>
                        </label>
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by adm number"
                            value={admno}
                            onChange={(e) => setAdmno(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
                <hr />
                {deleteError && <p style={{ color: "red" }}>{deleteError}</p>} {/* Display delete error message */}
                {dataFetched && feeDetail.length > 0 && feeDetail.map((fee, index) => (
                    <div key={index} className="row mt-3">
                        <div className="col-md-12">
                            <h3 className="text-center">
                                Fee Details of Adm No: {fee.fee_adm_no} 
                                <b style={{ color: "green" }}>
                                    {fee.name}, Class: {fee.FeeStandard} Sec: {fee.sec}
                                </b>{" "}
                                for Month: {fee.fmonth} & Year: {fee.fyear}
                            </h3>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Fee</th>
                                        <th>Collection</th>
                                        <th>Balance</th>
                                        <th>Adm Fee</th>
                                        <th>Adm Balance</th>
                                        <th>Adm Arrears</th>
                                        <th>Exam Fee</th>
                                        <th>Exam Fee Balance</th>
                                        <th>Exam Arrears</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{fee.monthly_fee_feetbl}</td>
                                        <td>{fee.collection}</td>
                                        <td>{fee.balance}</td>
                                        <td>{fee.adm_fee}</td>
                                        <td>{fee.adm_balance}</td>
                                        <td>{fee.adm_arrears}</td>
                                        <td>{fee.exam_fee}</td>
                                        <td>{fee.misc_balance}</td>
                                        <td>{fee.misc_arrears}</td>
                                    </tr>
                                </tbody>
                                <thead>
                                    <tr>
                                        <th>Fine Fee</th>
                                        <th>Fine Bal</th>
                                        <th>Fine Arrears</th>
                                        <th>Total Fee</th>
                                        <th>Total Collection</th>
                                        <th>Total Arrears</th>
                                        <th>Total Balance</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{fee.fine_fee}</td>
                                        <td>{fee.fine_balance}</td>
                                        <td>{fee.fine_arrears}</td>
                                        <td>{fee.total_fee}</td>
                                        <td>{fee.total_collection}</td>
                                        <td>{fee.total_arrears}</td>
                                        <td>{fee.total_balance}</td>
                                        <td>
                                            <button className="btn btn-success" onClick={() => handleCollect(fee.idf)}>
                                                <FaWallet />
                                            </button>
                                            <button className="btn btn-success ml-1" onClick={() => handleEdit(fee.idf)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn btn-danger ml-1" onClick={() => handleDel(fee.idf)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                        <td>
                                            {fee.collection_by ? 
                                            <button className="btn btn-success">Paid by {fee.collection_by}</button>
                                            : <button className="btn btn-danger">Unpaid</button>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {index < feeDetail.length - 1 && <hr />} {/* Add <hr /> between rows */}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default FeeSearch;