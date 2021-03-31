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
  Tabs,
  notification,
  Avatar,
  Row,
  Button,
  Col,
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
import BreadCrumb from "./breadcrumb";
//import { generateKey, getActiveKey } from '../lib/util';
import {
  getMessageStatistics,
  baseURL,
  getMessage,
  markAsRead,
} from "../lib/services/api-services";
import {
  MessageResponse,
  MessageStatistics,
  Message,
  MessageType,
} from "../lib/model/message";
import InfiniteScroll from "react-infinite-scroll-component";
import { MessageConsumer } from "./provider";
import { Pointer } from "highcharts";
import { getUserRole } from "../lib/services/storage";
const { Header, Sider, Content } = Layout;
import styled from "styled-components";

const TabNavContainer = styled(Tabs)`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
`;

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
  const userType = getUserRole();
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

  //if (key[index]) {
    const defaultSelectedKeys = [key[index].split("/").pop()];
    const defaultOpenKeys = key[index].split("/").slice(0, -1);

    return { defaultSelectedKeys, defaultOpenKeys };
  //}

  // const defaultSelectedKeys = '';
  //   const defaultOpenKeys = 'Overview_0';
  //   return { defaultSelectedKeys, defaultOpenKeys };
};

function renderMenuItems(data: SideNav[], parent = ""): JSX.Element[] {
  //const userType = getUserRole();
  const userType = "manager";

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

// export const getMenuConfig = (
//   data: SideNav[]
// ): { defaultSelectedKeys: string[]; defaultOpenKeys: string[] } => {
//   const key = getActiveKey(data);
//   const defaultSelectedKeys = [key.split('/').pop()];
//   const defaultOpenKeys = key.split('/').slice(0, -1);

//   return { defaultSelectedKeys, defaultOpenKeys };
// };

// function renderMenuItems(data: SideNav[], parent = ''): JSX.Element[] {
//   const userRole = getUserRole();

//   return data.map((item, index) => {
//     const key = generateKey(item, index);

//     if (item.subNav && !!item.subNav.length) {
//       return (
//         <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
//           {renderMenuItems(item.subNav, item.path.join('/'))}
//         </Menu.SubMenu>
//       );
//     } else {
      
//       return item.hide ? null : (
//         <Menu.Item key={key} title={item.label} icon={item.icon}>
//           {!!item.path.length || item.label.toLocaleLowerCase() === 'overview' ? (
//             <Link
//               href={['/dashboard', userRole, parent, ...item.path]
//                 .filter((item) => !!item)
//                 .join('/')}
//               replace
//             >
//               {item.label}
//             </Link>
//           ) : (
//             item.label
//           )}
//         </Menu.Item>
//       );
//     }
//   });
// }

interface Params {
  limit: number;
  page: number;
  type?: MessageType;
}

export const Messages = (props: {
  type: MessageType;
  scrollTarget: MessageType;
  message?: Message;
  onRead: (count: number) => void;
  cleanAll: number;
}) => {
  const [msg, setMessage] = useState<Message[]>([]);
  const [params, setParams] = useState<Params>({
    limit: 10,
    page: 1,
    type: props.type,
  });
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getMessage(params).then((res: MessageResponse) => {
      const {
        data: { total, messages: fresh },
      } = res;
      const source = [...msg, ...fresh];
      setMessage(source);

      setHasMore(source.length < total);
    });
  }, [params]);

  useEffect(() => {
    if (!!props.message && props.message.type === props.type) {
      const source = [props.message, ...msg];
      setMessage(source);
    }
  }, [props.message]);

  useEffect(() => {
    if (props.cleanAll && msg && !!msg.length) {
      const ids = msg
        .filter((item) => item.status === 0)
        .map((item) => item.id);

      if (ids.length) {
        markAsRead(ids).then((res) => {
          if (res.code) {
            setMessage(msg.map((msg) => ({ ...msg, status: 1 })));
          }
        });
      } else {
        message.warn(`All of these ${props.type}s has been marked as read!`);
      }

      if (props.onRead) {
        props.onRead(ids.length);
      }
    }
  }, [props.cleanAll]); //listen to number of clicks
  //couldn't replace with a type listener, each type has its own Message component

  return (
    <>
      <InfiniteScroll
        next={() => setParams({ ...params, page: params.page + 1 })}
        hasMore={hasMore}
        loader={<div>Loading</div>}
        dataLength={msg.length}
        style={{ overflow: "hidden" }}
        scrollableTarget={props.scrollTarget}
        endMessage={"No more message"}
      >
        <List
          dataSource={!!msg ? msg : []}
          renderItem={(item) => (
            <List.Item
              style={{ opacity: item.status ? 0.4 : 1 }}
              onClick={() => {
                if (item.status === 1) {
                  return;
                }

                markAsRead([item.id]).then((res) => {
                  if (res.data) {
                    const target = msg.find((msg) => item.id === msg.id);

                    target.status = 1;
                    setMessage([...msg]);
                  }
                });

                props.onRead(1);
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar icon={<UserOutlined />} style={{ marginTop: 10 }} />
                }
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
  const [activeType, setActiveType] = useState<MessageType>("notification");
  const [clean, setClean] = useState<{ [key in MessageType]: number }>({
    notification: 0,
    message: 0,
  });

  useEffect(() => {
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

          if (content.type === "message") {
            notification.info({
              message: `You have a message from ${content.from.nickname}`,
              description: content.content,
            });
          }

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
        trigger={["click"]}
        overlay={
          <>
            <TabNavContainer
              defaultActiveKey="notification"
              className={styles.message_tab}
              onChange={(key: MessageType) => {
                if (key !== activeType) {
                  setActiveType(key);
                }
              }}
            >
              {types.map((type) => (
                <Tabs.TabPane tab={`${type} (${state[type]})`} key={type}>
                  <div id={type} className={styles.MessageContainer}>
                    <Messages
                      type={type}
                      scrollTarget={type}
                      message={newMessage}
                      cleanAll={clean[type]}
                      onRead={(count: number) => {
                        dispatch({
                          type: "decrement",
                          payload: { type, count },
                        });
                      }}
                    />
                  </div>
                </Tabs.TabPane>
              ))}
            </TabNavContainer>
            <Footer
              justify="space-between"
              align="middle"
              className={styles.message_footer}
            >
              <Col span={12}>
                <Button
                  onClick={() =>
                    setClean({ ...clean, [activeType]: ++clean[activeType] })
                  }
                >
                  Mark all as read
                </Button>
              </Col>
              <Col span={12}>
                <Button>View history</Button>
              </Col>
            </Footer>
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

  const sideNav = routes.get(getUserRole());
  const menuItems = renderMenuItems(sideNav);
  const { defaultOpenKeys, defaultSelectedKeys } = getDefaultKeys(sideNav);


  // const sideNave = routes.get("manager");
  // const menuItems = renderMenuItems(sideNave);
  // const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNave);
  
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
          // defaultOpenKeys={defaultOpenKeys}
          // defaultSelectedKeys={defaultSelectedKeys}
        >
          {menuItems}
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

          <Row align="middle">
            <MessagePanel />
            <LogoutOutlined
              className={styles.trigger}
              style={{ float: "right" }}
              onClick={handleLogout}
            />
          </Row>
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
