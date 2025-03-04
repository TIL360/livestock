import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from '../context/UserContext';

export default function Addqtopaper() {
    const [standard, setStandard] = useState('');
    const [subject, setSubject] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [chapterSearch, setChapterSearch] = useState('');
    const [questions, setQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [standards, setStandards] = useState([]);
    const [years, setYears] = useState([]);
    const [examMonths, setExamMonths] = useState([]);
    const [marks, setMarks] = useState({});
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');

    const { token } = useContext(userContext);

    axios.defaults.withCredentials = true;


    const subjectsList = [
        "English",
        "Maths",
        "Urdu",
        "Islamiat",
        "Pak Study",
        "S.Study",
        "Home Economics",
        "Chemistry",
        "Biology",
        "Computer",
        "Arabic"
    ];

    useEffect(() => {
        const fetchStandards = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setStandards(response.data);
            } catch (err) {
                console.error("Error fetching standards:", err);
            }
        };
        fetchStandards();
    }, [token]);

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/resultprep/year`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                console.log(response.data);
                setYears(response.data.map(option => option.year));
            } catch (err) {
                console.error("Error fetching years:", err);
            }
        };
        
        fetchYears();
    }, [token]);

    useEffect(() => {
        const fetchExamMonths = async () => {
            if (selectedYear) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/resultprep/exam`, {
                        params: { year: selectedYear },
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    setExamMonths(response.data.map(option => option.month));
                } catch (err) {
                    console.error("Error fetching exam months:", err);
                }
            } else {
                setExamMonths([]);
            }
        };
    
        fetchExamMonths();
    }, [selectedYear, token]);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (standard && subject) {
                console.log("Fetching questions for standard:", standard, "and subject:", subject);
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/paperserver/questions`, {
                        params: { standard, subject },
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    console.log("Fetched questions:", response.data);
                    setQuestions(response.data);
                } catch (err) {
                    console.error("Error fetching questions:", err);
                }
            } else {
                setQuestions([]); 
            }
        };
        
        fetchQuestions();
    }, [standard, subject, token]);

    const handleSelectQuestion = (qid) => {
        setSelectedQuestions((prev) => {
            if (prev.includes(qid)) {
                return prev.filter(id => id !== qid);
            } else {
                return [...prev, qid];
            }
        });
    };

    const handleAddToPaper = async () => {
        // Filter selected questions to only include those with assigned marks
        const requests = selectedQuestions
            .filter(qid => marks[qid] > 0) // Only include questions with marks greater than 0
            .map(qid => ({
                standard: standard,
                q_id: qid,
                marks: marks[qid],
                exam: selectedExam,
                examYear: selectedYear
            }));
    
        if (requests.length === 0) {
            alert('Please assign marks for the selected questions before adding them to the paper.');
            return;
        }
    
        try {
            for (const request of requests) {
                await axios.post(`${process.env.REACT_APP_API_URL}/paperserver/addqtopaper`, request, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
    
            // Show success message instead of navigating away
            setSuccessMessage('Questions added to paper successfully!');
        } catch (err) {
            console.error("Error adding questions to paper:", err);
        }
    };
    
    
    const handleBack = () => {
        navigate('/dashboard/addquestion');
    };

    return (
        <div className="container" style={{background:"white"}}>
            <h2 className="text-center">Select & Add Questions to the Required Paper</h2>
            {successMessage && (
            <div className="alert alert-success" role="alert">
                {successMessage}
            </div>
        )}
            <div className="row">
                <div className="col-md-3">
                    <label><b>Standard</b></label>
                    <select className="form-control" onChange={(e) => setStandard(e.target.value)} value={standard}>
                        <option value="">Select Standard</option>
                        {standards.map(std => (
                            <option key={std.sid} value={std.sid}>{std.standard}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label><b>Subject</b></label>
                    <select className="form-control" onChange={(e) => setSubject(e.target.value)} value={subject} disabled={!standard}>
                        <option value="">Select Subject</option>
                        {subjectsList.map((sub, index) => (
                            <option key={index} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label><b>Exam Year</b></label>
                    <select className="form-control" onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
                        <option value="">Select Exam Year</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label><b>Exam Month</b></label>
                    <select className="form-control" onChange={(e) => setSelectedExam(e.target.value)} value={selectedExam} disabled={!selectedYear}>
                        <option value="">Select Exam Month</option>
                        {examMonths.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-12">
                    <label><b>Search by Chapter</b></label>
                    <input type="text" className="form-control" placeholder="Search by Chapter..." onChange={(e) => setChapterSearch(e.target.value)} />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-12">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Q ID</th>
                                <th>Unit</th>
                                <th>Type</th>
                                <th>Question</th>
                                <th>Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.filter(q => chapterSearch === '' || q.chapter.toLowerCase().includes(chapterSearch.toLowerCase())).map(question => (
                                <tr key={question.qid}>
                                    <td>
                                        <input type="checkbox" onChange={() => handleSelectQuestion(question.qid)} checked={selectedQuestions.includes(question.qid)} />
                                    </td>
                                    <td>{question.qid}</td>
                                    <td>{question.chapter}</td>
                                    <td>{question.q_type}</td>
                                    <td>{question.question}</td>
                                    <td >
                                        <input
                                            className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
                                            type="number" 
                                            required
                                            value={marks[question.qid] || ''}
                                            onChange={(e) => setMarks((prevMarks) => ({ ...prevMarks, [question.qid]: e.target.value }))}
                                            disabled={!selectedQuestions.includes(question.qid)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-3">
                <button className="btn btn-success" onClick={handleAddToPaper} disabled={selectedQuestions.length === 0}> Add Selected Questions to Paper </button>
                <button type="button" className="btn btn-secondary ml-1" onClick={handleBack}>Back</button>
                
            </div>
        </div>
    );
}
