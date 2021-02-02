import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import https from "https";
import "antd/dist/antd.css";
import { Table, Space, message, Pagination } from "antd";
import student from "../data/student.json";
import axios from "axios";
import { useTheme } from "styled-components";
import { formatDistance, endOfToday, format, endOfDay } from "date-fns";
import StudentDashboard from "../pages/dashboard/manager/students";



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

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [paginator, setPaginator] = useState(1);
  const [total, setTotal] = useState(0);
  const [country, setCountries] = useState([]);
  const table_countries = []

  const columns = [
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
      sortDirections: ['ascend', 'descend'],
      sorter: (pre, next) => {
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
      filters: country
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
    axios
      .get("https://cms.chtoma.com/api/students", {
        params: {
          page: paginator,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      })
      .then((result) => {
        const {
          data: { paginator, students, total },
        } = result.data;
        setStudents(students);
        
        students.forEach(student => {
          student.country
          table_countries.push({text: student.country, value: student.country})
        });
        setCountries(table_countries)
        console.log(country)
        //setPaginator(paginator)
        setTotal(total);
      })
      .catch(() => {
        message.error("error");
      });
  }, [paginator]);

  useEffect(() => {
    axios.get("https://cms.chtoma.com/api/countries").then((result) => {
      const { data } = result.data;
      // console.log(result.data.data);
      const countries = [];
      data.map((country)=>{
        countries.push(country.en)
      })
      //console.log(countries);
      localStorage.setItem("country", JSON.stringify(countries));
    });
  }, []);

  return (
    <>
      <Table
        columns={columns}
        dataSource={students}
        pagination={false}
        rowKey="id"
        filteredValue={table_countries}
      />
      <MyPagination total={total} current={paginator} onChange={setPaginator}/>
    </>
  );
}



