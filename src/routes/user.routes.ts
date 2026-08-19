import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import {
  getUsersController,
  createUserController,
} from "../controllers/user.controller.js";

import { response } from "../utils/response.js";

export async function userRoutes(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const method = event.requestContext.http.method;
  const path = event.rawPath;

  if (method === "GET" && path === "/users") {
    return getUsersController();
  }

  if (method === "POST" && path === "/users") {
    return createUserController(event);
  }

  return response(404, {
    success: false,
    message: "Route not found",
  });
}