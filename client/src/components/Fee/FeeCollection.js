import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import userContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function FeeCollection() {
    const { user } = useContext(userContext); // Correctly access username from context
    const { idf } = useParams();
    const { token } = useContext(userContext);
    const navigate = useNavigate();
   
    
    const [feedetail, setFeeDetail] = useState({
        fee_adm_no: "",
        idf: "",
        feestandard: "",
        monthly_fee: "",
        collection: "",
        total_fee: "",
        fine_fee: "",  // Include the fine field initially
    });

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/fee/${idf}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Fetched student data:", response.data);
                if (response.data.success && response.data.data.length > 0) {
                    setFeeDetail(response.data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching student:", error);
            }
        };

        fetchInvoices();
    }, [idf, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeeDetail((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        const currentTimestamp = new Date().toISOString();
        
        const dataToUpdate = {
            collection: feedetail.collection,
            fine_fee: feedetail.fine_fee,
            collection_by: user.username,
            payment_at: currentTimestamp
        };
        
        
        console.log("Updating data with:", dataToUpdate);  // Log the data being sent
        
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/fee/${idf}`, dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
            console.log("Update response:", response.data);  // Log the response
            
            if (response.data.success) {
                alert("Update successful!");
                navigate("/dashboard/feedetail");
            } else {
                alert("Update failed: " + response.data.message);  // Show failure message if any
            }
        } catch (error) {
            console.error("Error updating fee detail:", error);
            alert("Error updating the fee detail.");  // UI feedback in case of an error
        }
    };
    
    
    
const handleback = (e)=>{
  navigate('/dashboard/feedetail');
}
    return (
        <div className='container'>
            <div className='row'>
                <h2 className='text-center'>Fee Collection by</h2>
            </div>
            <div className="row">
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <label className="form-control">Invoice Number</label>
                            <input type="text" className="form-control" id="idf" name="idf" value={feedetail?.idf || ""} disabled />
                        </td>
                        <td rowSpan="6">
                            {feedetail.image && (
                                <img className="img-fluid"
                                     src={`${process.env.REACT_APP_API_URL}/${feedetail.image}`}
                                     alt={feedetail.name}
                                     style={{ width: "400px", height: "400px" }}
                                />
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="form-control">Admission Number</label>
                            <input type="text" className="form-control" id="fee_adm_no" name="fee_adm_no" value={feedetail?.fee_adm_no || ""} disabled />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="form-control">Student Name</label>
                            <input type="text" className="form-control" id="name" name="name" value={feedetail?.name || ""} disabled />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className="form-control">Total Fee</label>
                            <input type="text" className="form-control" id="total_fee" name="total_fee" value={feedetail?.total_fee || ""} disabled />
                        </td>
                    </tr>
                    <tr>
    <td>
        <label className="form-control">Fine Fee</label>
        <input
    type="text"
    className="form-control"
    id="fine"
    name="fine_fee"
    value={feedetail?.fine_fee || ""}
    onChange={handleChange}
/>

    </td>
</tr>

                    <tr>
                        <td>
                            <label className="form-control">Fee Collection Amount</label>
                            <input
                                type="text"
                                className="form-control input-red"
                                id="collection"
                                name="collection"
                                value={feedetail?.collection || ""}
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button className="btn btn-success" onClick={handleUpdate}>
                                Update
                            </button>
                            <button className="btn btn-secondary ml-2" onClick={handleback}>
                                Back
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
