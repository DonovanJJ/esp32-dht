import Router from "@koa/router";
import { createNewDevice, getDeviceById } from "../service/device";

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

export default router;