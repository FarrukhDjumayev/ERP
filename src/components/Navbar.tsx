import { FC, useEffect, useState } from "react";
import { Dropdown, Menu, Avatar, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Bell, Grid } from "lucide-react";
import API from "../utils/api";
import erpLogo from "/erpLogo.svg";
import ThemeToggle from "./ThemeToggle";

const Navbar: FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    API.get("/accounts/me/")
      .then((res) => setUser(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "profil") {
      navigate("/profil");
    }
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    }
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: "profil",
          label: "Shaxsiy kabinet",
        },
        {
          key: "logout",
          label: <span className="text-red-600">Logout</span>,
        },
      ]}
    />
  );

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-sm">

      <div className="flex items-center gap-2">
        <img src={erpLogo} alt="Logo" className="h-6 w-6" />
        <span className="text-xl font-semibold text-gray-800">Noventer</span>
      </div>


      <div className="flex-1 max-w-lg mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1117 9.5a7.5 7.5 0 01-.35 7.15z"
              />
            </svg>
          </span>
        </div>
      </div>


      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
        <Grid className="h-5 w-5 text-gray-600 cursor-pointer" />


        {loading ? (
          <Spin size="small" />
        ) : (
          <Dropdown overlay={menu} trigger={["click"]}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar
                size="large"
                icon={<UserOutlined />}
                src={user?.avatar}
              />
            </div>
          </Dropdown>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
