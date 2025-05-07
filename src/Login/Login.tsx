import { Form, Input, Button, Typography, notification } from "antd";
import LoginPic from "../assets/LoginLeftPic.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const { Title, Paragraph } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log('Yuborilayotgan values:', values);

    try {
      setLoading(true);

      const response = await API.post("/accounts/login/", {
        phone_number: values.phone_number.trim(), 
        password: values.password.trim(),          
      }, {
        headers: {
          "Content-Type": "application/json", 
        }
      });

      console.log("Login response:", response.data);
      const token = response.data.data.tokens.access;

      if (!token) {
        throw new Error("Token topilmadi!");
      }

      localStorage.setItem('token', token);

      notification.success({
        message: "Muvaffaqiyatli kirish",
        description: "Tizimga muvaffaqiyatli kirdingiz!",
      });

      const meResponse = await API.get("/accounts/me/");
      console.log("Foydalanuvchi ma'lumotlari:", meResponse.data);

      navigate("/profil");

    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 401) {
        notification.error({
          message: "Unauthorized",
          description: "Telefon raqam yoki parol xato!",
        });
      } else {
        notification.error({
          message: "Login xatosi",
          description: error.response?.data?.detail || "Noma'lum xatolik yuz berdi",
        });
      }
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/2 h-full flex items-center justify-center bg-gray-100">
        <img src={LoginPic} alt="Login rasmi" className="object-contain max-w-full max-h-full p-8" />
      </div>

      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="w-2/3">
          <img src="/erpLogo.svg" alt="Noventer Logo" className="mx-auto mb-6" />

          <Title level={2} className="text-center">NovEnter</Title>
          <Paragraph className="text-center mb-8">
            CRM tizim bilan biznesingizni rivojlantiring
          </Paragraph>

          <Form name="login-form" layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Telefon raqam"
              name="phone_number"
              rules={[
                { required: true, message: "Telefon raqamni kiriting!" },
                { pattern: /^\+998\d{9}$/, message: "Telefon raqam +998 bilan va 9 raqam bo‘lishi kerak!" },
              ]}
            >
              <Input placeholder="+998..." size="large" />
            </Form.Item>

            <Form.Item
              label="Parol"
              name="password"
              rules={[
                { required: true, message: "Parolni kiriting!" },
                { min: 6, message: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!" },
              ]}
            >
              <Input.Password placeholder="Parol" size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Kirish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
