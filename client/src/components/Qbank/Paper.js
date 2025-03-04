import React, { useState, useEffect, useContext } from 'react'; 
import axios from 'axios'; 
import userContext from '../context/UserContext'; 
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from '@react-pdf/renderer';
import PaperPdf from './PaperPdf'; // Import the new PDF component

export default function Paper() { 
    const navigate = useNavigate(); 
    const [standard, setStandard] = useState(''); 
    const [subject, setSubject] = useState(''); 
    const [selectedYear, setSelectedYear] = useState(''); 
    const [selectedExam, setSelectedExam] = useState(''); 
    const [years, setYears] = useState([]); 
    const [examMonths, setExamMonths] = useState([]); 
    const [standards, setStandards] = useState([]); 
    const [subjects, setSubjects] = useState([]); 
    const [objectiveQuestions, setObjectiveQuestions] = useState([]); 
    const [subjectiveQuestions, setSubjectiveQuestions] = useState([]); 
    const { token } = useContext(userContext);

    // Fetch exam years
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/paperserver/examyear`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setYears(response.data);
            } catch (error) {
                console.error("Error fetching years:", error);
            }
        };

        fetchYears();
    }, [token]);

    // Fetch standards
    useEffect(() => {
        const fetchStandards = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/paperserver/standards`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setStandards(response.data);
            } catch (error) {
                console.error("Error fetching standards:", error);
            }
        };

        fetchStandards();
    }, [token]);

    // Fetch subjects based on selected standard
    useEffect(() => {
        const fetchSubjects = async () => {
            if (standard) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/paperserver/subjects`, {
                        params: { standard },
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    setSubjects(response.data);
                } catch (error) {
                    console.error("Error fetching subjects:", error);
                }
            } else {
                setSubjects([]);
            }
        };

        fetchSubjects();
    }, [standard, token]);

    // Fetch exam months
    useEffect(() => {
        const fetchExamMonths = async () => {
            if (selectedYear) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/paperserver/exam`, {
                        params: { year: selectedYear },
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    setExamMonths(response.data);
                } catch (error) {
                    console.error("Error fetching exam months:", error);
                }
            } else {
                setExamMonths([]);
            }
        };

        fetchExamMonths();
    }, [selectedYear, token]);

    // Fetch questions based on selected criteria
    useEffect(() => {
        const fetchQuestions = async () => {
            if (standard && subject && selectedYear && selectedExam) {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/paperserver/questionpaper`, {
                        params: { standard, subject, exam: selectedExam, examYear: selectedYear },
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    setObjectiveQuestions(response.data.filter(q => q.q_type !== 'Long'));
                    setSubjectiveQuestions(response.data.filter(q => q.q_type === 'Long'));
                } catch (error) {
                    console.error("Error fetching questions:", error);
                }
            }
        };

        fetchQuestions();
    }, [standard, subject, selectedYear, selectedExam, token]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with: ", { standard, subject, selectedYear, selectedExam });
    };

    const handleBack = () => {
        navigate('/dashboard/addquestion');
    };

    // Group objective questions by type
    const groupedObjectiveQuestions = objectiveQuestions.reduce((acc, question) => {
        const { q_type } = question; // Assuming q_type is the type of question
        if (!acc[q_type]) {
            acc[q_type] = [];
        }
        acc[q_type].push(question);
        return acc;
    }, {});

    const handleDelete = async (paperId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this question?");
        if (confirmDelete) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/paperserver/deleteQuestion/${paperId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                // Optionally, refresh the questions after deletion
                // fetchQuestions(); // You may want to call this to refresh the questions list
                alert('Question deleted successfully');
            } catch (error) {
                console.error("Error deleting question:", error);
                alert('Failed to delete question');
            }
        }
    };
    
    return (
        <div className="container" style={{background:"white"}}>
            <h2 className="text-center">Paper Structure</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-2">
                        <label><b>Standard</b></label>
                        <select className="form-control" onChange={(e) => setStandard(e.target.value)} value={standard}>
                            <option value="">Select Standard</option>
                            {standards.map((std, index) => (
                                <option key={index} value={std.sid}>{std.standard}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label><b>Subject</b></label>
                        <select className="form-control" onChange={(e) => setSubject(e.target.value)} value={subject}>
                            <option value="">Select Subject</option>
                            {subjects.map((sub, index) => (
                                <option key={index} value={sub.subject}>{sub.subject}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label><b>Exam Year</b></label>
                        <select className="form-control" onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
                            <option value="">Select Exam Year</option>
                            {years.map((year, index) => (
                                <option key={index} value={year.examyear}>{year.examyear}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label><b>Exam Month</b></label>
                        <select className="form-control" onChange={(e) => setSelectedExam(e.target.value)} value={selectedExam}>
                            <option value="">Select Exam Month</option>
                            {examMonths.map((month, index) => (
                                <option key={index} value={month.exam}>{month.exam}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                    <PDFDownloadLink 
  document={
    <PaperPdf 
      objectiveQuestions={objectiveQuestions} 
      subjectiveQuestions={subjectiveQuestions} 
      selectedYear={selectedYear} 
      selectedExam={selectedExam} 
    />} 
  fileName="paper_structure.pdf"
>
  <button type="button" className="btn btn-warning mt-4 ml-1">Download PDF</button>
</PDFDownloadLink>

                    </div>
                </div>

                {/* Display Objective Questions Grouped by Type */}
                <div className="mt-3">
                    <h4 className='text-center'>Objective Questions</h4>
                    {Object.keys(groupedObjectiveQuestions).map((type, typeIndex) => (
                        <div key={type}>
                            <h5>{`${typeIndex + 1}. ${type} Questions`}</h5> {/* Automatic numbering */}
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colSpan={3}></th>
                                    </tr>
                                </thead>
                                <tbody className='pl-2'>
                                    {groupedObjectiveQuestions[type].map((question, index) => (
                                        <tr key={question.qid}>
                                            <td width={10}>{String.fromCharCode(97 + index)}</td> {/* Change numbering to letters (a, b, c, ...) */}
                                            <td width={600}>{question.question}</td>
                                            <td width={20}>{question.q_marks}</td>
                                        <td>
                                <button onClick={() => handleDelete(question.paper_id)} className="btn btn-danger btn-sm">Delete</button>
                            </td>
                                        </tr>
                                    ))}
                                    {/* Display options for each question */}
                                    {groupedObjectiveQuestions[type].map((question, index) => (
                                        <tr key={`options-${question.qid}`}>
                                        <td colSpan={3}>
                                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                {question.opt1 && (
                                                    <li style={{ marginBottom: '10px' }}>
                                                        <span className='ml-11'>{`i. ${question.opt1}`}</span>
                                                        <span className='ml-20'>{`ii. ${question.opt2}`}</span>
                                                        <span className='ml-20'>{`iii. ${question.opt3}`}</span>
                                                        <span className='ml-20'>{`iv. ${question.opt4}`}</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                    
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}

                    {/* Subjective Questions */}
                    <h4 className='text-center'>Subjective Questions</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th colSpan={3}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjectiveQuestions.length > 0 ? (
                                subjectiveQuestions.map((question, index) => (
                                    <tr key={question.qid}>
                                        <td width={10}>{index + 1}</td> {/* Numeric numbering for subjective questions */}
                                        <td width={600}>{question.question}</td>
                                        <td width={20}>{question.q_marks}</td>
                                        <td>
                                <button onClick={() => handleDelete(question.paper_id)} className="btn btn-danger btn-sm">Delete</button>
                            </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No subjective questions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-3">
                    <button type="submit" className="btn btn-primary">Submit Paper</button>
                    <button type="button" className="btn btn-secondary ml-1" onClick={handleBack}>Back</button>
                </div>

            </form>
        </div>
    );
}
