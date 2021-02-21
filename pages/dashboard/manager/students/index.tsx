import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import axios from "axios";
import { formatDistance, endOfToday, format, endOfDay } from "date-fns";
import "antd/dist/antd.css";
import {
  Layout,
  Input,
  Table,
  Space,
  message,
  Pagination,
  Button,
  Modal,
  Form,
  Select,
  Popconfirm,
} from "antd";

import styles from "../../../../styles/Students.module.css";
import { ColumnType } from "antd/lib/table";
import {
  getCountry,
  getStudent,
  postAddStudent,
  searchStudent,
  deleteStudent,
  updateStudent,
} from "../../../../lib/services/api-services";
import { debounce } from "lodash";
import DetailLayout from "../../../../components/layout";
import { res } from "../../../../lib/constant/constants"
const { Search } = Input;
const { Option } = Select;

const MyPagination = ({ total, onChange, current }) => {
  return (
    <Pagination
      className={styles.pagination}
      onChange={onChange}
      total={total}
      current={current}
      pageSize={10}
    />
  );
};


export default function StudentDashboard() {
  const searchQuery = (query) => {
    searchStudent({
      query: query,
      page: paginator,
      limit: 10,
    })
      .then((res: res) => {
        const {
          data: { students, total },
        } = res;
        setStudents(students);
        setTotal(total);
      })
      .catch(() => {
        message.error("error");
      });
  };

  const onSearch = (value) => {
    searchQuery(value);
  };

  const debounceQuery = useCallback(
    debounce((nextValue) => searchQuery(nextValue), 1000),
    []
  );

  //Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const addOnclick = () => {
    setIsModalVisible(true);
    setEditingStudent(null);
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setEditingStudent(null);
  };

  //form in modal
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: {
      span: 16,
    },
  };
  const [form] = Form.useForm();
  const [countries, setCountriesInForm] = useState([]);

  const onFinish = (values) => {
    if (!!editingStudent) {
      console.log(editingStudent.id);
      updateStudent({ id: editingStudent.id, ...values })
        .then((res:res) => {

          const student = res.data;
          const index = students.findIndex((item) => item.id === student.id);
          let updatedStudentList = students;
          updatedStudentList[index] = student;
          setStudents([...updatedStudentList]);

          message.success("updated");
          setIsModalVisible(false);
        })
        .catch(() => {
          message.error("unsuccessfully update");
        });
    } else {
      postAddStudent(values)
        .then((res:res) => {
          const { data } = res;
          if (data) {
            const updatedData = [...students, data];
            setStudents(updatedData);
            setTotal(total + 1);
            message.success("add successfully");
            setIsModalVisible(false);
          }
        })
        .catch(() => {
          message.error("Unsuccessfully, Please try again");
        });
    }
  };

  //table
  const [students, setStudents] = useState([]);
  const [paginator, setPaginator] = useState(1);
  const [total, setTotal] = useState(0);
  const [country, setCountries] = useState([]);

  const [editingStudent, setEditingStudent] = useState(null);

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
      render: (value, record) => (
        <Link href={`/dashboard/manager/students/${record.id}`}>
          {record.name}
        </Link>
      ),
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
      render: (value, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setEditingStudent(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </a>

          <Popconfirm
            title="Are you sure to delete this task?"
            placement="topRight"
            onConfirm={() => {
              deleteStudent(record.id)
                .then((res:res) => {
                  const { data } = res;
                  if (data) {
                    const index = students.findIndex(
                      (student) => student.id === record.id
                    );
                    const updatedData = [...students];
                    updatedData.splice(index, 1);
                    setStudents(updatedData);
                    setTotal(total - 1);
                  }
                  message.success("Delete Successfully");
                })
                .catch(() => {
                  message.error("Unsuccessfully, Please try again");
                });
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  let set = new Set<string>();
  const table_countries = [];
  useEffect(() => {
    getStudent({ page: paginator, limit: 10 })
      .then((res:res) => {
        const {
          data: { students, total },
        } = res;
        setStudents(students);
        students.forEach((student) => {
          set.add(student.country);
        });
        const iters: any = set.entries();
        for (const iter of iters) {
          table_countries.push({
            text: iter[0],
            value: iter[1],
          });
        }

        setCountries(table_countries);
        setTotal(total);
      })
      .catch((err) => {
        console.log(err);
        message.error("cannot catch student");
      });
  }, [paginator]);

  const form_countries = [];
  useEffect(() => {
    getCountry({})
      .then((res:res) => {
        res.data.map((data) => {
          form_countries.push(data.en);
          setCountriesInForm(form_countries);
        });
      })
      .catch(() => {
        message.error("cannot catch countries");
      });
  }, []);

  useEffect(() => {
    form.resetFields();
  });

  return (
    <DetailLayout>
      {/* <div className={styles.FlexContainer}>
        <Content
          className={styles.site_layout_content}
          style={{
            margin: "0 16px",
            padding: 20,
            minHeight: 280,
          }}
        > */}
          <Button className={styles.add_button} onClick={addOnclick}>
            + ADD
          </Button>

          <Modal
            title={!!editingStudent ? "Edit Student" : "Add Student"}
            visible={isModalVisible}
            centered
            onOk={form.submit}
            onCancel={handleCancel}
            okText={!!editingStudent ? "Update" : "Add"}
          >
            <Form
              name="Add/Update"
              id="changeStudent"
              onFinish={onFinish}
              form={form}
              {...layout}
              initialValues={{
                name: editingStudent?.name,
                email: editingStudent?.email,
                area: editingStudent?.country,
                type: editingStudent?.type.id,
              }}
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
                    required: true,
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
            onChange={(event) => debounceQuery(event.target.value)}
          />
          <Table
            columns={columns}
            dataSource={students}
            pagination={false}
            rowKey="id"
          />
          <MyPagination
            total={total}
            current={paginator}
            onChange={setPaginator}
          />
        {/* </Content>
      </div> */}
    </DetailLayout>
  );
}
