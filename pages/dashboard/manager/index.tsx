import { message, Row, Col, Card, Avatar, Progress, Typography } from "antd";
import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import DetailLayout from "../../../components/layout";
import { getOverview, getStatisticsStudent, getStatisticsTeacher, getStatisticsCourse } from "../../../lib/services/api-services";
import { OverviewResponse, StudentStatistics, TeacherStatistics, CourseStatistics, Statistic, Skills } from "../../../lib/model/overview";
import styles from "../../../styles/Overview.module.css";
import { gutter, Role } from "../../../lib/constant";
import LineChart from "../../../components/line";
import BarChart from "../../../components/bar";

const CalculatePercent = (data) => {
  const lastMonthAddedPercent = +parseFloat(
    String((data?.lastMonthAdded / data?.total) * 100)
  ).toFixed(1);

  return lastMonthAddedPercent;
};


export default function Manager() {
  const { Meta } = Card;
  const { Title } = Typography;
  const [overview, setOverview] = useState<OverviewResponse>(null);
  const [studentStatistics, setStudentStatistics] = useState<StudentStatistics>(null);
  const [teacherStatistics, setTeacherStatistics] = useState<TeacherStatistics>(null);
  const [courseStatistics, setCourseStatistics] = useState<CourseStatistics>(null);
  
  useEffect(() => {
    getOverview("")
      .then((res: any) => {
        const { data } = res;
        setOverview(data);
      })
      .catch((err) => message.error(err));

    getStatisticsStudent("")
    .then((res: any) => {
      const { data } = res;
      setStudentStatistics(data);
    })

    getStatisticsTeacher("")
    .then((res: any) => {
      const { data } = res;
      setTeacherStatistics(data);
    })
    
    getStatisticsCourse("")
    .then((res: any) => {
      const { data } = res;
      setCourseStatistics(data);
    })
  },[]);

  return (
    <DetailLayout>
      {/*need to improve*/}
      <Row align="middle" gutter={[24, 16]}>
        <Col span={8}>
          <Card style={{ background: "#1890ff", borderRadius: "5px" }}>
            <Meta
              avatar={
                <Avatar
                  style={{
                    marginTop: 25,
                    color: "rgb(153, 153, 153)",
                    backgroundColor: "#fff",
                  }}
                  size={80}
                  icon={<SolutionOutlined />}
                />
              }
              title={
                <Title style={{ color: "#fff" }} level={5}>
                  {"TOTAL STUDENTS"}
                </Title>
              }
              description={
                <>
                  <Row className={styles.Number}>{overview?.student.total}</Row>
                  <Progress
                    style={{ color: "#fff" }}
                    percent={100 - CalculatePercent(overview?.student)}
                    size="small"
                    showInfo={false}
                    strokeColor="white"
                    trailColor="lightgreen"
                  />
                  <p style={{ color: "#fff" }}>{`${
                    CalculatePercent(overview?.student) + "%"
                  } Increase in 30 Days`}</p>
                </>
              }
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card style={{ background: "#673bb7", borderRadius: "5px" }}>
            <Meta
              avatar={
                <Avatar
                  style={{
                    marginTop: 25,
                    color: "#fde3cf",
                    backgroundColor: "#fff",
                  }}
                  size={80}
                  icon={<DeploymentUnitOutlined />}
                />
              }
              title={
                <Title style={{ color: "#fff" }} level={5}>
                  {"TOTAL TEACHERS"}
                </Title>
              }
              description={
                <>
                  <Row className={styles.Number}>{overview?.teacher.total}</Row>
                  <Progress
                    style={{ color: "#fff" }}
                    percent={100 - CalculatePercent(overview?.teacher)}
                    size="small"
                    showInfo={false}
                    strokeColor="white"
                    trailColor="lightgreen"
                  />
                  <p style={{ color: "#fff" }}>{`${
                    CalculatePercent(overview?.teacher) + "%"
                  } Increase in 30 Days`}</p>
                </>
              }
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card style={{ background: "#ffaa16", borderRadius: "5px" }}>
            <Meta
              avatar={
                <Avatar
                  style={{
                    marginTop: 25,
                    color: "#fde3cf",
                    backgroundColor: "#fff",
                  }}
                  size={80}
                  icon={<ReadOutlined />}
                />
              }
              title={
                <Title style={{ color: "#fff" }} level={5}>
                  {"TOTAL COURSES"}
                </Title>
              }
              description={
                <>
                  <Row className={styles.Number}>{overview?.course.total}</Row>
                  <Progress
                    style={{ color: "#fff" }}
                    percent={100 - CalculatePercent(overview?.course)}
                    size="small"
                    showInfo={false}
                    strokeColor="white"
                    trailColor="lightgreen"
                  />
                  <p style={{ color: "#fff" }}>{`${
                    CalculatePercent(overview?.course) + "%"
                  } Increase in 30 Days`}</p>
                </>
              }
            />
          </Card>
        </Col>
      </Row>


      <Row gutter={gutter}>
        <Col span={12}>
          <Card title="Increment">
            <LineChart
              data={{
                [Role.student]: studentStatistics?.createdAt as Statistic[],
                [Role.teacher]: teacherStatistics?.createdAt as Statistic[],
                course: courseStatistics?.createdAt as Statistic[],
              }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Languages">
            <BarChart
              data={{
                interest: studentStatistics?.interest as Statistic[],
                teacher: teacherStatistics?.skills as Skills,
              }}
            />
          </Card>
        </Col>
      </Row>
    </DetailLayout>
  );
}
