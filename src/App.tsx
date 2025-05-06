import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always on top */}
      {!isLoginPage && <Navbar />}

      <div className="flex flex-1">
        {/* Sidebar on the left, under the Navbar */}
        {!isLoginPage && <Sidebar />}

        {/* Main content on the right */}
        <main className="flex-grow py-6 px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
