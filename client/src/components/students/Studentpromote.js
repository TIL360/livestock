import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/UserContext';
import { useNavigate } from "react-router-dom";

export default function StudentPromote() {
    const navigate = useNavigate();
    const { token } = useContext(userContext);
    const [students, setStudents] = useState([]);
    const [standards, setStandards] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedStandard, setSelectedStandard] = useState('');
    const [selectedStudents, setSelectedStudents] = useState(new Set());

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/students`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        const fetchStandards = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStandards(response.data);
            } catch (error) {
                console.error("Error fetching standards:", error);
            }
        };

        fetchStudents();
        fetchStandards();
    }, [token]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredStudents = students.filter((student) =>
        student.adm_no.toString().includes(search) ||
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.standard.toLowerCase().includes(search.toLowerCase())
    );

    const handleCheckboxChange = (adm_no) => {
        setSelectedStudents((prev) => {
            const updatedSelection = new Set(prev);
            if (updatedSelection.has(adm_no)) {
                updatedSelection.delete(adm_no);
            } else {
                updatedSelection.add(adm_no);
            }
            return updatedSelection;
        });
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            filteredStudents.forEach(student => selectedStudents.add(student.adm_no));
        } else {
            filteredStudents.forEach(student => selectedStudents.delete(student.adm_no));
        }
        setSelectedStudents(new Set(selectedStudents)); // Update state to trigger re-render
    };

    const handleUpdate = async () => {
        if (!selectedStandard) {
            alert('Please select a standard to update.');
            return;
        }

        const updates = Array.from(selectedStudents).map(adm_no => ({ adm_no, standard: selectedStandard }));

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/promote/update`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data.message);
            navigate('/dashboard/studentlist');
        } catch (error) {
            console.error("Error updating students:", error);
            alert('Error updating students');
        }
    };

    const handleUpdateInactive = async () => {
        const updates = Array.from(selectedStudents).map(adm_no => ({ adm_no, standard: selectedStandard }));

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/promote/inactive`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data.message);
            navigate('/dashboard/studentlist');
        } catch (error) {
            console.error("Error updating students:", error);
            alert('Error updating students');
        }
    };

    return (
        <div className='container' style={{ background: "white" }}>
            <h2 className='text-center'>Promote / Demote / Inactive Students</h2>
            <div className='row'>
                <div className='col-md-1'>
                    <label style={{fontWeight:"bolder"}}><button className='btn btn-secondary'>Class</button></label>
                </div>
                <div className='col-md-2'>
                    <select className='form-control mx-2 shadow p-2 rounded-pill border-3 border-info' value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)}>
                        <option value="">Select Standard</option>
                        {standards.map(standard => (
                            <option key={standard.sid} value={standard.standard}>{standard.standard}</option>
                        ))}
                    </select>
                </div>
                <div className='col-md-4'>
                    <input
                        type="text"
                        className='form-control mx-2 shadow p-2 rounded-pill border-3 border-info'
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search by Adm No, Name, or Standard"
                    />
                </div>
            </div>
            <div className='mt-3 mb-3'>

            <button className='btn btn-primary' onClick={handleUpdate}>Shift Students</button>
            <button className='btn btn-warning ml-1' onClick={handleUpdateInactive}>Set Students Inactive</button>
            </div>
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={filteredStudents.length > 0 && filteredStudents.every(student => selectedStudents.has(student.adm_no))}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                        </th>
                        <th>Adm No</th>
                        <th>Name</th>
                        <th>Standard</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudents.map((student) => (
                        <tr key={student.adm_no}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedStudents.has(student.adm_no)}
                                    onChange={() => handleCheckboxChange(student.adm_no)}
                                />
                            </td>
                            <td>{student.adm_no}</td>
                            <td>{student.name}</td>
                            <td>{student.standard}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
