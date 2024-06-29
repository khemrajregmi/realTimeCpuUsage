import { Card } from "@tremor/react";
import zoomPlugin from "chartjs-plugin-zoom";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  zoomPlugin
);

import { classNames, LineChartData } from "../app/app";

function CpuUsageLineChart({
  isLoading,
  lineChartData,
}: {
  isLoading: boolean;
  lineChartData: LineChartData[];
}) {
  const getLastMinuteTimestamps = () => {
    const now = dayjs();
    const timestamps = [];

    for (let i = 0; i < lineChartData.length; i++) {
      timestamps.push(now.subtract(i, "second").format("HH:mm:ss"));
    }

    return timestamps.reverse();
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "CPU Usage Over Time (seconds)",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x" as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x" as const,
        },
      },
    },
  };

  const labels = getLastMinuteTimestamps();
  const data = {
    labels,
    datasets: [
      {
        label: "CPU Usage",
        data: lineChartData.slice(-labels.length).map((d) => d.usage),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Card
      className={classNames(
        "cursor-not-allowed transition-opacity col-span-3",
        isLoading ? "pointer-events-none opacity-30" : ""
      )}
    >
      <h3 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        CPU Usage (%) Chart Over Time (seconds)
      </h3>
      <Line data={data} options={options} className="max-h-[200px]" />
    </Card>
  );
}

export default CpuUsageLineChart;
