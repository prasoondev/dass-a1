import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'universal-cookie';

function Buy() {
  const BUY_URL = 'http://localhost:3000/buy';
  const cookies = new Cookies();
  const uid = cookies.get('userId');
  const token = cookies.get('token');
  let navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    const refresh = () => {
    const configuration = {
      method: "get",
      url: BUY_URL,
      headers: {
        'Content-Type': 'application/json',
        'id': uid,  // Send userId in the header
        'token': token,  // Send token in the header
      },
    };

    axios(configuration)
      .then((response) => {
        setItemDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
    };
    refresh();
  }, [uid, token, reload]);

  const handleDelete = (itemId) => {
    const configuration = {
      method: "delete",
      url: BUY_URL,
      headers: {
        'Content-Type': 'application/json',
        'id': uid,
        'item': itemId,
        'token':token,
      },
    };
    axios(configuration)
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  return (
    <div>
      <h1>My items</h1>
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
              <button 
                style={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                onClick={() => handleDelete(item.itemId)}
              >
                Delete item
              </button>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default Buy;
