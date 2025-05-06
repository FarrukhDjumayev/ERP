import { useEffect, useState } from "react";
import API from "../utils/api";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Typography,
} from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

// Tiplar
type User = {
  full_name: string;
  gender: string | null;
  phone_number: string;
  passport_number: string | null;
  jshshr: string | null;
  birth_date: string | null;
  salary_type: string | null;
};

type Employee = {
  id: number;
  user: User;
  user_full_name: string;
  user_role: string;
  branch_name: string;
  position: string;
  salary: string;
  official_salary: string;
  start_time: string;
  end_time: string;
};

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/employee/employees/branch/1/")
      .then((res) => {
        setEmployees(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError("Ma'lumot yuklanmadi. Token yoki ruxsatni tekshiring.");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const filtered = employees.filter((emp) =>
    emp.user_full_name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      render: () => <input type="checkbox" />,
      width: 40,
    },
    {
      title: "F.I.SH",
      dataIndex: "user_full_name",
      render: (text: string) => <Text className="text-blue-600">{text}</Text>,
    },
    {
      title: "ROLE",
      dataIndex: "user_role",
      render: (role: string) => <span className="capitalize">{role}</span>,
    },
    {
      title: "Telefon",
      dataIndex: ["user", "phone_number"],
    },
    {
      title: "Filial",
      dataIndex: "branch_name",
    },
    {
      title: "Smena",
      key: "smena",
      render: (_: any, record: Employee) =>
        `${record.start_time} - ${record.end_time}`,
    },
    {
      title: "Ish boshlagan sana",
      dataIndex: "start_date",
      render: () => "--", // APIda yo‘q, placeholder
    },
    {
      title: "",
      key: "actions",
      render: () => <MoreOutlined style={{ fontSize: 18, cursor: "pointer" }} />,
    },
  ];

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button type="primary" icon={<PlusOutlined />}>
          Xodim qo‘shish
        </Button>
        <Space>
          <Input
            placeholder="Qidiruv"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <Select defaultValue="" style={{ width: 180 }}>
            <Option value="">Filial tanlang</Option>
            {/* <Option value="1">Filial 1</Option> */}
          </Select>
        </Space>
      </div>

      {/* Jadval */}
      <Table
        columns={columns}
        dataSource={filtered.map((emp) => ({
          key: emp.id,
          ...emp,
        }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
        scroll={{ x: true }}
      />
    </div>
  );
}
