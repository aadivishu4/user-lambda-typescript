import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import {
  getUsers,
  getUserById,
  addUser,
  editUser,
  removeUser,
} from "../services/user.service.js";

import {
  createUserSchema,
  updateUserSchema,
} from "../validators/user.validator.js";

import { response } from "../utils/response.js";

/**
 * GET /users
 */
export async function getUsersController(): Promise<APIGatewayProxyResultV2> {
  const users = await getUsers();

  return response(200, {
    success: true,
    data: users,
  });
}

/**
 * GET /users/{id}
 */
export async function getUserByIdController(
  id: string,
): Promise<APIGatewayProxyResultV2> {
  const user = await getUserById(id);

  if (!user) {
    return response(404, {
      success: false,
      message: "User not found",
    });
  }

  return response(200, {
    success: true,
    data: user,
  });
}

/**
 * POST /users
 */
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

  const validation = createUserSchema.safeParse(body);

  if (!validation.success) {
    return response(400, {
      success: false,
      message: "Validation failed",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const user = await addUser(validation.data);

  return response(201, {
    success: true,
    data: user,
  });
}

/**
 * PATCH /users/{id}
 */
export async function updateUserController(
  event: APIGatewayProxyEventV2,
  id: string,
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

  const validation = updateUserSchema.safeParse(body);

  if (!validation.success) {
    return response(400, {
      success: false,
      message: "Validation failed",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const user = await editUser(id, validation.data);

  if (!user) {
    return response(404, {
      success: false,
      message: "User not found",
    });
  }

  return response(200, {
    success: true,
    data: user,
  });
}

/**
 * DELETE /users/{id}
 */
export async function deleteUserController(
  id: string,
): Promise<APIGatewayProxyResultV2> {
  const deleted = await removeUser(id);

  if (!deleted) {
    return response(404, {
      success: false,
      message: "User not found",
    });
  }

  return response(200, {
    success: true,
    message: "User deleted successfully",
  });
}