import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchClients, createClient, updateClient, deleteClient } from "../store/slices/clientSlice";
import { Table, Input, Button, Modal, Form, Select, notification, Upload, Popconfirm } from "antd";
import { SearchOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaUserPlus } from "react-icons/fa6";
import clientAvatar from "../assets/clientAvatar.webp";
import { fetchBranches } from "../store/slices/branchSlice";

export default function ClientTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading } = useSelector((state: RootState) => state.clients);

  const [search, setSearch] = useState("");
  const [editedClient, setEditedClient] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { data: branches } = useSelector((state: RootState) => state.branches);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchBranches());
  }, [dispatch]);

  const handleModalOpen = (client?: any) => {
    if (client) {
      setEditedClient(client);

      form.setFieldsValue({
        ...client,
        branch_id: client.branch || client.branch_id || undefined,
      });
    } else {
      setEditedClient(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
  try {
    const values = await form.validateFields();
    const formData = new FormData();
formData.append("name", values.name);
formData.append("phone", values.phone);

if (values.branch_id) {
  formData.append("branch_id", values.branch_id.toString());
}

if (values.avatar && values.avatar.length > 0) {
  formData.append("avatar", values.avatar[0].originFileObj); // Assuming this is the correct format
}


    // Assuming backend expects the 'name', 'phone', 'branch' fields and possibly an avatar file.
    if (editedClient) {
      await dispatch(updateClient({ id: editedClient.id, clientData: formData }));
      notification.success({ message: "Mijoz yangilandi!" });
    } else {
      await dispatch(createClient(formData));
      notification.success({ message: "Mijoz qo‘shildi!" });
    }

    setIsModalVisible(false);
    form.resetFields();
  } catch (error) {
    notification.error({ message: `Client create error: ${(error instanceof Error && error.message) ? error.message : 'Unknown error'}` });
  }
};


  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditedClient(null);
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    dispatch(deleteClient(id));
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: "",
      dataIndex: "checkbox",
      render: () => <input type="checkbox" />,
      width: 40,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (avatar: string) => (
        <img
          src={avatar || clientAvatar}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      ),
    },


    {
      title: "F.I.SH",
      dataIndex: "name",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
    },
    {
      title: "Filial",
      dataIndex: "branch_name",
    },
    {
      title: "Litsenziya",
      dataIndex: "license_file",
      render: (file: string) =>
        file ? <a href={file} target="_blank" rel="noopener noreferrer">Yuklab olish</a> : "Yo‘q",
    },
    {
      title: "Qo‘shilgan sana",
      dataIndex: "created_at",
      render: (created_at: string) => new Date(created_at).toLocaleDateString("uz-UZ"),
    },
    {
      title: "Amallar",
      render: (_: any, client: any) => (
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => handleModalOpen(client)}
            icon={<EditOutlined />}
            className="text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 !rounded-lg !focus:ring-2 !focus:ring-blue-300"
          ></Button>

          <Popconfirm
            title="Clientni o‘chirishni istaysizmi?"
            onConfirm={() => handleDelete(client.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              className="!text-red-600 !border-red-600 !hover:text-white !over:bg-red-600 !rounded-lg !focus:ring-2 !focus:ring-red-300"
            ></Button>
          </Popconfirm>

        </div>
      ),
    }
  ];

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Ism orqali qidirish"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => handleModalOpen()}>
          <FaUserPlus /> Mijoz qo‘shish
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredClients}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
      />
      <Modal
        title={editedClient ? "Mijozni tahrirlash" : "Mijoz qo‘shish"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Saqlash"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Ism" name="name" rules={[{ required: true, message: 'Ism kiriting!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Telefon" name="phone" rules={[{ required: true, message: 'Telefon raqami kiriting!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Filial" name="branch_id">
            <Select placeholder="Filial tanlang">
              {branches.map(branch => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Avatar" name="avatar" valuePropName="fileList" getValueFromEvent={e => e.fileList}>
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Avatar yuklash</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}