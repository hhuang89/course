import React from "react";
import ReactDom from "react-dom";
import "antd/dist/antd.css";
import { Table, Space } from "antd";
import student from "../data/student.json"

export const columns = [
  {
    title: "No",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Area",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Selected Curriculum",
    dataIndex: "selected curriculum",
    key: "selected curriculum",
  },
  {
    title: "Student Type",
    dataIndex: "student type",
    key: "student type",
  },

  {
    title: "Join Time",
    dataIndex: "join time",
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

export const data = student;


export default function StudentTable() {
  return <Table columns={columns} dataSource={data} />;
}
