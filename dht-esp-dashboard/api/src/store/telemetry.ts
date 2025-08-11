import { DynamoDBClient, PutItemInput, PutItemCommand, QueryCommand, QueryInput } from "@aws-sdk/client-dynamodb";
import { telemetry } from "../model/telemetry";

const TABLE = "telemetry";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function putTelemetryItem(newTelemetry: telemetry) {
    const params: PutItemInput = {
        TableName: TABLE,
        Item: {
            deviceId: { S: newTelemetry.device_id },
            temperature: { N: newTelemetry.temperature.toString() },
            humidity: { N: newTelemetry.humidity.toString() },
            timestamp: { N: newTelemetry.timestamp.toString() },
        },
    };

    const command = new PutItemCommand(params);

    try {
        await client.send(command);
        console.log("Put telemetry succeeded");
    } catch (error) {
        console.error("Error putting telemetry:", error);
        throw error;
    }
}