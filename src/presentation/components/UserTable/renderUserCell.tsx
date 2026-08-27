import type { User } from "../../../domain/models/User";
import { UserGender } from "../../../domain/models/enums/UserGender";


export function renderUserCell(user: User, key: keyof User) {
  if (key === "middleName") return user.middleName ?? "—";
  if (key === "gender") {
    return user.gender === UserGender.Male ? "Мужской" : "Женский";
  }
  return user[key] as string | number;
}
