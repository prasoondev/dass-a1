import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'universal-cookie';

function Review() {
  const { userId } = useParams(); 
  const REVIEW_URL=`http://localhost:3000/review`;
  let navigate = useNavigate();
  const cookies = new Cookies();
  const uid = cookies.get('userId');
  const [user, setUser] = useState(null);
  const [reload, setReload] = useState(false);
  const [review, setReview] = useState("");

  useEffect(() => {
    const refresh =() =>{
    const configuration = {
      method: "get",
      url: REVIEW_URL,
      headers: {
        'Content-Type': 'application/json',
        'user': userId,
        'id': uid,
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
    };
    refresh();
  }, [userId, reload]);

  const addReview = () => {
    const configuration = {
      method: "post",
      url: REVIEW_URL,
      headers: {
        'Content-Type': 'application/json',
        'user': userId,
        'review': review,
      },
    };
    axios(configuration)
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Reviews</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.fname} {user.lname}</p>
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
              <input type="text" name='review' value={review} onChange={(e) => setReview(e.target.value)}/>
              <button onClick={addReview}>Leave a review</button>
        </div>
      ) : (
        <div>
              <input type="text" name='review' value={review} onChange={(e) => setReview(e.target.value)}/>
              <button onClick={addReview}>Leave a review</button>
              </div>
      )}
    </div>
  );
}

export default Review;
