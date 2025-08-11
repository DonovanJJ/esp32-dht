import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getTelemetryTimeRange } from "../clients/telemetry";
import type { Device } from "../models/Device";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Reading = {
  time: string;
  temperature: number;
  humidity: number;
}

type DhtChartProp = {
  device: Device;
}

export function DhtChart({ device }: DhtChartProp) {
  const labels = ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"];
  const [readings, setReadings] = useState<Reading[]>([]);
  const TIME_RANGE = 15;
  const nowEpoch = Date.now();
  const startEpoch = nowEpoch - TIME_RANGE * 60 * 1000;


  useEffect(() => {
    const nowEpoch = Date.now();
    const startEpoch = nowEpoch - TIME_RANGE * 60 * 1000;

    getTelemetryTimeRange(device.id, startEpoch, nowEpoch)
      .then((data) => {
        const formatted = data.map((item) => ({
          time: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          temperature: item.temperature,
          humidity: item.humidity,
        }));
        setReadings(formatted);
      })
      .catch((error) => {
        console.error("Error fetching telemetry data:", error);
      });
  }, [device.id]);

  useEffect(() => console.log(readings), [readings]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const now = new Date();
  //     const newReading: Reading = {
  //       time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  //       temperature: 20 + Math.random() * 5, // mock temp 20–25°C
  //       humidity: 45 + Math.random() * 10, // mock humidity 45–55%
  //     };
  
  //     setReadings((prev))
  //   }, [30000])
  // })

  useEffect(() => {
    // fetch readings in 15mins interval
  }, [])

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Temperature",
        data: [22, 25, 21, 23, 20, 19, 24],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Humidity (%)",
        data: [45, 50, 48, 47, 52, 55, 49],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
