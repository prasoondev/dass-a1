import { useState } from "react"
import axios from "axios";

function Register() {
  const REGISTER_URL = 'http://localhost:3000/register';
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const configuration = {
    method: "post",
    url: REGISTER_URL,
    data: {
      fname,
      lname,
      email,
      age: Number(age),
      contact: Number(contact),
      password,
    },
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(configuration);
    axios(configuration)
      .then((result) => {
        console.log(result);
        window.location.href = "/";
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  }

  return (
    <div>
      <h1>Register</h1>
      <form action="POST">
        <input type="text" name="fname" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} />
        <input type="text" name="lname" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} />
        <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="number" name="age" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <input type="number" name="contact" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" value="Register" onClick={(e) => handleSubmit(e)} />
      </form>
      <button onClick={() => window.location.href = "/"}>Login</button>
    </div>
  )
}

export default Register