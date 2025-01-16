import { useState, useEffect } from "react"
import axios from 'axios';
import Cookies from 'universal-cookie';
function Profile() {
  const PROFILE_URL = 'http://localhost:3000/profile';
  const cookies = new Cookies();
  const uid = cookies.get('userId');
  const token = cookies.get('token');
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    const configuration = {
      method: "get",
      url: PROFILE_URL,
      headers: {
        'Content-Type': 'application/json',
        'userId': uid,  // Send userId in the header
        'token': token,  // Send token in the header
      },
    };
    axios(configuration)
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  }, [uid, token]);
  return (
    <div>
      <h1>Profile</h1>
      {userDetails ? (
        <>
          <p>First name: {userDetails.fname}</p>
          <p>Last name: {userDetails.lname}</p>
          <p>Age: {userDetails.age}</p>
          <p>Email: {userDetails.email}</p>
          <p>Contact: {userDetails.contact}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Profile