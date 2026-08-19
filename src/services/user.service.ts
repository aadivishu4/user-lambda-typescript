import {
  findAllUsers,
  createUser,
} from "../repositories/user.repository.js";

import type {
  User,
  CreateUserInput,
} from "../types/user.types.js";

export async function getUsers(): Promise<User[]> {
  return findAllUsers();
}

export async function addUser(
  input: CreateUserInput,
): Promise<User> {
  return createUser(input);
}