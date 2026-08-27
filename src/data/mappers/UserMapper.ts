import type { User } from "../../domain/models/User";
import type { UserDTO } from "../dto/UserDTO";

export const UserMapper = {
  fromDTO(dto: UserDTO): User {
    return {
      id: dto.id,
      lastName: dto.lastName,
      firstName: dto.firstName,
      middleName: dto.maidenName || undefined,
      age: dto.age,
      gender: dto.gender,
      phone: dto.phone,
      email: dto.email,
      avatar: dto.image,
      height: dto.height,
      weight: dto.weight,
      street: dto.address.address,
      state: dto.address.state,
      postalCode: dto.address.postalCode,
      country: dto.address.country,
      city: dto.address.city,
    };
  },
};
