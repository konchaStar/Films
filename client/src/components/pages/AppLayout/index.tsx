import React, { useContext, useEffect, useState } from "react";
import { LoginOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Button,
  Layout,
  Menu,
  Pagination,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import { AuthContext } from "../../../context/auth.context.provider";
import { useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";
import FilmsPage from "../FilmsPage";
import { Film } from "../../../types/films";
import axios from "axios";
import { SelectEventHandler, SelectInfo } from "rc-menu/lib/interface";

const { Header, Content, Sider } = Layout;

const items: MenuProps["items"] = ["Films", "Favourite"].map((key, index) => ({
  key: index,
  label: `${key}`,
  style: {
    height: 48,
    display: "flex",
    alignItems: "center",
  },
}));

const AppLayout: React.FC = () => {
  const { logged, setLogged, role, setRole } = useContext(AuthContext);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [sortType, setSortType] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [selectType, setSelectType] = useState<string>("year");
  const [selectOrder, setSelectOrder] = useState<string>("asc");
  const navigate = useNavigate();
  const [films, setFilms] = useState<Film[]>([]);
  const [count, setCount] = useState<number>(0);
  const [tab, setTab] = useState<string>("0");

  useEffect(() => {
    if (tab === "1" && logged > -1) {
      axios
        .get(`http://localhost:3000/favourites/${logged}`)
        .then((response) => {
          setFilms(response.data.films);
          setCount(response.data.count);
        })
        .catch((err) => console.log(err));
    }
    if (tab === "0") {
      axios
        .get("http://localhost:3000/films", {
          params: {
            search,
            page,
            type: sortType,
            order: sortOrder,
          },
        })
        .then((response) => {
          setFilms(response.data.films);
          setCount(response.data.count);
        })
        .catch((err) => console.log(err));
    }
  }, [search, page, sortType, sortOrder, tab]);

  const handleSign = () => {
    if (logged > 0) {
      setLogged(-1);
      setRole("");
      window.localStorage.removeItem("token");
    } else {
      navigate("/login");
    }
  };

  const changePage = (page: number, pageSize: number) => {
    setPage(page);
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const handleOnSelect: SelectEventHandler = (info: SelectInfo) => {
    setTab(info.key);
  };

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 48,
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["0"]}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
          onSelect={handleOnSelect}
        />
        <Space>
          {role === "Admin" && (
            <Button type="primary" icon={<UserOutlined />} onClick={() => navigate("/admin")}>
              Admin
            </Button>
          )}
          <Button
            type="primary"
            onClick={handleSign}
            icon={logged > -1 ? <LogoutOutlined /> : <LoginOutlined />}
          >
            {logged > -1 ? "Sign out" : "Sign in"}
          </Button>
        </Space>
      </Header>
      <Layout>
        <Sider
          width={300}
          style={{ background: colorBgContainer, padding: 12 }}
        >
          <Space style={{ width: "100%" }} direction="vertical" size="middle">
            <Search placeholder="Search..." onSearch={onSearch} enterButton />
            <Space>
              <Select
                value={selectType}
                options={[
                  { value: "year", title: "Year" },
                  { value: "title", title: "Title" },
                ]}
                onChange={(value: string) => setSelectType(value)}
              />
              <Select
                value={selectOrder}
                options={[
                  { value: "asc", title: "Asc" },
                  { value: "desc", title: "Desc" },
                ]}
                onChange={(value: string) => setSelectOrder(value)}
              />
            </Space>
            <Button
              onClick={() => {
                setSortOrder(selectOrder);
                setSortType(selectType);
              }}
              type="primary"
              style={{ width: "100%" }}
            >
              Sort
            </Button>
            <Button
              onClick={() => {
                setSortOrder("");
                setSortType("");
              }}
              type="primary"
              style={{ width: "100%" }}
            >
              Remove sorting
            </Button>
          </Space>
        </Sider>
        <Layout style={{ padding: "24px 24px 24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              height: "calc(100vh - 96px)",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {tab === "1" && logged < 0 ? (
              <Typography.Title level={1}>
                Log in first to see favourite films
              </Typography.Title>
            ) : (
              <>
                <FilmsPage films={films} />
                <Pagination
                  align="center"
                  current={page}
                  onChange={changePage}
                  total={count}
                />
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
