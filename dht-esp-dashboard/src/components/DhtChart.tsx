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
import { useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// type Reading = {
//   time: string;
//   temperature: number;
//   humidity: number;
// }

export function DhtChart() {
  const labels = ["mon", "tues", "wed", "thurs", "fri", "sat", "sun"];
  // const [readings, setReadings] = useState<Reading[]>([]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const now = new Date();
  //     const newReading: Reading = {
  //       time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  //       temperature: 20 + Math.random() * 5, // mock temp 20–25°C
  //       humidity: 45 + Math.random() * 10, // mock humidity 45–55%
  //     };
  //
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
