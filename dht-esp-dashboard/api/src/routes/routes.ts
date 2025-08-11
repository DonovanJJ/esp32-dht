import Router from "@koa/router";
import { createNewDevice, getDeviceById } from "../service/device";
import {getTelemetryByIdRange} from "../service/telemetry";

const router = new Router();

router.get("/health", (ctx, next) => {
  ctx.body = "Healthy!";
});

router.get("/device/:deviceId", async (ctx, next) => {
  const { deviceId } = ctx.params;

  if (!deviceId) {
    ctx.status = 400;
    ctx.body = { error: "Missing deviceId path parameter" };
    return;
  }
  try {
    const device = await getDeviceById(deviceId);
    if (!device) {
      ctx.status = 404;
      ctx.body = { error: "Device details not found" };
      return;
    }
    ctx.status = 200;
    ctx.body = device;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch device details"}
  }
})

router.post("/device", async (ctx, next) => {
  try {
    const res = await createNewDevice();
    ctx.status = 201;
    ctx.body = res;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Failed to create device"}
  }
})

router.get("/telemetry/:id/range/:startTs/:endTs", async (ctx, next) => {
  const { id, startTs, endTs } = ctx.params;

  const start = Number(startTs);
  const end = Number(endTs);

  // Validate
  if (isNaN(start) || isNaN(end)) {
    ctx.throw(400, "startTs and endTs must be valid timestamps");
  }
  try {
    const telemetryData = await getTelemetryByIdRange(id, start, end);
    ctx.status = 200;
    ctx.body = telemetryData;
  } catch (error) {
    console.error("Failed to fetch telemetry data:", error);
    ctx.status = 500;
    ctx.body = { error: "Failed to fetch telemetry data" };
  }

})

export default router;