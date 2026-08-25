import type { SortState } from "../../domain/models/SortState";
import type { UsersDTO } from "../dto/UsersDTO";
import type { NetworkSource } from "./NetworkSource";

const BASE_URL = "https://dummyjson.com/users";

export class DummyJsonSource implements NetworkSource {
  async fetchUsers(sort: SortState): Promise<UsersDTO> {
    const params = new URLSearchParams();

    if (sort.field !== null && sort.direction !== "none") {
      params.set("sortBy", sort.field);
      params.set("order", sort.direction);
    }

    const url = params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to load users: ${response.status}`);
    }

    const data = (await response.json()) as UsersDTO;
    return data;
  }
}

