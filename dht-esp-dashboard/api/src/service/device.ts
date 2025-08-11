import { queryByDeviceId } from "../store/device";

export async function getDeviceById(deviceId: string) {
    const res = await queryByDeviceId(deviceId);
    console.log(res);
    return res;
}

export async function createIfNotExists(deviceId: string) {

}