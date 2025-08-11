import { DynamoDBClient, QueryCommand, QueryInput } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });

export async function queryByDeviceId(deviceId: string) {
    const params: QueryInput = {
        TableName: "devices",
        KeyConditionExpression: "deviceId = :id",
        ExpressionAttributeValues: {
        ":id": { S: deviceId }
        }
    };

    const command = new QueryCommand(params);
    
    try {
        const result = await client.send(command);
        console.log("Query succeeded:", result.Items);
        return result.Items;
    } catch (error) {
        console.error("Error querying table:", error);
        throw error;
    }
}
