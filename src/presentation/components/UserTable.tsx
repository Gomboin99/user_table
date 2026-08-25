import type { SortState } from "../../domain/models/SortState";
import type { User } from "../../domain/models/User";
import { Gender } from "../../domain/models/enums/Gender";
import type { SortableField } from "../../domain/models/types/SortableField";
import { SortableHeader } from "./SortableHeader";

interface UserTableProps {
  users: User[];
  sort: SortState;
  onSort: (field: SortableField) => void;
}

const genderLabel: Record<Gender, string> = {
  [Gender.Male]: "Мужской",
  [Gender.Female]: "Женский",
};

export function UserTable({ users, sort, onSort }: UserTableProps) {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <SortableHeader label="Фамилия" field="lastName" sort={sort} onSort={onSort} />
          <SortableHeader label="Имя" field="firstName" sort={sort} onSort={onSort} />
          <th>Отчество</th>
          <SortableHeader label="Возраст" field="age" sort={sort} onSort={onSort} />
          <SortableHeader label="Пол" field="gender" sort={sort} onSort={onSort} />
          <SortableHeader label="Телефон" field="phone" sort={sort} onSort={onSort} />
          <th>Email</th>
          <th>Страна</th>
          <th>Город</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.lastName}</td>
            <td>{user.firstName}</td>
            <td>{user.middleName ?? "—"}</td>
            <td>{user.age}</td>
            <td>{genderLabel[user.gender]}</td>
            <td>{user.phone}</td>
            <td>{user.email}</td>
            <td>{user.country}</td>
            <td>{user.city}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
