import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from '../context/UserContext';

export default function AddQuestion() {
  const [standard, setStandard] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [qType, setQType] = useState('');
  const [question, setQuestion] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [opt4, setOpt4] = useState('');
  const [standards, setStandards] = useState([]);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const navigate = useNavigate();
  const { token } = useContext(userContext);

  axios.defaults.withCredentials = true;

  // Static subjects list
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

  // Fetch standards from API
  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/classes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStandards(response.data);
      } catch (err) {
        console.error("Error fetching standards:", err);
      }
    };
    fetchStandards();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const questionData = {
        q_standard: standard,
        subject,
        chapter,
        q_type: qType,
        question,
        ...(qType === "MCQ" && { opt1, opt2, opt3, opt4 }) // Only include options if the question type is MCQ
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/paperserver/addq`, questionData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Show success message
      setSuccessMessage("Question successfully added!");
      setTimeout(() => {
        setSuccessMessage(''); // Clear message after 3 seconds
      }, 3000);

      navigate('/dashboard/addquestion');
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard/dynamicdb');
  };

  const handleInitiatePaper = () => {
    navigate('/dashboard/addqtopaper');
  };

  const handlePDFDownload = async () => {
    navigate('/dashboard/paper');
  };

  return (
    <>
      <div className="card col-md-8 mx-auto" style={{background:"white"}}>
        <div className="card-header">
          <h2 className="text-center">Add New Question</h2>
        </div>
        <div className="card-body">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <label><b>Standard</b></label>
                <select
                  className="form-control"
                  required
                  onChange={(e) => setStandard(e.target.value)}
                  value={standard}
                >
                  <option value="">Select Standard...</option>
                  {standards.map((std) => (
                    <option key={std.sid} value={std.sid}>
                      {std.standard}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label><b>Subject</b></label>
                <select
                  className="form-control"
                  required
                  onChange={(e) => setSubject(e.target.value)}
                  value={subject}
                >
                  <option value="">Select Subject...</option>
                  {subjectsList.map((sub, index) => (
                    <option key={index} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label><b>Chapter</b></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Chapter..."
                  onChange={(e) => setChapter(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label><b>Question Type</b></label>
                <select
                  className="form-control"
                  required
                  onChange={(e) => setQType(e.target.value)}
                  value={qType}
                >
                  <option value="">Select Question Type...</option>
                  <option value="Long">Long</option>
                  <option value="Short">Short</option>
                  <option value="Fill in Blanks">Fill in Blanks</option>
                  <option value="True/False">True / False</option>
                  <option value="MCQ">MCQs</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label><b>Question</b></label>
                <textarea
                  className="form-control"
                  placeholder="Enter your question here..."
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Option fields will only show when MCQ is selected */}
            {qType === "MCQ" && (
              <>
                <div className="row">
                  <div className="col-md-6">
                    <label><b>Option 1</b></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option 1..."
                      onChange={(e) => setOpt1(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label><b>Option 2</b></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option 2..."
                      onChange={(e) => setOpt2(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label><b>Option 3</b></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option 3..."
                      onChange={(e) => setOpt3(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label><b>Option 4</b></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option 4..."
                      onChange={(e) => setOpt4(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="mt-3">
              <button type="submit" className="btn btn-primary">Add Question</button>
              <button type="button" className="btn btn-secondary ml-1" onClick={handleBack}>Back</button>
              <button type="button" className="btn btn-info ml-1" onClick={handleInitiatePaper}>Initiate Paper</button>
              <button className="btn btn-success ml-1" onClick={handlePDFDownload}>Download Paper</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
