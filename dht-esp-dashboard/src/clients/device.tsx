import axios from "axios";
import type {Device} from "../models/Device.ts";

const END_POINT = "localhost:3000"

export async function getAvailableDevices(): Promise<Device[]> {
  const url = `http://${END_POINT}/devices`
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch telemetry data: ", error);
    return [];
  }
}