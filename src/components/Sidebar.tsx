import { Link, useLocation } from "react-router-dom";
import { Users, Home } from "lucide-react";
import { GrSchedule } from "react-icons/gr";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      path: "/employees",
      label: "Xodimlar ro'yxati",
      icon: <Users size={18} />,
    },
    {
      path: "/clients",
      label: "Mijozlar",
      icon: <Home size={18} />,
    },
    {
      path: "/shifts",
      label: "Smenalar",
      icon: <GrSchedule size={18} />,
    },
    {
      path: "",
      label: "Bo'limlar",
      icon: <GrSchedule size={18} />,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm p-4">
      <nav>
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }
                  `}
                >
                  <span className="flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
