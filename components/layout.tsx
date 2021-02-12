import React, { useCallback, useEffect, useState } from "react";
import { findIndex, memoize } from "lodash";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import "antd/dist/antd.css";
import { Layout, Menu, message } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "../styles/Students.module.css";
import axios from "axios";
import { SideNav, routes } from "../lib/constant/routes";
import { getUserRole } from "../lib/services/storage";
const { Header, Sider } = Layout;

export const generateKey = (data: SideNav, index: number): string => {
  return `${data.label}_${index}`;
};


export const getActivePath = () => {
  const router = useRouter();
  //can also achieved by using filter
  const activePath = router.pathname.split("/").reduce((acc, cur) => {
    if (cur === "[id]") { // be really careful here, only detail page has [id]
      return acc;
    } else {
      return acc + (acc === "/" ? "" : "/") + cur;
    }
  }, "");

  return activePath;
};

const Path = new Set<string>();
const Key = new Set<string>();
//柯里化
export const compare = (data: SideNav[], parent: string) => {
  const userType = "manager";

  data.map((item, index) => {
    let key = generateKey(item, index);
    if (item.subNav && !!item.subNav.length) {
      compare(item.subNav, item.path.join("/"));
    } else {
      //console.log("key: inside", key);
      const some = ["/dashboard", userType, parent, ...item.path]
        .filter((item) => !!item)
        .join("/");
      Path.add(some);
      if (key.includes("Student")) {
        key = "Student_1/" + key;
      }
      if (key.includes("Teacher")) {
        key = "Teacher_2/" + key;
      }
      if (key.includes("Course")) {
        key = "Course_3/" + key;
      }
      Key.add(key);
    }
  });
};

export const curryingCompare = (data: SideNav[], parent: string) => {
  
}




const getDefaultKeys = (data: SideNav[]) => {
  const activePath = getActivePath();
  compare(data, ""); //Path, Key
  const path = Array.from(Path);
  const key = Array.from(Key);
  const index = path.findIndex((item) => {
    return item === activePath;
  });
  if (key[index]) {
    const defaultSelectedKeys = [key[index].split("/").pop()];
    const defaultOpenKeys = key[index].split("/").slice(0, -1);
    return { defaultSelectedKeys, defaultOpenKeys };
  }
};

function renderMenuItems(data: SideNav[], parent = ""): JSX.Element[] {
  const userType = getUserRole();
  //const userType = "manager";

  return data.map((item, index) => {
    const key = generateKey(item, index);

    if (item.subNav && !!item.subNav.length) {
      return (
        <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
          {renderMenuItems(item.subNav, item.path.join("/"))}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {!!item.path.length ||
          item.label.toLocaleLowerCase() === "overview" ||
          item.label.toLocaleLowerCase() === "message" ? (
            <Link
              href={["/dashboard", userType, parent, ...item.path]
                .filter((item) => !!item)
                .join("/")}
              replace
            >
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Menu.Item>
      );
    }
  });
}

export default function DetailLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  // const SideNav = routes.get(getUserRole())
  const sideNav = routes.get("manager");
  const menuItem = renderMenuItems(sideNav);
  //const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNav);
  const { defaultOpenKeys, defaultSelectedKeys } = getDefaultKeys(sideNav);
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
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {menuItem}
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
