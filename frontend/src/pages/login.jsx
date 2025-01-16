import { useState } from "react"
import axios from "axios";
import Cookies from "universal-cookie";

function Login() {
  const LOGIN_URL = 'http://localhost:3000/login';
  const cookies = new Cookies();
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
        cookies.set("token", result.data.token, {
          path: "/",
          sameSite: "none",
          secure: true,
        });
        cookies.set("userId", result.data.userId, {
            path: "/" ,
            sameSite: "none",
            secure: true,
        });
        console.log(cookies.get("token"));
        console.log(cookies.get("userId"));
        window.location.href = "/profile";
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
      <button onClick={() => window.location.href = "/register"}>Register</button>
    </div>
  )
}

export default Login