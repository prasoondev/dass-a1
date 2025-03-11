import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Orders() {
  const ORDERS_URL = "http://localhost:3000/orders";
  const cookies = new Cookies();
  let navigate = useNavigate();
  const uid = cookies.get("userId");
  const token = cookies.get("token");
  const [reload, setReload] = useState(false);
  const [itemDetails, setItemDetails] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get(ORDERS_URL, {
          headers: {
            "Content-Type": "application/json",
            id: uid,
            token: token,
          },
        })
        .then((response) => {
          setItemDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching items:", error);
        });
    };
    fetchOrders();
  }, [reload]);

  const handleChangeOTP = (transactionId) => {
    axios
      .put(ORDERS_URL, {}, {
        headers: {
          "Content-Type": "application/json",
          id: uid,
          transaction: transactionId,
          token: token,
        },
      })
      .then(() => setReload(!reload))
      .catch((error) => console.error("Error updating OTP:", error));
  };

  const filteredItems = itemDetails.filter((item) => {
    if (filter === "pending") return item.status === "pending";
    if (filter === "bought") return item.buyerid === uid && item.status !== "pending";
    if (filter === "sold") return item.sellerid === uid;
    return true; // Default "all" case
  });

  return (
    <div>
      <h1>Orders</h1>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["all", "pending", "bought", "sold"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              backgroundColor: filter === type ? "#007BFF" : "#f0f0f0",
              color: filter === type ? "#fff" : "#000",
              border: "1px solid #007BFF",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
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
              {item.status === "pending" && (
                <>
                  <p><strong>OTP:</strong> {item.hashedOTP}</p>
                  <button
                    style={{
                      backgroundColor: "#007BFF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleChangeOTP(item.transactionId)}
                  >
                    Regenerate OTP
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Orders;
