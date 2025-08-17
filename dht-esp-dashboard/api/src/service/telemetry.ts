import {getLatestTelemetry, getTelemetryInTimeRange, putTelemetryItem} from "../store/telemetry";
import { Telemetry, Telemetry_MQTT } from "../model/telemetry";


export async function putTelemetry(telemetry: Telemetry_MQTT) {
  const data: Telemetry = {
    deviceId: telemetry.device_id,
    temperature: telemetry.temperature,
    humidity: telemetry.humidity,
    timestamp: Date.now()
  }
  console.log(`Received telemetry data at ${data.timestamp}`);
  await putTelemetryItem(data);
}

export async function getTelemetryByIdRange(id: string, startTs: number, endTs: number) {
  return await getTelemetryInTimeRange(id, startTs, endTs);
}

export async function getLastestTelemetry(id: string) {
  return await getLatestTelemetry(id);
}