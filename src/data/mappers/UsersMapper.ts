import type { Users } from "../../domain/models/Users";
import type { UsersDTO } from "../dto/UsersDTO";
import { UserMapper } from "./UserMapper";

export const UsersMapper = {
    fromDTO(dto: UsersDTO): Users {
      return {
        users: dto.users.map(UserMapper.fromDTO),
      total: dto.total,
      };
    },
  };