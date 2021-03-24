import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import "antd/dist/antd.css";
import {
  Badge,
  Dropdown,
  Layout,
  Menu,
  message,
  List,
  Typography,
  Tabs,
  notification,
  Avatar,
  Row,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import styles from "../styles/Students.module.css";
import axios from "axios";
import { SideNav, routes } from "../lib/constant/routes";
import { getUserRole } from "../lib/services/storage";
import BreadCrumb from "./breadcrumb";
import {
  getMessageStatistics,
  baseURL,
  getMessage,
} from "../lib/services/api-services";
import {
  MessageResponse,
  MessageStatistics,
  Message,
  MessageType,
} from "../lib/model/message";
import InfiniteScroll from "react-infinite-scroll-component";
import { MessageConsumer } from "./provider";
const { Header, Sider, Content } = Layout;

export const generateKey = (data: SideNav, index: number): string => {
  return `${data.label}_${index}`;
};

export const generatePath = (data: SideNav): string => {
  return data.path[0];
};

export const getActivePath = () => {
  const router = useRouter();
  //can also achieved by using filter
  const activePath = router.pathname.split("/").reduce((acc, cur) => {
    if (cur === "[id]") {
      // be really careful here, only detail page has [id]
      return acc;
    } else {
      return acc + (acc === "/" ? "" : "/") + cur;
    }
  }, "");

  return activePath;
};

//fn generate path or key (input type) => output type
export const curryingGeneratePath = (
  fn: (data: SideNav, index: number) => string
) =>
  function GeneratePath(data: SideNav[], parent = ""): string[][] {
    const Path = data.map((item, index) => {
      let path = fn(item, index);
      if (item.subNav && !!item.subNav.length) {
        return GeneratePath(item.subNav, path).map((item: string[]) => item[0]);
      } else {
        return [path];
      }
    });
    return Path;
  };

export const curryingGenerateKey = (
  fn: (data: SideNav, index: number) => string
) =>
  function GenerateKey(data: SideNav[], parent = ""): string[][] {
    const Key = data.map((item, index) => {
      let key = fn(item, index);
      if (parent) {
        key = [parent, key].join("/");
      }

      if (item.subNav && !!item.subNav.length) {
        return GenerateKey(item.subNav, key).map((item: string[]) =>
          item.join("/")
        );
      } else {
        return [key];
      }
    });
    return Key;
  };

export const getDefaultKeys = (data: SideNav[]) => {
  const activePath = getActivePath(); // /dashboard/manager/page
  const userType = "manager";
  const getPath = curryingGeneratePath(generatePath);
  const path = getPath(data)
    .reduce((acc, cur) => [...acc, ...cur], []) //convert [][] to []
    .map((item) =>
      ["/dashboard", userType, item].filter((item) => !!item).join("/")
    );
  const index = path.findIndex((item) => {
    return item === activePath;
  });
  const getKey = curryingGenerateKey(generateKey);
  const key = getKey(data).reduce((acc, cur) => [...acc, ...cur], []);

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

interface Params {
  limit: number;
  page: number;
  type?: MessageType;
}

export const Messages = (props: { type: MessageType }) => {
  const [message, setMessage] = useState<Message[]>([]);
  const [params, setParams] = useState<Params>({
    limit: 10,
    page: 1,
    type: props.type,
  });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getMessage(params).then((res: MessageResponse) => {
      //const fresh = res.data.messages;
      const {
        data: { total, messages: fresh },
      } = res;
      const source = [...message, ...fresh];
      setMessage(source);

      setHasMore(source.length < total);
    });
  }, [params]);

  return (
    <>
      <InfiniteScroll
        next={() => setParams({ ...params, page: params.page + 1 })}
        hasMore={hasMore}
        loader={<div>Loading</div>}
        dataLength={message.length}
        style={{ overflow: "hidden" }}
        scrollableTarget={"notification"}
      >
        <List
          dataSource={!!message ? message : []}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.from.nickname}
                description={
                  <>
                    <Row>{item.content}</Row>
                    <Row>
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </Row>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  );
};

export const MessagePanel = () => {
  const [
    messageStatistics,
    setMessageStatistics,
  ] = useState<MessageStatistics>();
  const [newMessage, setNewMessage] = useState<Message>(null);
  const { state, dispatch } = MessageConsumer();
  const types: MessageType[] = ["notification", "message"] as MessageType[];

  const userInfo = useEffect(() => {
    getMessageStatistics().then((res: MessageResponse) => {
      setMessageStatistics(res.data);

      if (!!res.data) {
        const {
          receive: { notification, message },
        } = res.data;

        dispatch({
          type: "increment",
          payload: { type: "notification", count: notification.unread },
        });
        dispatch({
          type: "increment",
          payload: { type: "message", count: message.unread },
        });
      }
    });

    const sse = new EventSource(`${baseURL}message/subscribe?userId=${3}`, {
      withCredentials: true,
    });

    sse.onmessage = (event) => {
      let { data } = event;
      data = JSON.parse(data || {});

      if (data.type !== "heartbeat") {
        if (data.content) {
          const content = data.content as Message;
          setNewMessage(content);
          dispatch({
            type: "increment",
            payload: { type: content.type, count: 1 },
          });
        }
      }
    };

    return () => {
      () => sse.close();
      dispatch({ type: "reset" });
    };
  }, []);

  const data = [
    "Racing car sprays burning fuel into crowd.",
    "Japanese princess to wed commoner.",
    "Australian walks 100km after outback crash.",
    "Man charged over missing wedding girl.",
    "Los Angeles battles huge wildfires.",
  ];

  //global store
  return (
    <Badge
      size={"small"}
      count={state.total}
      overflowCount={99}
      offset={[10, 0]}
    >
      <Dropdown
        overlayStyle={{
          background: "#fff",
          borderRadius: 4,
          width: 400,
          height: 500,
          overflow: "hidden",
        }}
        trigger={['click']}
        overlay={
          <>
            <Tabs defaultActiveKey="notification">
              {types.map((type) => (
                <Tabs.TabPane tab={`${type} (${state[type]})`} key={type}>
                  <Messages type={type} />
                </Tabs.TabPane>
              ))}
            </Tabs>
            <Layout.Footer>
              <div>Mark all</div>
            </Layout.Footer>
          </>
        }
      >
        <BellOutlined style={{ color: "#fff", fontSize: 24, marginTop: 5 }} />
      </Dropdown>
    </Badge>
  );
};

export default function DetailLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  // const SideNav = routes.get(getUserRole())
  const sideNav = routes.get("manager");
  const menuItem = renderMenuItems(sideNav);
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
          <MessagePanel />
          <LogoutOutlined
            className={styles.trigger}
            style={{ float: "right" }}
            onClick={handleLogout}
          />
        </Header>
        <BreadCrumb />
        <div className={styles.FlexContainer}>
          <Content
            className={styles.site_layout_content}
            style={{
              margin: "0 16px",
              padding: 20,
              minHeight: 280,
              width: 100,
            }}
          >
            {children}
          </Content>
        </div>
      </Layout>
    </Layout>
  );
}
