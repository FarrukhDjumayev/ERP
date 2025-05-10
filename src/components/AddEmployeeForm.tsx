import { useEffect, useState } from "react";
import { Form, Input, Select, Button, DatePicker, InputNumber, Row, Col, message } from "antd";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDepartments } from "../store/slices/departmentSlice";
import { fetchEmployees, createEmployee } from "../store/slices/employeeSlice";
import { fetchShifts } from "../store/slices/shiftSlice";

const { Option } = Select;

interface AddEmployeeFormProps {
  onClose: () => void;
}

export default function AddEmployeeForm({ onClose }: AddEmployeeFormProps) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const { data: branches } = useAppSelector((state) => state.branches);
  const { data: shifts } = useAppSelector((state) => state.shifts);
  const { data: departments } = useAppSelector((state) => state.departments);

  useEffect(() => {
    if (selectedBranch !== null) {
      dispatch(fetchDepartments(selectedBranch));
      dispatch(fetchShifts(selectedBranch));
    }
  }, [selectedBranch, dispatch]);

  const handleSubmit = async (values: any) => {
    const newEmployee = {
      user: {
        full_name: values.full_name,
        gender: values.gender,
        phone_number: values.phone_number,
        passport_number: values.passport_number,
        jshshr: values.jshshr,
        birth_date: values.birth_date.format("YYYY-MM-DD"),
        salary_type: values.salary_type,
      },
      branch_id: values.branch_id,
      department_id: values.department_id,
      shift_id: values.shift_id,
      position: values.position,
      salary: values.salary.toString(),
      official_salary: values.official_salary.toString(),
    };

    try {
      await dispatch(createEmployee(newEmployee)).unwrap();
      message.success("Xodim muvaffaqiyatli qo‘shildi.");
      dispatch(fetchEmployees(values.branch_id));
      onClose();
    } catch (error) {
      message.error("Xodim qo‘shishda xatolik yuz berdi.");
      console.error("Error adding employee:", error);     
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      className="space-y-4"
    >
      <h2 className="text-center text-xl mb-4">Yangi Xodim Qo‘shish</h2>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="F.I.SH"
            name="full_name"
            rules={[{ required: true, message: "F.I.SH majburiy!" }]}>
            <Input placeholder="F.I.SH" />
          </Form.Item>
          <Form.Item
            label="Jins"
            name="gender"
            rules={[{ required: true, message: "Jins majburiy!" }]}>
            <Select placeholder="Jinsni tanlang">
              <Option value="male">Erkak</Option>
              <Option value="female">Ayol</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Telefon raqami"
            name="phone_number"
            rules={[{ required: true, message: "Telefon raqami majburiy!" }]}>
            <Input placeholder="Telefon raqami" />
          </Form.Item>
          <Form.Item
            label="Pasport raqami"
            name="passport_number"
            rules={[{ required: true, message: "Pasport raqami majburiy!" }]}>
            <Input placeholder="Pasport raqami" />
          </Form.Item>
          <Form.Item
            label="JSHSHR"
            name="jshshr"
            rules={[
              { required: true, message: "JSHSHR majburiy!" },
              { max: 14, message: "JSHSHR 14 ta belgidan ko‘p bo‘lmasligi kerak." },
            ]}>
            <Input placeholder="JSHSHR" />
          </Form.Item>
          <Form.Item
            label="Tug‘ilgan sana"
            name="birth_date"
            rules={[{ required: true, message: "Tug‘ilgan sana majburiy!" }]}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Maosh turi"
            name="salary_type"
            rules={[{ required: true, message: "Maosh turi majburiy!" }]}>
            <Select placeholder="Maosh turini tanlang">
              <Option value="official">Rasmiy</Option>
              <Option value="unofficial">Norasmiy</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Filial"
            name="branch_id"
            rules={[{ required: true, message: "Filial tanlash majburiy!" }]}>
            <Select placeholder="Filial tanlang" onChange={(value: number) => setSelectedBranch(value)}>
              {branches.map((branch: any) => (
                <Option key={branch.id} value={branch.id}>{branch.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Bo‘lim"
            name="department_id"
            rules={[{ required: true, message: "Bo‘lim tanlash majburiy!" }]}>
            <Select placeholder="Bo‘lim tanlang">
              {departments.map((dept: any) => (
                <Option key={dept.id} value={dept.id}>{dept.name} ({dept.short_name})</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Smena"
            name="shift_id"
            rules={[{ required: true, message: "Smena tanlash majburiy!" }]}>
            <Select placeholder="Smena tanlang">
              {shifts.map((shift: any) => (
                <Option key={shift.id} value={shift.id}>
                  {shift.name} ({shift.start_time} - {shift.end_time})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Lavozim"
            name="position"
            rules={[{ required: true, message: "Lavozim majburiy!" }]}>
            <Input placeholder="Lavozim" />
          </Form.Item>
          <Form.Item
            label="Maosh"
            name="salary"
            rules={[{ required: true, message: "Maosh majburiy!" }]}>
            <InputNumber placeholder="Maosh" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Rasmiy maosh"
            name="official_salary"
            rules={[{ required: true, message: "Rasmiy maosh majburiy!" }]}>
            <InputNumber placeholder="Rasmiy maosh" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="center" gutter={16}>
        <Col><Button onClick={onClose}>Bekor qilish</Button></Col>
        <Col><Button type="primary" htmlType="submit">Qo‘shish</Button></Col>
      </Row>
    </Form>
  );
}
