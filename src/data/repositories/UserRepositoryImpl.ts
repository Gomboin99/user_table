import type { NetworkSource } from "../network_source/NetworkSource";
import type { UserRepository } from "../../domain/interfaces/UserRepository";
import { DummyJsonSource } from "../network_source/DummyJsonSource";
import type { Users } from "../../domain/models/Users";
import { UsersMapper } from "../mappers/UsersMapper";
import type { GetUserParams } from "../../domain/models/GetUserParams";

export class UserRepositoryImpl implements UserRepository {
  private dataSource: NetworkSource;

  constructor(dataSource: NetworkSource = new DummyJsonSource()) {
    this.dataSource = dataSource;
  }

  async getUsers(
    params: GetUserParams,
    signal?: AbortSignal
  ): Promise<Users> {
    const response = await this.dataSource.fetchUsers(params, signal);
    return UsersMapper.fromDTO(response);
  }
}
