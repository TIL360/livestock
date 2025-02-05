import React, { useState, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";

export default function FeeCollection() {
  const { token } = useContext(userContext);
  const [feedetail, setFeeDetail] = useState({
    fee_adm_no: "",
    idf: "",
    feestandard: "",
    monthly_fee: "",
    collection: "",
    total_fee: "",
    fine_fee: "",
  });
  const [idf, setIdf] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fee/${idf}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched student data:", response.data);
      if (response.data.success && response.data.data.length > 0) {
        setFeeDetail(response.data.data[0]);
        setDataFetched(true);
      } else {
        alert("No data found for the given admission number.");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      alert("Error fetching the student data.");
    }
  };

  return (
    <>
      <div style={{ background: "white" }}>
        <div className="row mt-2">
          <div className="col-md-2 ml-2">
            <label><b>Search by Adm No</b></label>
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by adm number"
              value={idf}
              onChange={(e) => setIdf(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>
        </div>

        <hr />
        {dataFetched && (
          <div className="row mt-3">
            <div className="col-md-12">
              <h4>Fee Details</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Adm No</th>
                    <th>F Year</th>
                    <th>Monthly Fee</th>
                    <th>Exam Fee</th>
                    <th>Total Fee</th>
                    <th>Collection</th>
                    <th>Balance</th>
                    <th>Fine Fee</th>
                    <th>Fine Collection</th>
                    <th>Fine Balance</th>
                    <th>Fine Arrears</th>
                    <th>Adm Fee</th>
                    <th>Adm Collection</th>
                    <th>Adm Balance</th>
                    <th>Adm Arrears</th>
                    <th>Sec</th>
                    <th>Lab Fee</th>
                    <th>Misc Fee</th>
                    <th>Misc Collection</th>
                    <th>Misc Balance</th>
                    <th>Misc Arrears</th>
                    <th>Total Collection</th>
                    <th>Total Arrears</th>
                    <th>Total Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{feedetail.fee_adm_no}</td>
                    <td>{feedetail.fyear}</td>
                    <td>{feedetail.monthly_fee}</td>
                    <td>{feedetail.exam_fee}</td>
                    <td>{feedetail.total_fee}</td>
                    <td>{feedetail.collection}</td>
                    <td>{feedetail.balance}</td>
                    <td>{feedetail.fine_fee}</td>
                    <td>{feedetail.fine_collection}</td>
                    <td>{feedetail.fine_balance}</td>
                    <td>{feedetail.fine_arrears}</td>
                    <td>{feedetail.adm_fee}</td>
                   
                  </tr>
                </tbody>
                {/* 2nd row */}
                <thead>
                  <tr>
                   
                    <th>Adm Collection</th>
                    <th>Adm Balance</th>
                    <th>Adm Arrears</th>
                    <th>Sec</th>
                    <th>Lab Fee</th>
                    <th>Misc Fee</th>
                    <th>Misc Collection</th>
                    <th>Misc Balance</th>
                    <th>Misc Arrears</th>
                    <th>Total Collection</th>
                    <th>Total Arrears</th>
                    <th>Total Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                   
                    <td>{feedetail.adm_collection}</td>
                    <td>{feedetail.adm_balance}</td>
                    <td>{feedetail.adm_arrears}</td>
                    <td>{feedetail.sec}</td>
                    <td>{feedetail.lab_fee}</td>
                    <td>{feedetail.misc_fee}</td>
                    <td>{feedetail.misc_collection}</td>
                    <td>{feedetail.misc_balance}</td>
                    <td>{feedetail.misc_arrears}</td>
                    <td>{feedetail.total_collection}</td>
                    <td>{feedetail.total_arrears}</td>
                    <td>{feedetail.total_balance}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}