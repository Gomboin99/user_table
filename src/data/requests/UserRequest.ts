import type { UserFilterRequest } from "./UserFilterRequest";
import type { UserSortRequest } from "./UserSortRequest";

export interface UserRequest {
    filter?: UserFilterRequest;
    sort?: UserSortRequest;
    page: number;
  }