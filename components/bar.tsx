import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useRef, useState } from "react";
import { Skills, Statistic } from "../lib/model/overview";
import { uniq } from "lodash";

export interface BarChartProps {
  data: {
    interest: Statistic[];
    teacher: Skills;
  };
}

export default function BarChart({ data }: BarChartProps) {
  const [options, setOptions] = useState<any>({
    chart: {
      type: "column",
    },
    title: {
      text: "Student VS Teacher",
    },
    subtitle: {
      text: "Comparing what students are interested in and teachers' skill",
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total fruit consumption",
      },
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
    },
    credits: {
      enabled: false,
    },

    
    // [
    //   {
    //     type: "column",
    //     name: "John",
    //     data: [5, 3, 4, 7, 2],
    //   },
    //   {
    //     type: "column",
    //     name: "Jane",
    //     data: [2, 2, 3, 2, 1],
    //   },
    //   {
    //     type: "column",
    //     name: "Joe",
    //     data: [3, 4, 4, 2, 5],
    //   },
    // ],
    //{
    //   name: "interest", data: [...]
    //}
  });

  useEffect(() => {
    if (!data) return;
    const { interest, teacher } = data;
    // const xCategories: string[] = uniq([
    //   ...interest.map(({ name }) => name),
    //   ...Object.keys(teacher),
    // ]);

    // const series = Object.entries(data.interest)
    //   .filter(([_, interest]) => !!interest && !!interest.length)
    //   .map(([title, data]) => ({
    //     name: "interest",
    //     data: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    //   }));

    setOptions({
      xAxis: {
        type: "category",
        labels: {
          rotation: -45,
          style: {
            fontSize: "13px",
            fontFamily: "Verdana, sans-serif",
          },
        },
        //categories: xCategories,
        //series: series,
      },
    });
  }, [data]);

  return (
    <HighchartsReact options={options} highcharts={Highcharts} {...data} />
  );
}
