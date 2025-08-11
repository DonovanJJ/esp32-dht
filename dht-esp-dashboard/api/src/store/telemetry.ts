import { DynamoDBClient, PutItemInput, PutItemCommand, QueryCommand, QueryInput } from "@aws-sdk/client-dynamodb";
import { Telemetry } from "../model/telemetry";

const TABLE = "telemetry";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function putTelemetryItem(newTelemetry: Telemetry) {
    const params: PutItemInput = {
        TableName: TABLE,
        Item: {
            deviceId: { S: newTelemetry.deviceId },
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

export async function getTelemetryInTimeRange(id: string, start: number, end: number): Promise<Telemetry[]> {
  const params: QueryInput = {
    TableName: TABLE,
    KeyConditionExpression: "deviceId = :deviceId AND #ts BETWEEN :start AND :end",
    ExpressionAttributeNames: {
      "#ts": "timestamp",
    },
    ExpressionAttributeValues: {
      ":deviceId": { S: id },
      ":start": { N: start.toString() },
      ":end": { N: end.toString() },
    },
    ScanIndexForward: true,
  };

  try {
    const command = new QueryCommand(params);
    const result = await client.send(command);

    return (result.Items || []).map((item): Telemetry => ({
      deviceId: item.deviceId.S as string,
      temperature: Number(item.temperature.N),
      humidity: Number(item.humidity.N),
      timestamp: Number(item.timestamp.N),
    }));
  } catch (error) {
    console.error("Error querying telemetry:", error);
    throw error;
  }
}