import type { Gender } from "../../domain/models/enums/UserGender";

export interface UserDTO {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: Gender;
    email: string;
    phone: string;
    address: {
      country: string;
      city: string;
    };
  }
  