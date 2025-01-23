import Navbar from "./components/navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <body>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <footer>
          <p>© 2025 DASS</p>
        </footer>
    </body>
  );
}

export default Layout;