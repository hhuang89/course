import { message, Row, Col, Card, Avatar, Progress, Typography } from "antd";
import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import DetailLayout from "../../../components/layout";
import { getOverview } from "../../../lib/services/api-services";
import { OverviewResponse } from "../../../lib/model/overview";
import styles from "../../../styles/Overview.module.css";

const CalculatePercent = (data) => {
  const lastMonthAddedPercent = +parseFloat(
    String((data.lastMonthAdded / data.total) * 100)
  ).toFixed(1);

  return lastMonthAddedPercent;
};

export default function Manager() {
  const { Meta } = Card;
  const { Title } = Typography;
  const [overview, setOverview] = useState<OverviewResponse>(null);

  useEffect(() => {
    getOverview("")
      .then((res: any) => {
        const { data } = res;
        setOverview(data);
      })
      .catch((err) => message.error(err));
  });

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
                    color: "#fde3cf",
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
                  icon={<SolutionOutlined />}
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
                  icon={<SolutionOutlined />}
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
    </DetailLayout>
  );
}
