// src/components/ClientTable.tsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchClients, createClient, updateClient, deleteClient } from "../store/slices/clientSlice";
import { Table, Input, Button, Modal, Form, Select, notification, Upload } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import clientPic from "../assets/clientPic.webp";
import { FaUserPlus } from "react-icons/fa6";
import {Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";


export default function ClientTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, loading } = useSelector((state: RootState) => state.clients);

  const [search, setSearch] = useState("");
  const [editedClient, setEditedClient] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleModalOpen = (client?: any) => {
    if (client) {
      setEditedClient(client);
      form.setFieldsValue(client);
    } else {
      setEditedClient(null);
    }
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("phone", values.phone);
      formData.append("avatar", values.avatar?.file || "");

      if (editedClient) {
        formData.append("branch_name", values.branch_name);
        dispatch(updateClient({ id: editedClient.id, clientData: formData }));
      } else {
        dispatch(createClient(formData));
      }
      setIsModalVisible(false);
      notification.success({ message: editedClient ? "Mijoz yangilandi!" : "Mijoz qo‘shildi!" });
    } catch (error) {
      notification.error({ message: "Xatolik"});
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
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
      dataIndex: "avatar",
      render: (avatar: string) => <img className="rounded-full" src={avatar || clientPic} alt="client avatar" width={50} />,
      width: 50,
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
            className="text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600"
          >
            Tahrirlash
          </Button>
    
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
              className="text-red-600 border-red-600 hover:text-white hover:bg-red-600"
            >
              O‘chirish
            </Button>
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
        <Button type="primary" onClick={() => handleModalOpen()}> <FaUserPlus /> Mijoz qo‘shish</Button>
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
        visible={isModalVisible}
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
          <Form.Item label="Filial" name="branch_name">
            <Select>
              <Select.Option value="Chilonzor">Chilonzor</Select.Option>
              <Select.Option value="Mirzo Ulugbek">Mirzo Ulugbek</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Avatar" name="avatar">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Avatar yuklash</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
