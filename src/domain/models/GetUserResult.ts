import type { User } from "./User";

export interface GetUsersSuccess {
    success: true;
    users: User[];
    total: number;
  }
  
  export interface GetUsersFailure {
    success: false;
    error: string | null;
  }
  
  export type GetUsersResult = GetUsersSuccess | GetUsersFailure;