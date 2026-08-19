import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { getDb } from "./database/postgres.js";

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  console.log(
    "Request:",
    JSON.stringify({
      method: event.requestContext.http.method,
      path: event.rawPath,
      requestId: event.requestContext.requestId,
    }),
  );

  try {
    const db = await getDb();

    const result = await db.query<{
      current_time: Date;
      postgres_version: string;
    }>(`
      SELECT
        NOW() AS current_time,
        version() AS postgres_version
    `);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "TypeScript Lambda connected to PostgreSQL",
        database: result.rows[0],
      }),
    };
  } catch (error) {
    console.error("Application error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
    };
  }
};