import { Form, Input, Button, Typography, notification } from "antd";
import LoginPic from "../assets/LoginLeftPic.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import Particles from "../components/Particles";

const { Title, Paragraph } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    console.log("Yuborilayotgan values:", values);

    try {
      setLoading(true);

      const response = await API.post(
        "/accounts/login/",
        {
          phone_number: values.phone_number.trim(),
          password: values.password.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", response.data);
      const token = response.data.data.tokens.access;

      if (!token) {
        throw new Error("Token topilmadi!");
      }

      localStorage.setItem("token", token);

      notification.success({
        message: "Muvaffaqiyatli kirish",
        description: "Tizimga muvaffaqiyatli kirdingiz!",
      });

      try {
        const meResponse = await API.get("/accounts/me/");
        console.log("Foydalanuvchi ma'lumotlari:", meResponse.data);

        navigate("/profil");
      } catch (meError: any) {
        console.error("Foydalanuvchini olishda xatolik:", meError);
        notification.error({
          message: "Foydalanuvchi ma'lumotlari xatosi",
          description:
            meError.response?.status === 429
              ? "Juda ko‘p so‘rov yuborildi. Iltimos, biroz kuting va qayta urinib ko‘ring."
              : meError.response?.data?.detail || "Ma'lumotlarni olishda muammo yuz berdi.",
        });
      }
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
          description:
            error.response?.status === 429
              ? "Juda ko‘p so‘rov yuborildi. Iltimos, bir ozdan so‘ng urinib ko‘ring."
              : error.response?.data?.detail || "Noma'lum xatolik yuz berdi",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className="w-1/2 h-full flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${LoginPic})`,
        }}
      >
        <img
          src={LoginPic}
          alt="Login rasmi"
          className="object-contain rounded-full max-w-full max-h-full p-8 drop-shadow-lg"
        />
      </div>




      <div className="w-1/2 h-full flex items-center justify-center relative">
        <div
          className="absolute inset-0 bg-black z-0"
          style={{ zIndex: 1 }}
        >
          <Particles
            particleColors={['	#39FF14', '#39FF14']}
            particleCount={400}
            particleSpread={10}
            speed={0.3}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>


        <div className="w-2/3 z-10 relative">

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-white/20">
            <img
              src="/erpLogo.svg"
              alt="Noventer Logo"
              className="mx-auto mb-6"
            />
            <Title level={2} className="text-center !text-white">
              NovEnter
            </Title>
            <Paragraph className="text-center mb-8 !text-white">
              CRM tizim bilan biznesingizni rivojlantiring
            </Paragraph>

            <Form name="login-form" layout="vertical" onFinish={onFinish}>
              <Form.Item
                label={<span className="text-white">Telefon raqam</span>}
                name="phone_number"
                rules={[
                  { required: true, message: "Telefon raqamni kiriting!" },
                  {
                    pattern: /^\+998\d{9}$/,
                    message: "Telefon raqam +998 bilan va 9 raqam bo‘lishi kerak!",
                  },
                ]}
              >
                <Input placeholder="+998..." size="large" />
              </Form.Item>

              <Form.Item
                label={<span className="text-white">Parol</span>}
                name="password"
                rules={[
                  { required: true, message: "Parolni kiriting!" },
                  {
                    min: 6,
                    message: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!",
                  },
                ]}
              >
                <Input.Password placeholder="Parol" size="large" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}

                >
                  Kirish
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Login;
