import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'universal-cookie';

function Transaction() {
  const { transactionId } = useParams(); 
  console.log(transactionId);
  const TRANSACTION_URL=`http://localhost:3000/transaction`;
  let navigate = useNavigate();
  const cookies = new Cookies();
  const [otp, setOtp] = useState();
  const uid = cookies.get('userId');
  const token = cookies.get('token');
  const configuration = {
    method: "post",
    url: TRANSACTION_URL,
    headers: {
      'Content-Type': 'application/json',
      uid: uid,
      transactionId: transactionId,
      otp: otp,
      token: token,
    },
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios(configuration)
      .then((result) => {
        console.log(result);
        navigate('/deliver');
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  }
  return (
    <div>
      <h1>Transaction</h1>
      <form action="POST">
      <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <input type="submit" value="Submit" onClick={(e) => handleSubmit(e)}/>
      </form>
    </div>
  );
}

export default Transaction;
