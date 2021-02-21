import DetailLayout from "../../../../components/layout";
import { List, Card, BackTop, message, Row, Col, Button } from "antd";
import { HeartFilled, UserOutlined } from "@ant-design/icons";
import { Gutter } from "antd/lib/grid/row";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getCourses } from "../../../../lib/services/api-services";
import { res } from "../../../../lib/constant/constants";
import styles from "../../../../styles/Courses.module.css";

const getDuration = (duration: number): string => {
  const result = duration > 1 ? duration + " years" : duration + " year";
  return result;
}
export default function Course() {
  const gutter: [Gutter, Gutter] = [6, 16];

  const [courses, setCourses] = useState([]);
  const [paginator, setPaginator] = useState({ limit: 20, page: 1 });
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // useEffect(() => {
  //   getCourses(paginator)
  //     .then((res: res) => {
  //       setCourses([...courses, ...res.data.courses]);
  //       setTotal(res.data.total);
  //       setHasMore(courses.length < total)

  //       console.log("????????", courses.length, total);
  //     })
  //     .catch((err) => message.error(err));
  // }, [paginator]);

  useEffect(() => {
    getCourses(paginator).then((res: res) => {
      const {
        data: { total, courses: fresh },
      } = res;
      const source = [...courses, ...fresh];

      setCourses(source);
      setHasMore(total > source.length);
    });
  }, [paginator]);

  return (
    <DetailLayout>
      <InfiniteScroll
        next={()=>setPaginator({...paginator, page: paginator.page + 1})}
        hasMore={hasMore}
        loader={<b>Loading</b>}
        dataLength={courses.length}
        endMessage={<b>No More Course!</b>}
        style={{ overflow: 'hidden' }}
      >
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={courses}
        renderItem={(item) => (
          <List.Item>
            <Card cover={<img alt="courseCover" src={item.cover} />}>
              <Row style={{ fontWeight: "bold" }} gutter={gutter}>
                {item.name}
              </Row>

              <Row gutter={gutter} className={styles.CardRow}>
                <Col>{item.createdAt}</Col>
                <Col style={{ fontWeight: "bold" }}>
                  <HeartFilled
                    style={{ marginRight: 5, fontSize: 16, color: "red" }}
                  />
                  {item.star}
                </Col>
              </Row>

              <Row gutter={gutter} className={styles.CardRow} justify="space-between">
                <Col>Duration:</Col>
                <Col style={{ fontWeight: "bold" }}>{getDuration(item.duration)}</Col>
              </Row>

              <Row gutter={gutter} className={styles.CardRow} justify="space-between">
                <Col flex={3}>Teacher:</Col>
                <Col flex={2} style={{ fontWeight: "bold" }}>
                  <Link href={"/"}>{item.teacherName}</Link>
                </Col>
              </Row>

              <Row gutter={gutter} justify="space-between">
                <Col>
                  <UserOutlined
                    style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }}
                  />
                  Student Limit:
                </Col>
                <Col style={{ fontWeight: "bold" }}>{item.maxStudents}</Col>
              </Row>

              <Link href={`/dashboard/manager/courses/${item.id}`} passHref>
                <Button type="primary">Read More</Button>
              </Link>
            </Card>
          </List.Item>
        )}
      />
      </InfiniteScroll>

      <BackTop />
    </DetailLayout>
  );
}
