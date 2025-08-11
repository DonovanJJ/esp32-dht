import { putTelemetryItem } from "../store/telemetry";
import { telemetry } from "../model/telemetry";


export async function putTelemetry(newTelemetry: telemetry) {
    const epochMillis = Date.now();

    newTelemetry.timestamp = epochMillis;
    await putTelemetryItem(newTelemetry);
}