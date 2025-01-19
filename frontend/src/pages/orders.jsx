import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
function Orders() {
  const ORDERS_URL = 'http://localhost:3000/orders';
  const cookies = new Cookies();
  let navigate = useNavigate();
  const uid = cookies.get('userId');
  const [reload, setReload] = useState(false);
  const [itemDetails, setItemDetails] = useState([]);
  useEffect(() => {
    const refresh = () => {
      const configuration = {
        method: "get",
        url: ORDERS_URL,
        headers: {
          'Content-Type': 'application/json',
          'id': uid,
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
  }
    , [reload]);
  return (
    <div>
      <h1>Orders</h1>
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
              <p><strong>Seller:</strong> <span onClick={() => navigate(`/review/${item.sellerid}`)}>{item.sellername}</span></p>
              <p><strong>Buyer:</strong> <span onClick={() => navigate(`/review/${item.buyerid}`)}>{item.buyername}</span></p>
              <p><strong>Status:</strong> {item.status}</p>
              {item.status == 'pending' ? (
                <p><strong>OTP:</strong> {item.hashedOTP}</p>
              ) : (
                <p></p>
              )}
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  )
}

export default Orders