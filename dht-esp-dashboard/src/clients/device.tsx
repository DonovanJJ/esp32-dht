import type {Device} from "../models/Device.ts";

export async function getAvailableDevices(): Promise<Device[]> {
  const devices: Device[] = [
    {
      id: "id1",
      name: "device_name_1",
      client_id: "client_id1",
    },
    {
      id: "id2",
      name: "device_name_2",
      client_id: "client_id2",
    }
  ];
  console.log(devices);

  return Promise.resolve(devices);
}