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

export type TimeRangeConfig = {
  timeInterval: number;
  timeRange: number;
  columnCount: number;
  display: string;
}

export const SelectedTimeRangeConfig = {
  FifteenMinutes: {
    timeInterval: 60 * 1000,
    timeRange: 15 * 60 * 1000,
    columnCount: 15,
    display: "15 Minutes"
  },
  OneHour: {
    timeInterval: 60 * 1000,
    timeRange: 60 * 60 * 1000,
    columnCount: 60,
    display: "1 Hour"
  },
  OneDay: {
    timeInterval: 60 * 60 * 1000,
    timeRange: 24 * 60 * 60 * 1000,
    columnCount: 24,
    display: "1 Day"
  },
  SevenDays: {
    timeInterval: 24 * 60 * 60 * 1000,
    timeRange: 7 * 24 * 60 * 60 * 1000,
    columnCount: 7,
    display: "7 Days"
  }
}

export type SelectedTimeRangeConfigKey = keyof typeof SelectedTimeRangeConfig;

type DhtChartProp = {
  device: Device;
  timeRange: SelectedTimeRangeConfigKey;
}

export function DhtChart({ device, timeRange }: DhtChartProp) {
  const [readings, setReadings] = useState<Reading[]>([]);

  useEffect(() => {
    const nowEpoch = Date.now();
    const rangeConfig = SelectedTimeRangeConfig[timeRange];
    const startEpoch = nowEpoch - rangeConfig.timeRange;

    getTelemetryTimeRange(device.id, startEpoch, nowEpoch)
      .then((data) => {
        const grouped: Record<string, Reading[]> = {};

        data.forEach((item) => {
          const date = new Date(item.timestamp);
          const key = date.toLocaleTimeString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });

          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push({
            time: key,
            temperature: item.temperature,
            humidity: item.humidity,
          });
        });

        const labels: string[] = [];
        const readingsPerDataPoint: Reading[] = [];

        for (let i = 0; i < rangeConfig.columnCount; i++) {
          const dateTimeDataPoint = new Date(startEpoch + i * rangeConfig.timeInterval);
          const label = dateTimeDataPoint.toLocaleTimeString([], {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
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

            readingsPerDataPoint.push({
              time: label,
              temperature: avgTemp,
              humidity: avgHum,
            });
          } else {
            readingsPerDataPoint.push({
              time: label,
              temperature: null,
              humidity: null,
            });
          }
        }

        setReadings(readingsPerDataPoint);
      })
      .catch((error) => {
        console.error("Error fetching telemetry data:", error);
      });
  }, [device.id, timeRange]);

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
