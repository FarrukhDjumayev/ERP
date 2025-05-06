import { useEffect, useState } from "react";
import { Card, Descriptions } from "antd";
import API from "../utils/api";
import InfoBox from "../components/InfoBox";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    API.get("/accounts/me/")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Xatolik:", err));
  }, []);

  if (!user) return <div className="text-center p-6">Yuklanmoqda...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Ant Design Card + Tailwind */}
      <Card className="shadow rounded-xl">
        <h1 className="text-xl font-semibold mb-4">Foydalanuvchi Profili</h1>
        <Descriptions column={2}>
          <Descriptions.Item label="FIO">{user.first_name} {user.last_name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Telefon">{user.phone_number}</Descriptions.Item>
          <Descriptions.Item label="Tug‘ilgan sana">{user.birth_date}</Descriptions.Item>
          <Descriptions.Item label="Jinsi">{user.gender}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Tailwind bilan InfoBox lar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoBox title="Rasmiy oylik" value={`${user.salary_official} so'm`} subtext="So'nggi ma'lumot" />
        <InfoBox title="Norasmiy oylik" value={`${user.salary_unofficial} so'm`} />
        <InfoBox title="Balans" value={`${user.balance} so'm`} />
      </div>
    </div>
  );
}
