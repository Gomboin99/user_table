import type { Gender } from "./enums/UserGender";

export interface User {
  id: number;
  lastName: string;
  firstName: string;
  middleName?: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  country: string;
  city: string;
}
