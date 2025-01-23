import { useState, useEffect } from "react"
import axios from 'axios';
import Cookies from 'universal-cookie';
function Profile() {
  const PROFILE_URL = 'http://localhost:3000/profile';
  const cookies = new Cookies();
  const uid = cookies.get('userId');
  const token = cookies.get('token');
  const [userDetails, setUserDetails] = useState(null);
  const [checkState, setEditState] = useState(false);
  const editProfile = () => {
    if(checkState) {
      setEditState(false);
      const configuration = {
        method: "put",
        url: PROFILE_URL,
        headers: {
          'Content-Type': 'application/json',
          'userId': uid,  // Send userId in the header
          'token': token,  // Send token in the header
        },
        data: userDetails,
      };
      axios(configuration)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
        alert(error.response.data.error);
        error = new Error();
          console.log(error);
          setEditState(true);
        });
    }
    else{
      setEditState(true);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
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
        console.log(response.data);
        setUserDetails(response.data);
      })
      .catch((error) => {
        alert(error.response.data.error);
        error = new Error();
        console.log(error);
      });
  }, [uid, token]);
  return (
    <div>
      <h1>Profile</h1>
      {userDetails ? (
        <>
          {checkState ? (
            <>
            <label>
              First name
              <input type="text" name='fname' value={userDetails.fname} onChange={handleInputChange}/>
            </label>
            <label>
              Last name
              <input type="text" name='lname' value={userDetails.lname} onChange={handleInputChange}/>
              </label>
              <label>
                Age
              <input type="number" name='age' value={userDetails.age} onChange={handleInputChange}/>
              </label>
              {/* <input type="text" name='email' value={userDetails.email} onChange={handleInputChange}/> */}
              <label>
                Contact
              <input type="number" name='contact' value={userDetails.contact} onChange={handleInputChange}/>
              </label>
              <button onClick={editProfile}>Save</button>
            </>
          ) : (
            <>
              <p>First name: {userDetails.fname}</p>
              <p>Last name: {userDetails.lname}</p>
              <p>Age: {userDetails.age}</p>
              <p>Email: {userDetails.email}</p>
              <p>Contact: {userDetails.contact}</p>
              <button onClick={editProfile}>Update</button>
            </>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Profile