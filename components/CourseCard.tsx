import { Card, Row, Col } from "antd";
import { CardProps } from 'antd/lib/card';
import { HeartFilled, UserOutlined } from "@ant-design/icons";
import { Gutter } from "antd/lib/grid/row";
import Link from "next/link";
import styles from "../styles//Courses.module.css";
import { Course } from "../lib/model/course"


export default function CourseCard(props: React.PropsWithChildren<Course> & { cardProps?: CardProps }) {
  const gutter: [Gutter, Gutter] = [6, 16];

  const getDuration = (duration: number): string => {
    const result = duration > 1 ? duration + " years" : duration + " year";
    return result;
  };

  return (
    <Card cover={<img alt="courseCover" src={props.cover}/>} {...props.cardProps}>
      <Row style={{ fontWeight: "bold" }} gutter={gutter}>
        {props.name}
      </Row>

      <Row gutter={gutter} className={styles.CardRow} justify="space-between">
        <Col>{props.createdAt}</Col>
        <Col style={{ fontWeight: "bold" }}>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: "red" }} />
          {props.star}
        </Col>
      </Row>

      <Row gutter={gutter} className={styles.CardRow} justify="space-between">
        <Col>Duration:</Col>
        <Col style={{ fontWeight: "bold" }}>{getDuration(props.duration)}</Col>
      </Row>

      <Row gutter={gutter} className={styles.CardRow} justify="space-between">
        <Col flex={20}>Teacher:</Col>
        <Col flex={1} style={{ fontWeight: "bold", textAlign: "right"}}>
          {props?.teacherName && <Link href="/">{props.teacherName}</Link>}
        </Col>
      </Row>

      <Row gutter={gutter} wrap={false} justify="space-between">
        <Col>
          <UserOutlined
            style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }}
          />
          Student Limit:
        </Col>
        <Col style={{ fontWeight: "bold" }}>{props.maxStudents}</Col>
      </Row>

      {props.children}
    </Card>
  );
}
