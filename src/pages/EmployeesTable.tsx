import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEmployees } from "../store/slices/employeeSlice";
import { fetchBranches } from "../store/slices/branchSlice";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Typography,
} from "antd";
import { PlusOutlined, MoreOutlined } from "@ant-design/icons";
import unknownPic from "../assets/pic.webp"

const { Option } = Select;
const { Text } = Typography;

export default function EmployeeTable() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<number | null>(1);

  const { data: employees, loading, error } = useAppSelector(
    (state) => state.employees
  );
  const { data: branches } = useAppSelector((state) => state.branches);

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBranch !== null) {
      dispatch(fetchEmployees(selectedBranch));
    }
  }, [dispatch, selectedBranch]);

  const filtered = employees.filter((emp: any) =>
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
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <img
            src={unknownPic}
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <Text className="text-blue-600">{text}</Text>
        </div>
      ),
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
      render: (_: any, record: any) =>
        `${record.start_time} - ${record.end_time}`,
    },
    {
      title: "Tug‘ilgan sana",
      dataIndex: ["user", "birth_date"],
      render: (date: string) => date ?? "Nomaʼlum",
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
          <Select
            value={selectedBranch ?? ""}
            onChange={(val: string | number) => setSelectedBranch(Number(val))}
            style={{ width: 180 }}
          >
            {branches.map((branch: any) => (
              <Option key={branch.id} value={branch.id}>
                {branch.name}
              </Option>
            ))}
          </Select>

        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filtered.map((emp: any) => ({
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
