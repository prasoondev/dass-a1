import Cookies from "universal-cookie";

function Logout() {
  const cookies = new Cookies();

  const handleLogout = () => {
    cookies.remove("token", { path: "/", sameSite: "None", secure: true });
    cookies.remove("userId", { path: "/", sameSite: "None", secure: true });
    window.location.href = "/"; // Redirect to the login page
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
