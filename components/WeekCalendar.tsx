import { Table } from "antd";

interface Calendar {
  Sunday: string;
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
}

const ArrayToObject = (
  classTime: string[]
): { key: string; value: string }[] => {
  const object: any = {};

  if (classTime) {
    for (const [key, value] of Object.entries(classTime)) {
      if (value.includes("Sunday")) {
        object.Sunday = value.split(" ")[1];
      }
      if (value.includes("Monday")) {
        object.Monday = value.split(" ")[1];
      }
      if (value.includes("Tuesday")) {
        object.Tuesday = value.split(" ")[1];
      }
      if (value.includes("Wednesday")) {
        object.Wednesday = value.split(" ")[1];
      }
      if (value.includes("Thursday")) {
        object.Thursday = value.split(" ")[1];
      }
      if (value.includes("Friday")) {
        object.Friday = value.split(" ")[1];
      }
      if (value.includes("Saturday")) {
        object.Saturday = value.split(" ")[1];
      }
    }
  }

  return object;
};

export default function WeekCalendar(classTime: string[]) {
  const columns = [
    {
      title: "Sunday",
      dataIndex: "Sunday",
    },
    {
      title: "Monday",
      dataIndex: "Monday",
    },
    {
      title: "Tuesday",
      dataIndex: "Tuesday",
    },
    {
      title: "Wednesday",
      dataIndex: "Wednesday",
    },
    {
      title: "Thursday",
      dataIndex: "Thursday",
    },
    {
      title: "Friday",
      dataIndex: "Friday",
    },
    {
      title: "Saturday",
      dataIndex: "Saturday",
    },
  ];

  const object = ArrayToObject(classTime);
  const array = [];
  array.push(object);

  return (
    <Table bordered columns={columns} dataSource={array} pagination={false} size="small"/>
  );
}
