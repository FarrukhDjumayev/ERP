import { Link, useLocation } from "react-router-dom";
import {
  Users,
  ClipboardList,
  Home,
  Wallet,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: "/employees", label: "Xodimlar ro'yxati", icon: <Users size={20} /> },
    { path: "/attendence", label: "Xodimlar davomati", icon: <ClipboardList size={20} /> },
    { path: "/clients", label: "Mijozlar", icon: <Home size={20} /> },
    { path: "/salary", label: "Oylik hisoboti", icon: <Wallet size={20} /> },
  ];

  return (
    <div className="w-64 h-full bg-white shadow-lg p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
