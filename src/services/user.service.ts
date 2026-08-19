import {
  findAllUsers,
  findUserById,
  createUser,
} from "../repositories/user.repository.js";

import type { User } from "../types/user.types.js";
import type { CreateUserDto } from "../validators/user.validator.js";

export async function getUsers(): Promise<User[]> {
  return findAllUsers();
}

export async function getUserById(
  id: string,
): Promise<User | null> {
  return findUserById(id);
}

export async function addUser(
  input: CreateUserDto,
): Promise<User> {
  return createUser(input);
}