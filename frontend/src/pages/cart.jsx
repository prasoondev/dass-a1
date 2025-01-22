import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'universal-cookie';
function Cart() {
  const CART_URL = 'http://localhost:3000/cart';
  const cookies = new Cookies();
  let navigate = useNavigate();
  const uid = cookies.get('userId');
  const token = cookies.get('token');
  const [itemDetails, setItemDetails] = useState([]);
  const [reload, setReload] = useState(false);
  const [cost, setCost] = useState(0);
  useEffect(() => {
    const refresh = () => {
    const configuration = {
      method: "get",
      url: CART_URL,
      headers: {
        'Content-Type': 'application/json',
        'id': uid,
        'token': token,
      },
    };

    axios(configuration)
      .then((response) => {
        // console.log(response.data);
        setItemDetails(response.data);
        const cost = response.data.reduce((acc, item) => acc + item.price, 0);
        setCost(cost);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
    };
    refresh();
  }, [uid, reload]);

  const handleRemove = (itemId) => {
    const configuration = {
      method: "patch",
      url: CART_URL,
      headers: {
        'Content-Type': 'application/json',
        'id': uid,
        'item': itemId,
        'token': token,
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
  const handleViewDetails = (itemId) => {
    navigate(`/items/${itemId}`);
  };
  const handleCheckout = () => {
    const configuration = {
      method: "post",
      url: CART_URL,
      headers: {
        'Content-Type': 'application/json',
        'id': uid,
        'token': token,
      },
    };
    axios(configuration)
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      }
    );
  };
  return (
      <div>
        <h1>Cart</h1>
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
                onClick={() => handleViewDetails(item.itemId)}
              >
                View Details
              </button>
              <button 
                style={{
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
                onClick={() => handleRemove(item.itemId)}
              >
                Remove item
              </button>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
      <p><strong>Total Cost:</strong>{cost}</p>
      <button 
        style={{
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
        onClick={() => handleCheckout()}
      >
        Checkout
      </button>
      </div>
    )
  }
  
  export default Cart