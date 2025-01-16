import { useState } from "react"
import axios from "axios";
function Login() {
  const LOGIN_URL = 'http://localhost:3000/login';
  // const REGISTER_URL = "http://localhost:3000/register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);
  const configuration = {
    method: "post",
    url: LOGIN_URL,
    data: {
      email,
      password,
    },
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios(configuration)
      .then((result) => {
        console.log(result);
        setLogin(true);
      })
      .catch((error) => {
        error = new Error();
        console.log(error);
      });
  }

  return (
    <div>
      <h1>Login</h1>
      <form action="POST">
        <input type="text" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" value="Login" onClick={(e) => handleSubmit(e)} />
      </form>
    </div>
  )
}

export default Login