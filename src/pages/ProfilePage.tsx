import { Card, Tabs, Avatar } from "antd";
import { TeamOutlined, DollarOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import API from "../utils/api";

import InfoBox from "../components/InfoBox";
import ProfileInfo from "../components/ProfilInfo";

import Profilbg from "../assets/ProfilPagePic.png";
import finanCard from "../assets/finanCard.png";
import object from "../assets/Object.png";

const { TabPane } = Tabs;

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    API.get("/accounts/me/")
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, []);

  if (!user) return <div className="text-center p-6">Yuklanmoqda...</div>;

  return (
    <div className="px-10 py-1 min-h-screen">

      <div className="bg-white rounded-xl shadow p-2 mb-4">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile" key="1" />
        </Tabs>
      </div>

      <Card
        className="!rounded-2xl !mb-6 w-full max-w-4xl overflow-hidden !text-white relative"
        style={{
          backgroundImage: `url(${Profilbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img
          src={object}
          alt="Object"
          className="absolute -top-10 -right-10 w-32 h-32 object-contain"
        />

        <div className="flex justify-between items-center p-6">
          
          <div className="flex items-center space-x-4">
            <Avatar
              size={64}
              src={user.avatar}
            >
              {user?.full_name?.[0] ?? "?"}
            </Avatar>
            <div className="p-4">
              <p className="text-2xl">Xush kelibsiz!</p>
              <h2 className="text-4xl mb-2 font-bold">
                {user.full_name ?? "Ism Familiya"}
              </h2>
              <span className="bg-white text-gray-700 px-2 py-1 rounded-md text-xs font-medium capitalize">
                {user.role === "director"
                  ? "Direktor"
                  : user.role ?? "Foydalanuvchi"}
              </span>
            </div>
          </div>

          
          <div
            className="text-start w-[267px] h-[128px] bg-white/30 backdrop-blur-sm border rounded-2xl p-4"
            style={{
              backgroundImage: `url(${finanCard})`,
              backgroundSize: "cover",
              backgroundPosition: "top right",
            }}
          >
            <p className="text-sm font-medium text-white">Finance card</p>
            <p className="text-xs text-white opacity-70 mb-1">
              ID: {user.id}
            </p>
            <p className="text-xs text-white opacity-70 mb-2">
              Current balance:
            </p>
            <p className="text-xl font-bold text-white">
              557 000 so’m
            </p>
          </div>
        </div>
      </Card>

      
      <div className="grid grid-cols-1 md:grid-cols-3 w-4xl gap-4 mb-6">
        <InfoBox
          icon={<TeamOutlined className="text-blue-600 text-lg" />}
          title="Vazifalar"
          value="0"
          subtext="Group and individual"
        />
        <InfoBox
          icon={<DollarOutlined className="text-green-600 text-lg" />}
          title="Rasmiy oylik"
          value={`${user?.salary_official?.toLocaleString?.() ?? "0"} so'm`}
          subtext="1 218 000 so'm"
        />
        <InfoBox
          icon={<DollarOutlined className="text-orange-500 text-lg" />}
          title="Norasmiy oylik"
          value={`${user?.salary_unofficial?.toLocaleString?.() ?? "0"} so'm`}
          subtext="1 218 000 so'm"
        />
      </div>
      <ProfileInfo/>
    </div>
  );
}
