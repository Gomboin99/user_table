import type { UsersDTO } from "../dto/UsersDTO";

export interface UserQuery {
  filter?: { key: string; value: string };
  sort?: { field: string; order: "asc" | "desc" };
  page: number;
}

export interface NetworkSource {
  fetchUsers(query: UserQuery, signal?: AbortSignal): Promise<UsersDTO>;
}
