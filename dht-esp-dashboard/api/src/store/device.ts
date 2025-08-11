import { DynamoDBClient, GetItemCommandInput, GetItemCommand, PutItemCommandInput, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { Device } from "../model/device";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE = "devices";

export async function queryByDeviceId(deviceId: string): Promise<Device | null> {
    const params: GetItemCommandInput = {
        TableName: TABLE,
        Key: {
            deviceId: { S: deviceId }
        }
    };

    const command = new GetItemCommand(params);
    
    try {
        const result = await client.send(command);
        console.log("Query succeeded:", result.Item);

        if (result.Item) {
            const raw = unmarshall(result.Item);
            const mapped: Device = {
                id: raw.deviceId,
                clientId: raw.clientId,
                name: raw.name
            };
            return mapped;
        }
        return null;
    } catch (error) {
        console.error("Error querying table:", error);
        throw error;
    }
}

export async function putDeviceItem(device: Device): Promise<void> {
    const params: PutItemCommandInput = {
        TableName: TABLE,
        Item: {
            id: { S: device.id },
            clientId: { S: device.clientId },
            name: { S: device.name }
        },
    }

    const command = new PutItemCommand(params);

    try {
        await client.send(command);
        console.log(`Device ${device.id} created successfully.`);
    } catch (error) {
        console.error("Error creating device:", error);
        throw error;
    }
}