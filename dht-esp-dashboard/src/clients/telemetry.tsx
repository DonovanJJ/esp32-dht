import axios from "axios";
import type {Telemetry} from "../models/Telemetry.ts";

const END_POINT = "/api"
// const END_POINT = "http://localhost:3000"

export async function getTelemetryTimeRange(deviceId: string, start: number, end: number): Promise<Telemetry[]> {
  const url = (`${END_POINT}/device/${deviceId}/telemetry/range/${start}/${end}`);

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch telemetry data: ", error);
    return [];
  }
}

export async function getLatestTelemetry(deviceId: string): Promise<Telemetry | null> {
  const url = (`${END_POINT}/device/${deviceId}/telemetry/latest`);

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch telemetry data: ", error);
    return null;
  }
}