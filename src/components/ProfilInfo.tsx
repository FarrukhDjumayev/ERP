import { FC, useEffect, useState } from "react";
import { Descriptions, Spin } from "antd";
import {
  PhoneOutlined,
  BankOutlined,
  MailOutlined,
  IdcardOutlined,
  CalendarOutlined,
  UserOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { PiUserListBold } from "react-icons/pi";
import API from "../utils/api";

type User = {
  phone_number: string;
  email: string;
  stir: string;
  birth_date: string;
  gender: string;
  company_id: number;
};

type Company = {
  name: string;
  stir: string;
  license_file: string | null;
  created_at: string;
};

const ProfileInfo: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/accounts/me/");
        const userData: User = userRes.data;
        setUser(userData);

        const companyRes = await API.get("/company/get/");

        const companyData: Company = companyRes.data;
        setCompany(companyData);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const infoItem = (
    label: React.ReactNode,
    value: React.ReactNode | string | null | undefined
  ) => (
    <Descriptions.Item label={label}>
      {value ?? <span className="text-gray-400">Nomaʼlum</span>}
    </Descriptions.Item>
  );

  return (
    <div className="bg-white p-6 w-4xl rounded-xl shadow-md">
      <h3 className="text-lg flex items-center gap-2 font-semibold mb-4">
        <PiUserListBold className="inline" /> Maʼlumotlar
      </h3>

      <Descriptions column={2}>
        {infoItem(<><PhoneOutlined /> Telefon raqam</>, user?.phone_number)}
        {infoItem(<><BankOutlined /> Kompaniya nomi</>, company?.name)}
        {infoItem(<><MailOutlined /> Email</>, user?.email)}
        {infoItem(<><IdcardOutlined /> INN</>, company?.stir)}
        {infoItem(<><CalendarOutlined /> Tug‘ilgan sana</>, user?.birth_date)}
        {infoItem(
          <><CalendarOutlined /> Kompaniya ochilgan sana</>,
          company?.created_at?.split("T")[0]
        )}
        {infoItem(<><UserOutlined /> Jinsi</>, user?.gender)}
        {infoItem(
          <><FilePdfOutlined /> Litsenziya</>,
          company?.license_file ? (
            <a
              href={company.license_file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Yuklab olish
            </a>
          ) : (
            "Fayl yoʻq"
          )
        )}
      </Descriptions>
    </div>
  );
};

export default ProfileInfo;
