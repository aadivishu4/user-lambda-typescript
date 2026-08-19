import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { userRoutes } from "./routes/user.routes.js";
import { response } from "./utils/response.js";

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
    return await userRoutes(event);
  } catch (error: unknown) {
    console.error("Application error:", error);

    // PostgreSQL unique constraint violation
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return response(409, {
        success: false,
        message: "Email already exists",
      });
    }

    return response(500, {
      success: false,
      message: "Internal server error",
    });
  }
};