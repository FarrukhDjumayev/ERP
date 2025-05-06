import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import "./index.css";

import App from "./App"; // Layout
import Login from "./Login/Login";
import ProfilePage from "./pages/ProfilePage";
import AttendenceTable from "./pages/AttendenceTable"; // ✅ Davomat jadvali sahifasi
import EmployeesTable from "./pages/EmployeesTable";
import ProtectedRoute from "./components/ProtectedRoute";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <Routes>
          {/* Default root redirect to profile */}
          <Route path="/" element={<Navigate to="/profil" replace />} />

          {/* Login sahifasi */}
          <Route path="/login" element={<Login />} />

          {/* Himoyalangan sahifalar */}
          <Route element={<ProtectedRoute />}>
            <Route element={<App />}>
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/attendence" element={<AttendenceTable />} /> {/* ✅ Qo‘shilgan sahifa */}
              <Route path="/employees" element={<EmployeesTable />} /> {/* ✅ Qo‘shilgan sahifa */}
              
            </Route>
          </Route>
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
