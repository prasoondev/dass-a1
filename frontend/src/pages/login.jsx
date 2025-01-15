function Login() {
    return (
      <div>
        <h1>Login</h1>
        <form action="POST">
          <input type="text" name="username" placeholder="Username" />
          <input type="password" name="password" placeholder="Password" />
          <input type="submit" />
        </form>
      </div>
    )
  }
  
  export default Login