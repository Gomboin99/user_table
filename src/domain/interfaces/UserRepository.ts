import type { SortState } from "../models/SortState";
import type { User } from "../models/User";

export interface UserRepository {
    getUsers(sort: SortState): Promise<User[]>;
  }