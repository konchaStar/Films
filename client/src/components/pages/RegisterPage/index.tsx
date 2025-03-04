import React, { useContext } from "react";
import { Button, Form, Input, notification, Typography } from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./index.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { SignUpSchema, SignUpSchemaType } from "./schema";
import axios from "axios";
import { AuthContext, CustomJwtPayload } from "../../../context/auth.context.provider";
import { jwtDecode } from "jwt-decode";

type NotificationType = "success" | "info" | "warning" | "error";

const RegisterPage: React.FC = () => {
  const { setLogged, setRole } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => {
    axios
      .post("http://localhost:3000/reg", data)
      .then((response) => {
        window.localStorage.setItem("token", response.data.token);
        setLogged((jwtDecode(response.data.token) as CustomJwtPayload).id);
        setRole((jwtDecode(response.data.token) as CustomJwtPayload).role);
        navigate("/");
      })
      .catch((err) =>
        openNotificationWithIcon("error", err.response.data.message)
      );
  };

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string
  ) => {
    api[type]({
      message: "Authentication error",
      description: message,
    });
  };

  return (
    <div className="register-form">
      {contextHolder}
      <Typography.Title level={2}>Sign up</Typography.Title>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Email"
          help={errors.email ? errors.email.message : ""}
          validateStatus={errors.email ? "error" : ""}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input prefix={<UserOutlined />} placeholder="Email" {...field} />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          help={errors.password ? errors.password.message : ""}
          validateStatus={errors.password ? "error" : ""}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                {...field}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Confirm password"
          help={errors.confirm ? errors.confirm.message : ""}
          validateStatus={errors.confirm ? "error" : ""}
        >
          <Controller
            name="confirm"
            control={control}
            render={({ field }) => (
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm password"
                {...field}
              />
            )}
          />
        </Form.Item>
        <Form.Item label={null} style={{ flexGrow: 1, width: "100%" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ flexGrow: 1, width: "100%" }}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Link to="/login">Already have an account? Sign in</Link>
    </div>
  );
};

export default RegisterPage;
