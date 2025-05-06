import { FC } from "react";
import { Dropdown, Menu, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Sun, Bell, Grid } from "lucide-react";
import erpLogo from "/erpLogo.svg";

const Navbar: FC = () => {
  const navigate = useNavigate();

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
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <img src={erpLogo} alt="Logo" className="h-6 w-6" />
        <span className="text-xl font-semibold text-gray-800">Noventer</span>
      </div>

      {/* Center - Search */}
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

      {/* Right - Icons */}
      <div className="flex items-center gap-4">
        <button className="bg-orange-100 p-2 rounded-full">
          <Sun className="h-5 w-5 text-orange-500" />
        </button>
        <Bell className="h-5 w-5 text-gray-600 cursor-pointer" />
        <Grid className="h-5 w-5 text-gray-600 cursor-pointer" />

        {/* Avatar with Dropdown */}
        <Dropdown overlay={menu} trigger={["click"]}>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src="https://i.pravatar.cc/40"
            className="cursor-pointer"
          />
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
