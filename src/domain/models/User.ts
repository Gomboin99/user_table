import type { UserGender } from "./enums/UserGender";

export interface User {
  id: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  age: number;
  gender: UserGender;
  phone: string;
  email: string;
  country: string;
  city: string;
}
