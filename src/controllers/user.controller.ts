import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import {
  getUsers,
  addUser,
} from "../services/user.service.js";

import { response } from "../utils/response.js";

export async function getUsersController(): Promise<APIGatewayProxyResultV2> {
  const users = await getUsers();

  return response(200, {
    success: true,
    data: users,
  });
}

export async function createUserController(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  let body: unknown;

  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return response(400, {
      success: false,
      message: "Invalid JSON body",
    });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("name" in body) ||
    !("email" in body) ||
    typeof body.name !== "string" ||
    typeof body.email !== "string"
  ) {
    return response(400, {
      success: false,
      message: "name and email are required",
    });
  }

  const user = await addUser({
    name: body.name,
    email: body.email,
  });

  return response(201, {
    success: true,
    data: user,
  });
}