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
  temperature: number | null;
  humidity: number | null;
}

type DhtChartProp = {
  device: Device;
}

export function DhtChart({ device }: DhtChartProp) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const TIME_RANGE = 15;
  const nowEpoch = Date.now();
  const startEpoch = nowEpoch - TIME_RANGE * 60 * 1000;


useEffect(() => {
  const nowEpoch = Date.now();
  const startEpoch = nowEpoch - TIME_RANGE * 60 * 1000;

  getTelemetryTimeRange(device.id, startEpoch, nowEpoch)
    .then((data) => {
      const grouped: Record<string, Reading[]> = {};

      data.forEach((item) => {
        const date = new Date(item.timestamp);
        const minuteKey = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (!grouped[minuteKey]) {
          grouped[minuteKey] = [];
        }
        grouped[minuteKey].push({
          time: minuteKey,
          temperature: item.temperature,
          humidity: item.humidity,
        });
      });

      const labels: string[] = [];
      const readingsPerMinute: Reading[] = [];

      for (let i = 0; i < TIME_RANGE; i++) {
        const minuteDate = new Date(startEpoch + i * 60 * 1000);
        const label = minuteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        labels.push(label);

        if (grouped[label]) {
        const temps = grouped[label]
          .map(r => r.temperature)
          .filter((v): v is number => v !== null);
        const hums = grouped[label]
          .map(r => r.humidity)
          .filter((v): v is number => v !== null);

          const avgTemp = temps.reduce((a,b) => a+b, 0) / temps.length;
          const avgHum = hums.reduce((a,b) => a+b, 0) / hums.length;

          readingsPerMinute.push({
            time: label,
            temperature: avgTemp,
            humidity: avgHum,
          });
        } else {
          readingsPerMinute.push({
            time: label,
            temperature: null,
            humidity: null,
          });
        }
      }

      setReadings(readingsPerMinute);
    })
    .catch((error) => {
      console.error("Error fetching telemetry data:", error);
    });
}, [device.id]);

  useEffect(() => console.log(readings), [readings]);

  const labels = readings.map((r) => r.time);

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Temperature",
        data: readings.map((r) => r.temperature),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Humidity (%)",
        data: readings.map((r) => r.humidity),
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
        min: 0,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: 0
      },
    },
  };

  return <Line data={data} options={options} />;
}
