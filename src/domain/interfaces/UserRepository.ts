import type { GetUserParams } from "../models/GetUserParams";
import type { Users } from "../models/Users";

export interface UserRepository {
  getUsers(
    params: GetUserParams,
    signal?: AbortSignal
  ): Promise<Users>;
}
