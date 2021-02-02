import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import axios from "axios";
import { formatDistance, endOfToday, format, endOfDay } from "date-fns";
import "antd/dist/antd.css";
import {
  Layout,
  Menu,
  Input,
  Table,
  Space,
  message,
  Pagination,
  Button,
  Modal,
  Form,
  Select,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  SelectOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "../../../styles/Students.module.css";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { getCountry, getStudent} from "../../../lib/services/api-services"

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const MyPagination = ({ total, onChange, current }) => {
  return (
    <Pagination
      onChange={onChange}
      total={total}
      current={current}
      pageSize={10}
    />
  );
};

export default function StudentDashboard() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const onSearch = (value) => {
    axios
      .get("https://cms.chtoma.com/api/students", {
        params: {
          query: value,
          page: paginator,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      })
      .then((result) => {
        const {
          data: { students, total },
        } = result.data;
        setStudents(students);
        setTotal(total);
      })
      .catch((error) => {
        message.error(error)
      });
  };

  //Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const addOnclick = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    form.submit;
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  //form in modal
  const layout = {
    labelCol: {span: 8},
    wrapperCol: {
      span: 16
    }
  };
  const [form] = Form.useForm();
  const [countries, setCountriesInForm] = useState([]);
  const onFinish = useCallback((values) => {
    let email = ""
    if(values.email !== undefined) {
      email = values.email
    }
    axios
      .post("https://cms.chtoma.com/api/students", {
        name: values.name,
        country: values.area,
        email: email,
        type: values.type
      }, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        }
      })
      .then((result) => {
        message.success("add successfully")
      })
      .catch(()=>message.error("invalid username or password"));
  },[]);

  //logout
  const router = useRouter();
  const handleLogout = () => {
    axios
    .post("https://cms.chtoma.com/api/logout",{}, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      }
    })
    .then((result) => {
      message.success("successfully")
      router.push("/login")
    })
    .catch(()=>message.error("error"));
    //localStorage.removeItem("token")
    
  }

  //table
  const [students, setStudents] = useState([]);
  const [paginator, setPaginator] = useState(1);
  const [total, setTotal] = useState(0);
  const [country, setCountries] = useState([]);
  const table_countries = [];

  const columns: ColumnType<any>[] = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sortDirections: ["ascend", "descend"],
      sorter: (pre: { name: string }, next: { name: string }) => {
        const preCode = pre.name.charCodeAt(0);
        const nextCode = next.name.charCodeAt(0);

        return preCode > nextCode ? 1 : preCode === nextCode ? 0 : -1;
      },
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Area",
      dataIndex: "country",
      key: "country",
      filters: country,
      onFilter: (value, record) => record.country.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "courses",
      render: (courses) => {
        return courses.map((course) => course.name).join(", ");
      },
      key: "selected curriculum",
    },
    {
      title: "Student Type",
      dataIndex: ["type", "name"],
      key: "studentType",
      filters: [
        {
          text: "developer",
          value: "developer",
        },
        {
          text: "tester",
          value: "tester",
        },
      ],
      onFilter: (value, record) => record.type.name === value,
    },

    {
      title: "Join Time",
      dataIndex: "createdAt",
      render: (createdAt) => {
        return formatDistance(new Date(createdAt), endOfDay(new Date()));
      },
      key: "join time",
    },

    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const students = getStudent("https://cms.chtoma.com/api/students", {page: paginator, limit: 10})
    console.log(students)
    // setStudents(students);
    // setTotal(total);
    // setCountries(country);

    // axios
    //   .get("https://cms.chtoma.com/api/students", {
    //     params: {
    //       page: paginator,
    //       limit: 10,
    //     },
    //     headers: {
    //       Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
    //     },
    //   })
    //   .then((result) => {
    //     const {
    //       data: { paginator, students, total },
    //     } = result.data;
    //     setStudents(students);

    //     students.forEach((student) => {
    //       student.country;
    //       table_countries.push({
    //         text: student.country,
    //         value: student.country,
    //       });
    //     });
    //     setCountries(table_countries);
    //     setTotal(total);
    //   })
    //   .catch(() => {
    //     message.error("error");
    //   });

  }, [paginator]);

  useEffect(() => {
    const form_countries = getCountry("https://cms.chtoma.com/api/countries", {});
    // axios.get("https://cms.chtoma.com/api/countries").then((result) => {
    //   const { data } = result.data;
    //   data.map((data) => {
    //     form_countries.push(data.en);
    //   });
    //   setCountriesInForm(form_countries);
    // });
    
    setCountriesInForm(form_countries)
  }, []);

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

          {/* <Link href="/login"> */}
            <LogoutOutlined
              className={styles.trigger}
              style={{ float: "right" }}
              onClick={handleLogout}
            />
          {/* </Link> */}
        </Header>
        <Content
          className={styles.site_layout_content}
          style={{
            margin: "0 16px",
            padding: 20,
            minHeight: 280,
          }}
        >
          <Button className={styles.add_button} onClick={addOnclick}>
            + ADD
          </Button>

          <Modal
            title="Add Student"
            visible={isModalVisible}
            centered
            onOk={form.submit}
            onCancel={handleCancel}
            okText={"Add"}
          >
            <Form
              name="Add/Update"
              id="changeStudent"
              onFinish={onFinish}
              form={form}
              {...layout}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please input student name!" },
                ]}
              >
                <Input placeholder="student name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    type: "email",
                    message: "Please fill in correct email",
                  },
                ]}
              >
                <Input placeholder="email" />
              </Form.Item>

              <Form.Item
                label="Area"
                name="area"
                rules={[
                  {
                    required: true,
                    message: "Please Choose area",
                  },
                ]}
              >
                <Select allowClear>
                  {countries.map((data, index) => (
                    <Option value={data} key={index}>
                      {data}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Student Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please Choose Student Type",
                  },
                ]}
              >
                <Select allowClear>
                  <Option value={1}>Tester</Option>
                  <Option value={2}>Developer</Option>
                </Select>
              </Form.Item>
             
            </Form>
          </Modal>

          <Search
            className={styles.search_bar}
            placeholder="Search by name"
            style={{ width: 200 }}
            onSearch={onSearch}
          />
          <Table
            columns={columns}
            dataSource={students}
            pagination={false}
            rowKey="id"
            // filteredValue={table_countries}
          />
          <MyPagination
            total={total}
            current={paginator}
            onChange={setPaginator}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
