import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import userContext from "../context/UserContext";

const CollectionReport = () => {
  const { token } = useContext(userContext);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/feestats/reporting`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setReportData(response.data.data || []);
        } catch (error) {
          console.error("Error fetching report data:", error);
        }
      };
      

    fetchReportData();
  }, [token]);

  return (
    <div className="card" style={{background:"white"}}>
      <div className="card-header">
        <h1 className="text-center"><b>COLLECTION REPORT IN VARIOUS HEADS</b></h1>
      </div>
      <div className="card-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Ser</th>
              <th>M / Y</th>
              <th>Fee / Get</th>
              <th>Fine / Get</th>
              <th>Adm Fee / Get</th>
              <th>Misc Fee / Get</th>
              <th>Exam Fee / Get</th>
              <th>Total Fee / Get</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{`${item.fmonth} / ${item.fyear}`}</td>
                <td>{`${item.monthly_fee_feetbl} / ${item.total_collection}`}</td>
                <td>{`${item.fine_fee} / ${item.fine_collection}`}</td>
                <td>{`${item.adm_fee} / ${item.adm_collection}`}</td>
                <td>{`${item.misc_fee} / ${item.misc_collection}`}</td>
                <td>{`${item.exam_fee} / ${item.exam_collection}`}</td>
                <td>{`${item.total_fee} / ${item.total_collection}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionReport;
