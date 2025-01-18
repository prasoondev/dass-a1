import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'universal-cookie';

function Deliver() {
  const DELIVERY_URL = 'http://localhost:3000/deliver';
  const cookies = new Cookies();
  const uid = cookies.get('userId');
  let navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const [itemDetails, setItemDetails] = useState([]);
  useEffect(() => {
    const refresh = () => {
      const configuration = {
        method: "get",
        url: DELIVERY_URL,
        headers: {
          'Content-Type': 'application/json',
          'id': uid,
        },
      };

      axios(configuration)
        .then((response) => {
          setItemDetails(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching items:", error);
        });
    };
    refresh();
  }, [reload]);
  const handleCompleteorder = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };
    return (
      <div>
        <h1>Pending orders</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {itemDetails.length > 0 ? (
          itemDetails.map((item) => (
            <div 
              key={item.itemId} 
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                width: "250px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3>{item.name}</h3>
              <p><strong>Price:</strong> ${item.price}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Buyer:</strong> {item.buyerid}</p>
              <button 
                style={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                onClick={() => handleCompleteorder(item.transactionId)}
              >
                Complete order
              </button>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
      </div>
    )
  }
  
  export default Deliver