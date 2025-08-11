import { getTelemetryInTimeRange, putTelemetryItem } from "../store/telemetry";
import { Telemetry } from "../model/telemetry";


export async function putTelemetry(newTelemetry: Telemetry) {
  const epochMillis = Date.now();

  newTelemetry.timestamp = epochMillis;
  await putTelemetryItem(newTelemetry);
}

export async function getTelemetryByIdRange(id: string, startTs: number, endTs: number) {
  return await getTelemetryInTimeRange(id, startTs, endTs);
}