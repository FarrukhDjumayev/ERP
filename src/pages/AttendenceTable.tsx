import { useEffect, useState } from "react";
import API from "../utils/api";
import {
  Table,
  Input,
  Avatar,
  Button,
  Space,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";


type Attendance = {
  id: number;
  check_in: string;
  check_out: string;
  working_hours: string;
  check_in_data: { status: string };
  work_status_data: { status: string };
};

type Employee = {
  employee_id: number;
  employee_name: string;
  position: string;
  department: string;
  city?: string;
  phone?: string;
  image_url?: string;
  attendances: Attendance[];
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AttendanceTable() {
  const [data, setData] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/employee/departments/1/attendances/")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = data.filter((emp) =>
    emp.employee_name.toLowerCase().includes(search.toLowerCase())
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
      dataIndex: "employee_name",
      render: (_: any, record: any) => (
        <Space>
          <Avatar src={record.image_url || "/default-avatar.png"} />
          <span>{record.employee_name}</span>
        </Space>
      ),
    },
    {
      title: "Mobil raqam",
      dataIndex: "phone",
      render: (text: string) => text || "+998 (93) 954-21-11",
    },
    {
      title: "Shahar",
      dataIndex: "city",
      render: (text: string) => text || "Tashkent",
    },
    {
      title: "Ishga kelgan",
      dataIndex: "check_in",
      render: (text: string) => formatDate(text),
    },
    {
      title: "Ishdan chiqqan",
      dataIndex: "check_out",
      render: (text: string) => formatDate(text),
    },
  ];

  // Flattened data for table (1 row per attendance)
  const tableData = filtered.flatMap((employee) =>
    employee.attendances.map((attendance) => ({
      key: attendance.id,
      employee_name: employee.employee_name,
      phone: employee.phone,
      city: employee.city,
      image_url: employee.image_url,
      check_in: attendance.check_in,
      check_out: attendance.check_out,
    }))
  );

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search by name"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button icon={<DownloadOutlined />}>Export</Button>
      </div>

      <Table
        columns={columns}
        dataSource={tableData}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
      />
    </div>
  );
}
