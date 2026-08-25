import type { User } from "../../domain/models/User";
import type { UserDTO } from "../dto/UserDTO";

export const UserMapper = {
  fromDTO(raw: UserDTO): User {
    return {
      id: raw.id,
      lastName: raw.lastName,
      firstName: raw.firstName,
      middleName: raw.maidenName || undefined,
      age: raw.age,
      gender: raw.gender,
      phone: raw.phone,
      email: raw.email,
      country: raw.address.country,
      city: raw.address.city,
    };
  },
};
