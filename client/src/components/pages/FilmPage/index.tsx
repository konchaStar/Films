import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Film } from "../../../types/films";
import { Button, Layout, notification, Space, theme, Typography } from "antd";
import {
  HeartFilled,
  HeartOutlined,
  LeftCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Player from "../../common/Player";
import { AuthContext } from "../../../context/auth.context.provider";

const { Header, Content } = Layout;

type NotificationType = "success" | "info" | "warning" | "error";

const FilmPage: React.FC = () => {
  const { id } = useParams();
  const { logged } = useContext(AuthContext);
  const [film, setFilm] = useState<Film>();
  const [favourite, setFavourite] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/film/${id}`)
      .then((response) => setFilm(response.data));
  }, [id]);

  useEffect(() => {
    if (logged > 0 && film) {
      axios
        .get("http://localhost:3000/favourites/contains", {
          params: { userId: logged, filmId: film?.id },
        })
        .then(() => {
          console.log("contains");
          setFavourite(true);
        })
        .catch(() => setFavourite(false));
    }
  }, [film]);

  const handleFavouriteClick = () => {
    if (logged < 0) {
      openNotificationWithIcon("error", "Log in to add to favourites");
    } else {
      if (!favourite) {
        axios
          .post("http://localhost:3000/favourites/add", {
            userId: logged,
            filmId: film?.id,
          })
          .then(() => setFavourite(true));
      } else {
        axios
          .post("http://localhost:3000/favourites/remove", {
            userId: logged,
            filmId: film?.id,
          })
          .then(() => setFavourite(false));
      }
    }
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
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <Typography.Title level={2} style={{margin: 0}}>{film?.title}</Typography.Title>
              <Button
                type="text"
                style={{ height: 32 }}
                onClick={handleFavouriteClick}
              >
                {favourite ? (
                  <HeartFilled style={{ color: "#f5222d" }} />
                ) : (
                  <HeartOutlined style={{ color: "#f5222d" }} />
                )}
              </Button>
            </div>

            <Player
              src={film && `http://localhost:3000/films/${film?.content}`}
            />

            <Typography.Title level={5}>{film?.year}</Typography.Title>
            <Typography.Paragraph>{film?.description}</Typography.Paragraph>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FilmPage;
