import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";

import App from "./App";
import Login from "./Login/Login";
import ProfilePage from "./pages/ProfilePage";
import EmployeesTable from "./pages/EmployeesTable";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientTable from "./pages/ClientsTable";
import Smenalar from "./pages/ShiftTable"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/profil" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<App />}>
                <Route path="/profil" element={<ProfilePage />} />
                <Route path="/employees" element={<EmployeesTable />} />
                <Route path="/clients" element={<ClientTable />} />
                <Route path="/shifts" element={<Smenalar />} />
              </Route>
            </Route>
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
