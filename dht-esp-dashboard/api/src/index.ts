import "dotenv/config";

import Koa from "koa";
import router from "./routes/routes"
import mqtt from "mqtt";
import path from "path";
import fs from "fs"
import { device } from "aws-iot-device-sdk";
import bodyParser from "koa-bodyparser";
import { telemetry } from "./model/telemetry";
import { putTelemetry } from "./service/telemetry";

const app = new Koa();

const port = 3000;

app.use(bodyParser());

app.use(router.routes());

app.listen(port, () => {
  console.log(`🚀 Server is running on port http://localhost:${port}/`);
});

const iotEndpoint = process.env.AWS_IOT_ENDPOINT!;
const topic = process.env.AWS_IOT_DHT_TOPIC || ""

const certPath = path.resolve(__dirname, "../certs/certificate.pem.crt");
const keyPath = path.resolve(__dirname, "../certs/private.pem.key");
const caPath = path.resolve(__dirname, "../certs/AmazonRootCA1.pem");

const options: mqtt.IClientOptions = {
  host: iotEndpoint,
  port: 8883,
  protocol: "mqtts",
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  ca: fs.readFileSync(caPath),
  rejectUnauthorized: true,
  clientId: `koa-server-${Math.floor(Math.random() * 10000)}`,
  keepalive: 60
};

const awsIotClient = new device({
    clientId: process.env.AWS_CLIENT_ID,
    host: process.env.AWS_IOT_ENDPOINT,
    port: 8883,
    keyPath: keyPath,
    certPath: certPath,
    caPath: caPath,
})

awsIotClient.on("connect", () => {
  console.log("Connected to aws iot");

  awsIotClient.subscribe(topic, undefined, (err: any) => {
    if (err) {
      console.error("❌ Subscription error:", err);
      return;
    }
    console.log(`✅ Subscribed to topic: ${topic}`);
  });
});

awsIotClient.on("message", (topic, payload) => {
  console.log('Topic obtained message from: ', topic);
  try {
    const message = payload.toString();
    const data: telemetry = JSON.parse(message);
    putTelemetry(data);
    // TODO: process the message, e.g. save to DB, trigger other services
  } catch (err) {
    console.error("❌ Error processing message:", err);
  }
})

awsIotClient.on("error", (err) => {
  console.error("❌ AWS IoT Client Error:", err);
});

awsIotClient.on("reconnect", () => {
  console.log("♻️ Reconnecting to AWS IoT...");
});

awsIotClient.on("close", () => {
  console.log("⚠️ Connection closed");
});

awsIotClient.on("offline", () => {
  console.log("⚠️ Client went offline");
});