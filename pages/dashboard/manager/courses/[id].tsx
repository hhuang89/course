import { Card, Row, Col, message, Tag, Badge, Steps, Collapse } from "antd";
import { useEffect, useState } from "react";
import DetailLayout from "../../../../components/layout";
import { getCourseById } from "../../../../lib/services/api-services";
import { useRouter } from "next/router";
import CourseCard from "../../../../components/CourseCard";
import WeekCalendar from "../../../../components/WeekCalendar"
import styles from "../../../../styles/Courses.module.css";
import { Schedule, GetCourseByIdResponse, Course, Sales } from "../../../../lib/model/course"

enum CourseStatus {
  'warning',
  'success',
  'default',
}

enum CourseStatusColor {
  'default',
  'green',
  'orange',
}

enum CourseStatusText {
  'finished',
  'processing',
  'pending',
}



export async function getServerSideProps(context) {
  const { id } = context.params;
  return {
    props: { id: id },
  };
}

const getChapterExtra = (source: Schedule, index: number) => {
  const activeIndex = source.chapters.findIndex((item) => item.id === source.current);
  const status = index === activeIndex ? 1 : index < activeIndex ? 0 : 2;

  return <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>;
};

export default function Page(props: { id: number }) {
  const router = useRouter();
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>(
    []
  );
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [data, setData] = useState<Course>(null);

  useEffect(() => {
    getCourseById({ id: props.id })
      .then((res: GetCourseByIdResponse) => {
        const data = res.data;

        if (data) {
          const sales: Sales = data.sales;
          const info = [
            { label: "Price", value: sales.price },
            { label: "Batches", value: sales.batches },
            { label: "Students", value: sales.studentAmount },
            { label: "Earings", value: sales.earnings },
          ];

          setInfo(info);
          setActiveChapterIndex(
            data.schedule.chapters.findIndex(
              (item) => item.id === data.schedule.current
            )
          );
          setData(data);
        }
      })
      .catch((err) => message.error(err));
  }, []);

  return (
    <DetailLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <CourseCard {...data} cardProps={{ bodyStyle: { paddingBottom: 0 } }}>
            <Row
              className={styles.IdCardRow}
              gutter={[6, 16]}
              justify="space-between"
              align="middle"
            >
              {info.map((item, index) => (
                <Col span="6" key={index} className={styles.IdCardCol}>
                  <b>{item.value}</b>
                  <p>{item.label}</p>
                </Col>
              ))}
            </Row>
          </CourseCard>
        </Col>

        <Col offset={1} span={15}>
          <Card>
            <div className={styles.IdTitle}>Course Detail</div>
            <h3 className={styles.H3}>Create Time</h3>
            <Row>{data?.createdAt}</Row>
            <h3 className={styles.H3}>Start Time</h3>
            <Row>{data?.startTime}</Row>
            <Badge status={CourseStatus[data?.status] as any} offset={[5, 24]}>
              <h3 className={styles.H3}>Status</h3>
            </Badge>
            <Row className={styles.StepsRow}>
              <Steps size="small" current={activeChapterIndex} style={{ width: 'auto' }}>
                {data?.schedule.chapters.map((item) => (
                  <Steps.Step title={item.name} key={item.id}></Steps.Step>
                ))}
              </Steps>
            </Row>

            <h3 className={styles.H3}>Course Code</h3>
            <Row>{data?.uid}</Row>
            <h3 className={styles.H3}>Class Time</h3>
            <Row>
              <WeekCalendar {...data?.schedule.classTime}/>
            </Row>
            <h3 className={styles.H3}>Category</h3>
            <Row>
              {data?.type.map((item) => (
                <Tag
                  color={"geekblue"}
                  key={item.id}
                  style={{ padding: "5px 10px" }}
                >
                  {item.name}
                </Tag>
              ))}
            </Row>
            <h3 className={styles.H3}>Description</h3>
            <Row>{data?.detail}</Row>
            <h3 className={styles.H3}>Chapter</h3>
            {data?.schedule && (
              <Collapse defaultActiveKey={data.schedule.current}>
                {data.schedule.chapters.map((item, index) => (
                  <Collapse.Panel
                    header={item.name}
                    key={item.id}
                    extra={getChapterExtra(data.schedule, index)}
                  >
                    <p>{item.content}</p>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </DetailLayout>
  );
}
