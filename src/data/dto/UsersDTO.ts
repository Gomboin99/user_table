import type { UserDTO } from "./UserDTO";

export interface UsersDTO {
    users: UserDTO[];
    total: number;
    skip: number;
    limit: number;
  }