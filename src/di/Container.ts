import { DummyJsonSource } from "../data/network_source/DummyJsonSource";
import type { NetworkSource } from "../data/network_source/NetworkSource";
import { UserRepositoryImpl } from "../data/repositories/UserRepositoryImpl";
import { UserInteractor } from "../domain/interactors/UserInteractor";
import type { UserRepository } from "../domain/interfaces/UserRepository";


export class Container {
  private static instance: Container;
  
  private userRepository: UserRepository;
  private networkSource: NetworkSource;
  private userInteractor: UserInteractor;

  private constructor() {
    this.networkSource = new DummyJsonSource();
    this.userRepository = new UserRepositoryImpl(this.networkSource);
    this.userInteractor = new UserInteractor(this.userRepository);
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

  public getUserInteractor(): UserInteractor {
    return this.userInteractor;
  }
}

export const container = Container.getInstance();