import Navbar from "./components/navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <footer>
          <p>© 2025 DASS</p>
        </footer>
    </>
  );
}

export default Layout;