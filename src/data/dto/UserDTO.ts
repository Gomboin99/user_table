import type { UserGender } from "../../domain/models/enums/UserGender";

export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: UserGender;
    email: string;
    phone: string;
    image: string;
    height: number;
    weight: number;
    address: {
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  }
  