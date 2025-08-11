import { v4 as uuidv4 } from "uuid";
import { CreateNewDeviceResponse, Device } from "../model/device";
import { putDeviceItem, queryByDeviceId, queryDevices } from "../store/device";

export async function getDeviceById(deviceId: string): Promise<Device | null> {
    const res = await queryByDeviceId(deviceId);
    return res;
}

export async function getDevices(): Promise<Device[]>{
  return await queryDevices();
}

async function createDevice(device: Device): Promise<void> {
    try {
        await putDeviceItem(device);
    } catch (err) {
        throw err;
    }
}

export async function createNewDevice(): Promise<CreateNewDeviceResponse> {
  const newDevice: Device = {
    id: uuidv4(),
    clientId: uuidv4(),
    name: `New Device - ${uuidv4().substring(0, 8)}`
  };

  await createDevice(newDevice);

  const res: CreateNewDeviceResponse = {
    id: newDevice.id,
    clientId: newDevice.clientId
  }

  return res;
}