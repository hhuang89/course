import React, { useCallback, useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import "antd/dist/antd.css";
import { Layout, Menu, message } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  SelectOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "../styles/Students.module.css";
import axios from "axios";
const { Header, Sider } = Layout;

export default function DetailLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const router = useRouter();

  const handleLogout = () => {
    axios
      .post(
        "https://cms.chtoma.com/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      )
      .then((result) => {
        message.success("successfully");
        router.push("/login");
      })
      .catch(() => message.error("error"));
    localStorage.removeItem("token");
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className={styles.logo}>CMS</div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            Student List
          </Menu.Item>
          <Menu.Item key="2" icon={<SelectOutlined />}>
            Select Student
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className={styles.site_layout}>
        <Header
          className={styles.site_layout_background}
          style={{ padding: 0 }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: styles.trigger,
              onClick: toggle,
            }
          )}

          <LogoutOutlined
            className={styles.trigger}
            style={{ float: "right" }}
            onClick={handleLogout}
          />
        </Header>
        {children}
      </Layout>
    </Layout>
  );
}
