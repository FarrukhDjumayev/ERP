import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, TimePicker, Select, message, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchBranches } from "../store/slices/branchSlice";
import { fetchShifts, createShift, updateShift, deleteShift } from "../store/slices/shiftSlice";
import dayjs from "dayjs";
import { Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaUserPlus } from "react-icons/fa6";

const { Option } = Select;

const ShiftTable = () => {
  const dispatch = useAppDispatch();
  const { data: branches } = useAppSelector((state) => state.branches);
  const { data: shifts, loading } = useAppSelector((state) => state.shifts);

  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  useEffect(() => {
    if (branches.length > 0 && selectedBranch === null) {
      setSelectedBranch(branches[0].id);
    }
  }, [branches, selectedBranch]);

  useEffect(() => {
    if (selectedBranch) {
      dispatch(fetchShifts(selectedBranch));
    }
  }, [selectedBranch, dispatch]);

  const handleAdd = () => {
    setEditingShift(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (shift: any) => {
    setEditingShift(shift);
    form.setFieldsValue({
      name: shift.name,
      start_time: dayjs(shift.start_time, "HH:mm:ss"),
      end_time: dayjs(shift.end_time, "HH:mm:ss"),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteShift(id)).unwrap();
      message.success("Smena o‘chirildi");
    } catch (error) {
      message.error("O‘chirishda xatolik");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        branch: selectedBranch,
        start_time: values.start_time.format("HH:mm:ss"),
        end_time: values.end_time.format("HH:mm:ss"),
      };

      if (editingShift) {
        await dispatch(updateShift({ id: editingShift.id, shiftData: payload })).unwrap();
        message.success("Smena tahrirlandi");
      } else {
        await dispatch(createShift(payload)).unwrap();
        message.success("Smena qo‘shildi");
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Saqlashda xatolik");
    }
  };

  const columns = [
    {
      title: "№",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Smena nomi",
      dataIndex: "name",
    },
    {
      title: "Boshlanish vaqti",
      dataIndex: "start_time",
    },
    {
      title: "Tugash vaqti",
      dataIndex: "end_time",
    },
    {
      title: "Amallar",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >

          </Button>

          <Popconfirm
            title="Ushbu smenani o‘chirmoqchimisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button danger icon={<DeleteOutlined />}>

            </Button>
          </Popconfirm>
        </Space>
      ),
    }

  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Select
          style={{ width: 250 }}
          onChange={(value) => setSelectedBranch(value)}
          value={selectedBranch ?? undefined}
        >
          {branches.map((branch: any) => (
            <Option key={branch.id} value={branch.id}>
              {branch.name}
            </Option>
          ))}
        </Select>


        <Button type="primary" onClick={handleAdd} disabled={!selectedBranch}>
          <FaUserPlus /> Smena qo‘shish
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={shifts}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}

      <Modal
        title={editingShift ? "Smena tahrirlash" : "Yangi smena qo‘shish"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={editingShift ? "Saqlash" : "Qo‘shish"}
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Smena nomi"
            name="name"
            rules={[{ required: true, message: "Iltimos, smena nomini kiriting" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Boshlanish vaqti"
            name="start_time"
            rules={[{ required: true, message: "Iltimos, boshlanish vaqtini kiriting" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Tugash vaqti"
            name="end_time"
            rules={[{ required: true, message: "Iltimos, tugash vaqtini kiriting" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShiftTable;
