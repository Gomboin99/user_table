
import type { SortState } from "../../domain/models/SortState";
import type { UsersDTO } from "../dto/UsersDTO";

export interface NetworkSource {
  fetchUsers(sort: SortState): Promise<UsersDTO>;
}
