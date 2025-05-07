import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      {!isLoginPage && <Navbar />}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isLoginPage && (
          <div className="w-64 h-full sticky top-0 bg-white shadow z-40">
            <Sidebar />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
