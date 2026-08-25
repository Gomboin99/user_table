import type { User } from "../../domain/models/User";
import type { SortState } from "../../domain/models/SortState";
import type { NetworkSource } from "../network_source/NetworkSource";
import { UserMapper } from "../mappers/UserMapper";
import type { UserRepository } from "../../domain/interfaces/UserRepository";
import { DummyJsonSource } from "../network_source/DummyJsonSource";

export class UserRepositoryImpl implements UserRepository {
  private dataSource: NetworkSource;

  constructor(dataSource: NetworkSource = new DummyJsonSource()) {
    this.dataSource = dataSource;
  }

  async getUsers(sort: SortState): Promise<User[]> {
    const response = await this.dataSource.fetchUsers(sort);
    return response.users.map(UserMapper.fromDTO);
  }
}
