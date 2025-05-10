import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchEmployees } from "../store/slices/employeeSlice";
import { fetchBranches } from "../store/slices/branchSlice";
import { Table, Input, Select, Button, Space, Typography, Modal } from "antd";
import { FaUserPlus } from "react-icons/fa6";
import AddEmployeeForm from "../components/AddEmployeeForm";
import unknownPic from "../assets/pic.webp";

const { Option } = Select;
const { Text } = Typography;

interface Employee {
  id: number;
  user_full_name: string;
  user_role: string;
  branch_name: string;
  start_time: string;
  end_time: string;
  user: {
    phone_number: string;
    birth_date: string | null;
  };
}

export default function EmployeeTable() {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data: employees = [], loading, error } = useAppSelector(
    (state) => state.employees
  );
  const { data: branches = [] } = useAppSelector((state) => state.branches);

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEmployees(selectedBranch));
  }, [dispatch, selectedBranch]);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((emp: Employee) =>
        emp.user_full_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [employees, searchTerm]
  );

  const columns = useMemo(
    () => [
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
        render: (_: unknown, record: Employee) =>
          `${record.start_time} - ${record.end_time}`,
      },
      {
        title: "Tug‘ilgan sana",
        dataIndex: ["user", "birth_date"],
        render: (date: string | null) => date || "Nomaʼlum",
      },
    ],
    []
  );

  const showModal = useCallback(() => setIsModalVisible(true), []);
  const handleCancel = useCallback(() => setIsModalVisible(false), []);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded shadow space-y-4">
      <div className="flex justify-between items-center">
        <Button type="primary" icon={<FaUserPlus />} onClick={showModal}>
          Xodim qo‘shish
        </Button>
        <Space>
          <Input
            placeholder="Qidiruv"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            value={selectedBranch}
            onChange={(val) => setSelectedBranch(Number(val))}
            style={{ width: 180 }}
          >
            {branches.map((branch: { id: number; name: string }) => (
              <Option key={branch.id} value={branch.id}>
                {branch.name}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEmployees.map((emp) => ({
          key: emp.id,
          ...emp,
        }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
        scroll={{ x: true }}
      />

      <Modal
        title="Yangi Xodim Qo‘shish"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <AddEmployeeForm onClose={handleCancel} />
      </Modal>
    </div>
  );
}
