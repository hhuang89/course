import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Link from "next/link";
import DetailLayout from "../../../../components/layout";
import { Card, Col, Row, Avatar, message, Tag } from "antd";
import Table, { ColumnType } from "antd/lib/table";
import styles from "../../../../styles/Students.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { getStudentById } from "../../../../lib/services/api-services";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;
  return {
    props: { id }, // will be passed to the page component as props
  };
};

interface Student {
  createdAt: string;
  updatedAt: string;
  id: number;
  email: string;
  name: string;
  country: string;
  profileId: number;
  address?: any;
  age: number;
  avatar: string;
  description: string;
  education: string;
  gender: number;
  memberEndAt: string;
  memberStartAt: string;
  phone: string;
  type: Type;
  courses: Course[];
  interest: string[];
}

interface Course {
  createdAt: string;
  updatedAt: string;
  id: number;
  courseDate: string;
  studentId: number;
  name: string;
  courseId: number;
  type: Type[];
}

interface Type {
  id: number;
  name: string;
}

const tagColor: string[] = [
  "magenta",
  "volcano",
  "orange",
  "gold",
  "green",
  "cyan",
  "geekblue",
  "purple",
  "red",
  "lime",
];

export default function Page({ id }) {
  const router = useRouter();
  const [student, setStudent] = useState<Student>(null);
  const [courses, setCourses] = useState([]);
  const [info, setInfo] = useState([]);
  const [about, setAbout] = useState([]);
  useEffect(() => {
    getStudentById(id)
      .then((res) => {
        console.log(res);

        const student = res.data;
        const courses = student.courses;
        const info = [
          { label: "Name", value: student.name },
          { label: "Age", value: student.age },
          { label: "Email", value: student.email },
          { label: "Phone", value: student.phone },
        ];
        const about = [
          { label: "Eduction", value: student.education },
          { label: "Area", value: student.country },
          { label: "Gender", value: student.gender === 1 ? "Male" : "Female" },
          {
            label: "Member Period",
            value: student.memberStartAt + " - " + student.memberEndAt,
          },
          { label: "Type", value: student.type.name },
          { label: "Create Time", value: student.createdAt },
          { label: "Update Time", value: student.updatedAt },
        ];
        setStudent(student);
        setCourses(courses);
        setInfo(info);
        setAbout(about);
      })
      .catch(() => {
        message.error("CANNOT INITIALISE PAGE");
      });
  }, []);
  console.log();

  const columns: ColumnType<any>[] = [
    {
      title: "No",
      dataIndex: "id",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      //change later
      render: (value, record) => (
        <Link href={`/dashboard/manager/students/${record.id}`}>
          {record.name}
        </Link>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => {
        return type.map((item) => item.name).join(",");
      },
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
    },
  ];

  const tabList = [
    {
      key: "About",
      tab: "About",
    },
    {
      key: "Courses",
      tab: "Courses",
    },
  ];

  const contentList = {
    About: (
      <>
        <br />
        <h2 className={styles.h2}>Infomation</h2>
        <Row gutter={[6, 16]}>
          {about.map((item) => (
            <Col span={24} key={item.label}>
              <b
                style={{
                  marginRight: 16,
                  minWidth: 150,
                  display: "inline-block",
                }}
              >
                {item.label}:
              </b>
              <span>{item.value}</span>
            </Col>
          ))}
        </Row>

        <br />
        <h2 className={styles.h2}>Interesting</h2>
        <Row gutter={[6, 16]}>
          <Col>
            {student?.interest.map((item, index) => (
              <Tag
                color={tagColor[index]}
                key={item}
                style={{ padding: "5px 10px" }}
              >
                {item}
              </Tag>
            ))}
          </Col>
        </Row>

        <br />
        <h2 className={styles.h2}>Description</h2>
        <Row gutter={[6, 16]}>
          <Col style={{ lineHeight: 2 }}>{student?.description}</Col>
        </Row>
      </>
    ),
    Courses: <Table dataSource={courses} columns={columns} rowKey="id" />,
  };

  const [key, setKey] = useState("About");
  const onTabChange = (key) => {
    setKey(key);
  };
  return (
    <DetailLayout>
      <div className={styles.site_card_wrapper}>
        <Row gutter={6}>
          <Col span={8}>
            <Card
              title={
                <Avatar
                  src={student?.avatar}
                  style={{
                    width: 100,
                    height: 100,
                    display: "block",
                    margin: "auto",
                  }}
                />
              }
            >
              <Row gutter={[6, 16]}>
                {info.map((item) => (
                  <Col
                    span={12}
                    key={item.label}
                    style={{ textAlign: "center" }}
                  >
                    <b>{item.label}</b>
                    <p>{item.value}</p>
                  </Col>
                ))}
              </Row>
              <Row gutter={[6, 16]}>
                <Col span={24} style={{ textAlign: "center" }}>
                  <b>Address</b>
                  <p>{student?.address}</p>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={16}>
            <Card
              className={styles.tab}
              // style={{ width: "100%" }}
              tabList={tabList}
              activeTabKey={key}
              onTabChange={(key) => {
                onTabChange(key);
              }}
            >
              {contentList[key]}
            </Card>
          </Col>
        </Row>
      </div>
    </DetailLayout>
  );
}
