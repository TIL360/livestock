import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userContext from "../context/UserContext";

export default function GoatDisplay() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const { token } = useContext(userContext);

  const [goats, setGoats] = useState([]);

  // Fetch goats from API (only active goats)
  useEffect(() => {
    const fetchGoats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/animals/goatsall`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoats(response.data);
      } catch (error) {
        console.error("Error fetching goats:", error);
      }
    };
    fetchGoats();
  }, [token]);

  // Chunk array into pairs for grid layout
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const goatRows = chunkArray(goats, 2);

  const handlePurchase = (id) => {
    // Implement your purchase logic or navigation here
    alert(`Purchase goat with ID: ${id}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-center">Goats Available</h1>
      {/* No search bar as per your request */}

      {/* Grid display of goats */}
      {goatRows.length === 0 ? (
        <p>No active goats available.</p>
      ) : (
        goatRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "30px"
            }}
          >
            {row.map((goat) => (
              <div
                key={goat.id}
                style={{
                  flex: 1,
                  margin: "0 10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  maxWidth: "45%",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}
              >
                {/* Image */}
                {goat.image && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${goat.image}`}
                    alt={goat.description}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                )}
                {/* Details */}
                <div style={{ marginTop: "10px" }}>
                  <p>
                    <strong>Age:</strong> {goat.age}
                  </p>

                  <p>
                    <strong>Price:</strong> {goat.sell_amount || "N/A"}
                  </p>
                </div>
                {/* Purchase Button */}
                <div style={{ marginTop: "10px", textAlign: "center" }}>
                  <button
                    onClick={() => handlePurchase(goat.id)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
