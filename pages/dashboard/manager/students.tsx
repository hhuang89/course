import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "antd/dist/antd.css";
import { Layout, Menu, Input } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  SelectOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import styles from "../../../styles/Students.module.css";
import StudentTable from "../../../components/studentTable";

const { Header, Sider, Content } = Layout;
const { Search } = Input;

class SiderDemo extends React.Component {

  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  quit = () => {
      
      
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
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
              this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: styles.trigger,
                onClick: this.toggle,
              }
            )}
            
            <LogoutOutlined 
                className={styles.trigger}
                style={{float: "right"}}
            >
                
            </LogoutOutlined>
            
          </Header>
          <Content
            className={styles.site_layout_content}
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <Search placeholder="Search by name" style={{ width: 200 }} />
            <StudentTable />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default SiderDemo;