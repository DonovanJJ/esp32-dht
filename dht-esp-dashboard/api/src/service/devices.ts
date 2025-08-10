import { queryByDeviceId } from "../client/dynamo";

export async function getDeviceById(deviceId: string) {
    const res = await queryByDeviceId(deviceId);
    console.log(res);
    return res;
}