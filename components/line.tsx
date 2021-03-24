import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Statistic } from "../lib/model/overview";

export interface LineChartProps {
  data: {
    [key: string]: Statistic[];
  };
}

export default function LineChart({ data }: LineChartProps) {
  const [options, setOptions] = useState<any>({
    title: {
      text: "",
    },
    yAxis: {
      title: {
        text: "Increment",
      },
    },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    credits: {
      enabled: false,
    },
  });
  const charRef = useRef(null);

  useEffect(() => {
    const { chart } = charRef.current;
    setTimeout(() => chart.reflow(), 1000);
    

    return () => {};
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    const series = Object.entries(data)
      .filter(([_, data]) => !!data && !!data.length)
      .map(([title, data]) => ({
        name: title,
        data: new Array(12).fill(0).map((_, index) => {
          const month = index + 1;
          const name = month > 9 ? month + "" : "0" + month;
          const target = data.find((item) => item.name.split("-")[1] === name);

          return (target && target.amount) || 0;
        }),
      }));

    setOptions({
      series,
    });
  }, [data]);
  

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={charRef}
    ></HighchartsReact>
  );
}
