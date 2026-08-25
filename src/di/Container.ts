import { UserRepositoryImpl } from "../data/repositories/UserRepositoryImpl";
import type { UserRepository } from "../domain/interfaces/UserRepository";


export class Container {
  private static instance: Container;
  
  private userRepository: UserRepository;

  private constructor() {
    this.userRepository = new UserRepositoryImpl();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getUsersRepository(): UserRepository {
    return this.userRepository;
  }
}

export const container = Container.getInstance();