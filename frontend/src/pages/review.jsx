import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'universal-cookie';

function Review() {
  const { itemId } = useParams(); 
  const REVIEW_URL=`http://localhost:3000/review`;
  let navigate = useNavigate();
  const cookies = new Cookies();
  const uid = cookies.get('userId');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: REVIEW_URL,
      headers: {
        'Content-Type': 'application/json',
        'user': uid,
      },
    };
    axios(configuration)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        navigate('/search');
      });
  }, [itemId]);

  const addtoCart = () => {
    const configuration = {
      method: "post",
      url: ITEM_URL,
      headers: {
        'Content-Type': 'application/json',
        'userId': uid,
        'item': itemId,
      },
    };
    axios(configuration)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  return (
    <div>
      {item ? (
        <div>
          <h1><strong>Name:</strong> {user.fname} {user.lname}</h1>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Contact:</strong> {user.contact}</p>
          {user.reviews.length>0 ? (
            user.reviews.map((review) => (
                <div
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "16px",
                    width: "250px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  >
                    <p>{review}</p>
                </div>
            ))
          ):(
            <p></p>
          )}
          {/* <button onClick={addtoCart}>Add to Cart</button> */}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default Review;
