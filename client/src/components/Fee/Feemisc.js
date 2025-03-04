import React, { useState, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Feemisc() {
    const navigate = useNavigate();
    const { token, standards } = useContext(userContext);
    const [selectedStandard, setSelectedStandard] = useState('');
    const [examFee, setExamFee] = useState('');
    const [miscFee, setMiscFee] = useState('');
    const [remarks, setRemarks] = useState('');

    const handleStandardChange = (e) => {
        setSelectedStandard(e.target.value);
    };

    const handleAddExamFee = async () => {
        if (!selectedStandard || !examFee) {
            alert("Please select a standard and enter an exam fee.");
            return;
        }

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/unpaid/examfee`, {
                standard: selectedStandard,
                examFee: examFee
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message);
            setExamFee('');
        } catch (error) {
            console.error("Error adding exam fee:", error);
            alert("Failed to add exam fee.");
        }
    };

    const handleAddMiscFee = async () => {
        if (!selectedStandard || !miscFee || !remarks) {
            alert("Please select a standard, enter a miscellaneous fee, and add remarks.");
            return;
        }

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/unpaid/miscfee`, {
                standard: selectedStandard,
                miscFee: miscFee,
                remarks: remarks
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message);
            setMiscFee('');
            setRemarks('');
        } catch (error) {
            console.error("Error adding miscellaneous fee:", error);
            alert("Failed to add miscellaneous fee.");
        }
    };
    const handleback = () => {
        navigate("/dashboard/feedetail");
      };

    return (
        <div style={{ background: 'white' }}>
            <div className='container'>
                <h2 className='text-center'>Add Other Fee In Invoices</h2>
            </div>
            <br />
            <div className='row'>
            <div className='container col-md-6'>
                <select value={selectedStandard} onChange={handleStandardChange} className="mx-2 shadow p-2 rounded-pill border-3 border-info col-md-6">
                    <option value="">Select Standard</option>
                    {standards.map((standard) => (
                        <option key={standard.sid} value={standard.standard}>Class: {standard.standard}</option>
                    ))}
                </select>
            </div>
                <div className='col-md-1'>
                    <button className='btn btn-secondary' onClick={handleback}>Back</button>
                </div>
            </div>
            <br />
            <div className='row'>
                <div className='col-md-2'>
                    <input className='form-control mx-2 shadow p-2 rounded-pill border-3 border-info' type='text' placeholder='Add exam fee here...' value={examFee} onChange={(e) => setExamFee(e.target.value)} />
                </div>
                <div className='col-md-2'>
                    <button className='btn btn-primary' onClick={handleAddExamFee}>Add Exam Fee</button>
                </div>
                <div className='col-md-3'>
                    <input className='form-control mx-2 shadow p-2 rounded-pill border-3 border-info' type='text' placeholder='Add misc fee here...' value={miscFee} onChange={(e) => setMiscFee(e.target.value)} />
                </div>
                <div className='col-md-3'>
                    <input className='form-control mx-2 shadow p-2 rounded-pill border-3 border-info' type='text' placeholder='Add remarks...' value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                </div>
                <div className='col-md-2'>
                    <button className='btn btn-warning' onClick={handleAddMiscFee}>Add Misc Fee</button>
                </div>
            </div>
        </div>
    )
}
