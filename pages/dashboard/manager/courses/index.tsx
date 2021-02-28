import DetailLayout from "../../../../components/layout";
import { List, BackTop, Button } from "antd";
import { Gutter } from "antd/lib/grid/row";
import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCourses } from "../../../../lib/services/api-services";
import { res } from "../../../../lib/constant/constants";
import CourseCard from "../../../../components/CourseCard";


export default function Course() {
  const [courses, setCourses] = useState([]);
  const [paginator, setPaginator] = useState({ limit: 20, page: 1 });
  const [hasMore, setHasMore] = useState(true);

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
        next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
        hasMore={hasMore}
        loader={<b>Loading</b>}
        dataLength={courses.length}
        endMessage={<b>No More Course!</b>}
        style={{ overflow: "hidden" }}
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
              <CourseCard {...item}>
                <Link href={`/dashboard/manager/courses/${item.id}`} passHref>
                  <Button type="primary">Read More</Button>
                </Link>
              </CourseCard>
            </List.Item>
          )}
        />
      </InfiniteScroll>

      <BackTop />
    </DetailLayout>
  );
}
