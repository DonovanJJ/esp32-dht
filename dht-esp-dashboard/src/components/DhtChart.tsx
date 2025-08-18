import {
  CategoryScale,
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Title,
} from "chart.js";
import {Line} from "react-chartjs-2";
import {useEffect, useState} from "react";
import {getTelemetryTimeRange} from "../clients/telemetry";
import type {Device} from "../models/Device";
import {SelectedTimeRangeConfig} from "./SelectedTimeRangeConfig.tsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
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

export type SelectedTimeRangeConfigKey = keyof typeof SelectedTimeRangeConfig;

type DhtChartProp = {
  device: Device;
  timeRange: SelectedTimeRangeConfigKey;
}

export function DhtChart({ device, timeRange }: DhtChartProp) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 576); // Bootstrap xs breakpoint
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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
        label: "Temperature (°C)",
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
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: isSmallScreen
          ? { display: false }
          : { maxTicksLimit: 4, maxRotation: 45, autoSkip: true },
        grid: isSmallScreen
          ? { drawTicks: false }
          : {},
      },
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
    plugins: {
      title: {
        display: true,
        text: "Temperature Readings (°C)",
        font: {
          size: 20,
          weight: 'bold',
        },
        color: '#333',
      },
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, boxWidth: 10 },
      },
    },
  };
  return (
    <div style={{ width: "100%", height: isSmallScreen ? "250px" : "350px" }}>
      <Line data={data} options={options} />
    </div>
  )
}
