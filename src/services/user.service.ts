import {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../repositories/user.repository.js";

import type { User } from "../types/user.types.js";
import type {
  CreateUserDto,
  UpdateUserDto,
} from "../validators/user.validator.js";

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

export async function editUser(
  id: string,
  input: UpdateUserDto,
): Promise<User | null> {
  return updateUser(id, input);
}

export async function removeUser(
  id: string,
): Promise<boolean> {
  return deleteUser(id);
}