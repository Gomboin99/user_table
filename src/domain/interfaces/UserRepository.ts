import type { Users } from "../models/Users";

export interface UserRepository {
  getUsers(
    query: {
      filter?: { key: string; value: string };
      sort?: { field: string; order: "asc" | "desc" };
      page: number;
    },
    signal?: AbortSignal
  ): Promise<Users>;
}
