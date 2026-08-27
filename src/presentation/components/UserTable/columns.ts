import type { User } from "../../../domain/models/User";
import type { UserFieldForActions } from "../../../domain/models/types/UserFieldForActions";


export interface Column {
  key: keyof User;
  label: string;
  field?: UserFieldForActions;
}

export const COLUMNS: Column[] = [
  { key: "lastName", label: "Фамилия", field: "lastName" },
  { key: "firstName", label: "Имя", field: "firstName" },
  { key: "middleName", label: "Отчество" },
  { key: "age", label: "Возраст", field: "age" },
  { key: "gender", label: "Пол", field: "gender" },
  { key: "phone", label: "Телефон", field: "phone" },
  { key: "email", label: "Email" },
  { key: "country", label: "Страна" },
  { key: "city", label: "Город" },
];
