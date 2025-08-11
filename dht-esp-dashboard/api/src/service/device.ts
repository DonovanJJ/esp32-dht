import { device } from "../model/device";
import { queryByDeviceId } from "../store/device";

export async function getDeviceById(deviceId: string): Promise<device | null> {
    const res = await queryByDeviceId(deviceId);
    return res;
}

export async function createIfNotExists(deviceId: string) {

}