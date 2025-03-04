import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import userContext from '../context/UserContext';

const ResultObtMarks = () => {
    const { resultid } = useParams();
    const { token } = useContext(userContext);
    const navigate = useNavigate();
    
    const initialMarksState = {
        OM1: "",
        OM2: "",
        OM3: "",
        OM4: "",
        OM5: "",
        OM6: "",
        OM7: "",
        OM8: ""
    };
    
    const [marks, setMarks] = useState(initialMarksState);

    useEffect(() => {
        const fetchMarks = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/result/results/${resultid}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(response.data);
                setMarks(response.data);
            } catch (error) {
                console.error("Error fetching obtained marks:", error);
            }
        };

        fetchMarks();
    }, [resultid, token]);

    const handleChange = ({ target: { name, value } }) => {
        setMarks(prevMarks => ({ ...prevMarks, [name]: value }));
    };

    const handleSubmitMarks = async (event) => {
        event.preventDefault();
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/result/results/${resultid}`, marks, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/dashboard/result', { state: { message: "Marks updated successfully!" } });
        } catch (error) {
            console.error("Error updating marks:", error);
        }
    };

    const handleBack = () => {
        navigate('/dashboard/result');
    };

    const renderInputField = (subject, mark) => (
        <tr key={subject}>
            <td><label>{subject}</label></td>
            <td>
                <input 
                    type="text" 
                    name={mark} 
                    value={marks[mark]} 
                    onChange={handleChange} 
                    className="form-control" 
                    autoComplete="off" 
                />
            </td>
        </tr>
    );

    return (
        <div className="row" style={{background:"white"}}>
            <div className="col-md-12 border-4">
                <h2>Assign Total Marks</h2>
                <form onSubmit={handleSubmitMarks}>
                    <table className="table">
                        <tbody>
                            {renderInputField("English (OM1)", "OM1")}
                            {renderInputField("Urdu (OM2)", "OM2")}
                            {renderInputField("Mathematics (OM3)", "OM3")}
                            {renderInputField("Islamiat (OM4)", "OM4")}
                            {renderInputField("Pak Study (OM5)", "OM5")}
                            {renderInputField("Bio / Comp (OM6)", "OM6")}
                            {renderInputField("Physics (OM7)", "OM7")}
                            {renderInputField("Chemistry (OM8)", "OM8")}
                        </tbody>
                    </table>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-success">Set Total Marks</button>
                        <button type="button" className="btn btn-secondary ml-1" onClick={handleBack}>Back</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResultObtMarks;
