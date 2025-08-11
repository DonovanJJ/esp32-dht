import { DynamoDBClient, GetItemCommandInput, GetItemCommand, AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { device } from "../model/device";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function queryByDeviceId(deviceId: string): Promise<device | null> {
    const params: GetItemCommandInput = {
        TableName: "devices",
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
            const mapped: device = {
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
