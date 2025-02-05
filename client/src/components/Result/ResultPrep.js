import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";

const ResultPrep = () => {
  const { token } = useContext(userContext);
  const navigate = useNavigate();
  // State variables for year, month, standard, and their options
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [standard, setStandard] = useState("");
  const [examYear, setExamYear] = useState("");
  const [examName, setExamName] = useState(""); // Ensure you have this state variable
  const [TMS1, setTMS1] = useState("");
  const [TMS2, setTMS2] = useState("");
  const [TMS3, setTMS3] = useState("");
  const [TMS4, setTMS4] = useState("");
  const [TMS5, setTMS5] = useState("");
  const [TMS6, setTMS6] = useState("");
  const [TMS7, setTMS7] = useState("");
  const [TMS8, setTMS8] = useState("");
  
  const [yearOptions, setYearOptions] = useState([]);
  const [monthOptions, setMonthOptions] = useState([]);
  const [standardOptions, setStandardOptions] = useState([]);

  const handleYearChange = (e) => setYear(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleStandardChange = (e) => setStandard(e.target.value);
  const handleExamYearChange = (e) => setExamYear(e.target.value);
  const handleExamNameChange = (e) => setExamName(e.target.value); // Correctly manage exam name

  const handleTMS1Change = (e) => setTMS1(e.target.value);
  const handleTMS2Change = (e) => setTMS2(e.target.value);
  const handleTMS3Change = (e) => setTMS3(e.target.value);
  const handleTMS4Change = (e) => setTMS4(e.target.value);
  const handleTMS5Change = (e) => setTMS5(e.target.value);
  const handleTMS6Change = (e) => setTMS6(e.target.value);
  const handleTMS7Change = (e) => setTMS7(e.target.value);
  const handleTMS8Change = (e) => setTMS8(e.target.value);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/resultprep/selectboxes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.years) {
          setYearOptions(response.data.years.map((option) => option.year));
        }
        if (response.data.months) {
          setMonthOptions(response.data.months.map((option) => option.month)); 
        }
        
        if (response.data.standards) {
          setStandardOptions(
            response.data.standards.map((option) => option.result_standard)
          );
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/resultprep/result`,
        {
          year,
          month,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const message =
        response.data.success === true ? "Data saved successfully!" : "Failed to save data.";
      alert(message);
      // Reset fields after submission
      setYear("");
      setMonth("");    
    } catch (error) {
      const errorMsg = error.response ? error.response.data : error.message;
      console.error("Error submitting result:", errorMsg);
      alert("Error occurred while saving data");
    }
  };

  const handleSubmitMarks = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/resultprep/marks`,
        {
          standard,
          examYear,
          examName,
          TMS1,
          TMS2,
          TMS3,
          TMS4,
          TMS5,
          TMS6,
          TMS7,
          TMS8,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const message =
        response.data.success === true
          ? "Data updated successfully!"
          : "Failed to update data.";
      alert(message);
      // Reset fields after submission
      setStandard("");
      setExamYear("");
      setExamName("");
      setTMS1("");
      setTMS2("");
      setTMS3("");
      setTMS4("");
      setTMS5("");
      setTMS6("");
      setTMS7("");
      setTMS8("");
    } catch (error) {
      const errorMsg =
        error.response && error.response.data.error
          ? error.response.data.error
          : error.message;
      console.error("Error updating result:", errorMsg);
      alert("Error occurred while updating data: " + errorMsg);
    }
  };
const handleback = (e)=>{
  e.preventDefault();
 navigate('/dashboard/result');
}


const handlePublishResult = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/result/publish-result`,
      {
        year: examYear, // Use selected exam year
        month: examName, // Use selected exam name
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert(response.data.message);
  } catch (error) {
    const errorMsg = error.response && error.response.data.error
      ? error.response.data.error
      : error.message;
    console.error("Error publishing result:", errorMsg);
    alert("Error occurred while publishing result: " + errorMsg);
  }
};

const handlePendResult = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/result/pend-result`,
      {
        year: examYear, // Use selected exam year
        month: examName, // Use selected exam name
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert(response.data.message);
  } catch (error) {
    const errorMsg = error.response && error.response.data.error
      ? error.response.data.error
      : error.message;
    console.error("Error pending result:", errorMsg);
    alert("Error occurred while pending result: " + errorMsg);
  }
};



  return (
    <>
    <div style={{background:"white"}}>
      <div>
        <h1 className="text-center">
          <u>EXAMINATION</u>
        </h1>
        <hr />
      </div>
      <div className="row mb-5 align-items-center text-center">
        <div className="col-md-3">
          <h4 className="text-center text-primary">Prepare New Examination</h4>
        </div>
        <form onSubmit={handleSubmit} className="col-md-6">
          {/* Year and Month Input */}
          <div className="row">
            <div className="col-md-5">
              <input
                type="text"
                value={year}
                className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
                name="year"
                onChange={handleYearChange}
                placeholder="Year here..."
                required
                autoComplete="off"
              />
            </div>
            <div className="col-md-5">
              <input
                type="text"
                value={month}
                className="form-control mx-2 shadow p-2 rounded-pill border-3 border-info"
                name="month"
                onChange={handleMonthChange}
                placeholder="Month here..."
                required
                autoComplete="off"
              />
            </div>
            <div className="col-md-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm mb-1 shadow p-3 rounded-pill col"
              >
                <strong>New Exam</strong>
              </button>
            </div>
          </div>
        </form>
        <hr />
        <div className="row ">
          <div className="col-md-12 border-4">
            <h2>Assign Total Marks</h2>
            <form onSubmit={handleSubmitMarks}>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label>Standard</label>
                  <select
                    value={standard}
                    onChange={handleStandardChange}
                    className="form-control"
                  >
                    <option>Select Standard</option>
                    {standardOptions.map((standardOption, index) => (
                      <option key={index} value={standardOption}>
                        {standardOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label>Year</label>
                  <select
                    value={examYear}
                    onChange={handleExamYearChange}
                    className="form-control"
                  >
                    <option>Select Year</option>
                    {yearOptions.map((yearOption, index) => (
                      <option key={index} value={yearOption}>
                        {yearOption}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  {" "}
                  {/* Fixed positioning of this div */}
                  <label>Exam</label>
                  <select
                    value={examName}
                    onChange={handleExamNameChange}
                    className="form-control"
                  >
                    <option>Select Exam</option>
                    {monthOptions.map((monthOption, index) => (
                      <option key={index} value={monthOption}>
                        {monthOption}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <table className="table">
                <tbody>
                  <tr>
                    <td>
                      <label>English (TMS1)</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={TMS1}
                        onChange={handleTMS1Change}
                        className="form-control"
                        autoComplete="off"
                      />
                    </td>
                    <td>
                      <label>Urdu (TMS2)</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={TMS2}
                        onChange={handleTMS2Change}
                        className="form-control"
                        autoComplete="off"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Mathematics (TMS3)</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={TMS3}
                        onChange={handleTMS3Change}
                        className="form-control"
                        autoComplete="off"
                      />
                    </td>
                    <td>
                      <label>Islamiat (TMS4)</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={TMS4}
                        onChange={handleTMS4Change}
                        className="form-control"
                        autoComplete="off"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Pak Study (TMS5)</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={TMS5}
                        onChange={handleTMS5Change}
                        className="form-control"
                        autoComplete="off"
                      />
                    </td>
                    <td>
                      <label>Bio / Comp (TMS6)</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={TMS6}
                        onChange={handleTMS6Change}
                        className="form-control"
                        autoComplete="off"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label>Physics (TMS7)</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={TMS7}
                        onChange={handleTMS7Change}
                        className="form-control"
                        autoComplete="off"
                      />
                    </td>
                    <td>
                      <label>Chemistry (TMS8)</label>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={TMS8}
                        onChange={handleTMS8Change}
                        className="form-control"
                        autoComplete="off"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="card-footer">
                <button type="submit" className="btn btn-success">
                  Set Total Marks
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ml-1"
                  onClick={handleback}
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <h3 className="text-center">Publish / Pend Result</h3>
        <br />

        <form onSubmit={handleSubmit} className="col-md-12">
          <div className="row col-md-12">
            
            <div className="col-md-3">
              <select
                value={examYear}
                onChange={handleExamYearChange}
                className="form-control"
              >
                <option>Select Year</option>
                {yearOptions.map((yearOption, index) => (
                  <option key={index} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              {" "}
              {/* Fixed positioning of this div */}
              <select
                value={examName}
                onChange={handleExamNameChange}
                className="form-control"
              >
                <option>Select Exam</option>
                {monthOptions.map((monthOption, index) => (
                  <option key={index} value={monthOption}>
                    {monthOption}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
  <button className="btn btn-primary" onClick={handlePublishResult}>
    Publish Result
  </button>
</div>

<div className="col-md-3">
  <button className="btn btn-danger" onClick={handlePendResult}>
    Pend Result
  </button>
</div>

          </div>
        </form>

<hr/>
      </div>
      </div>
    </>
  );
};

export default ResultPrep;
