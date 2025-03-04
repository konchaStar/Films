import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/auth.context.provider";
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  notification,
  theme,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { LeftCircleOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";

type NotificationType = "success" | "info" | "warning" | "error";

const AdminPage: React.FC = () => {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (role !== "Admin") {
      navigate("/");
    }
  }, []);

  const handleFileChange = (info: { file: UploadFile }) => {
    if (info.file.status === "done") {
      setFile(info.file.originFileObj as File);
    }
  };

  const handleFilmUpload = () => {
    if (file) {
      const formData: FormData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("year", year);
      formData.append("image", image);
      axios.post("http://localhost:3000/films/add", formData).then(() => {
        setTitle("");
        setFile(null);
        setDescription("");
        setImage("");
        setYear("");
        openNotificationWithIcon(
          "success",
          "Upload",
          "Film was uploaded successfully"
        );
      });
    } else {
      openNotificationWithIcon("error", "Upload error", "Upload file first");
    }
  };

  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  return (
    <Layout>
      {contextHolder}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 48,
        }}
      >
        <Button
          type="primary"
          icon={<LeftCircleOutlined />}
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </Header>
      <Layout style={{ padding: "24px 24px 24px" }}>
        <Content
          style={{
            padding: "24px",
            margin: 0,
            height: "calc(100vh - 96px)",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflowY: "auto",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Card
            bordered={false}
            style={{
              width: "30%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography.Title level={2}>Add new film</Typography.Title>
            <Form
              layout="vertical"
              style={{ width: "100%" }}
              onFinish={handleFilmUpload}
            >
              <Form.Item label="Title">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Item>
              <Form.Item label="Year">
                <Input
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </Form.Item>
              <Form.Item label="Description">
                <Input.TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Item>
              <Form.Item label="Image">
                <Input.TextArea
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Film">
                <Upload
                  multiple={false}
                  onChange={handleFileChange}
                  customRequest={({ file, onSuccess }: any) => {
                    setFile(file as File);
                    onSuccess(file);
                  }}
                  maxCount={1}
                  onRemove={() => setFile(null)}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item label={null} style={{ width: "100%" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
