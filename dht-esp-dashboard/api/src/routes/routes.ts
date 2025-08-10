import Router from "koa-router";
import { getDeviceById } from "../service/devices";

const router = new Router();

router.get("/health", (ctx, next) => {
  ctx.body = "Healthy!";
});

router.get("/device", (ctx, next) => {
  getDeviceById("testId");
})

export default router;