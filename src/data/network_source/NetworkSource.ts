import type { UsersDTO } from "../dto/UsersDTO";
import type { UserRequest } from "../requests/UserRequest";

export interface NetworkSource {
  fetchUsers(request: UserRequest, signal?: AbortSignal): Promise<UsersDTO>;
}
