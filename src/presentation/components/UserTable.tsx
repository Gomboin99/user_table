import { useRef } from "react";
import type { User } from "../../domain/models/User";
import type { UserSortState } from "../../domain/models/UserSortState";
import type { UserFieldForActions } from "../../domain/models/types/UserFieldForActions";
import type { UserFilterState } from "../../domain/models/types/UserFilterState";
import { UserGender } from "../../domain/models/enums/UserGender";
import { SortableHeader } from "./SortableHeader";
import { Resizer } from "./Resizer";
import { useState } from "react";
import { useColumnResize } from "../hooks/useColumnResize";
import { UserDetailsModal } from "./UserDetailsModal";

interface Column {
  key: keyof User;
  label: string;
  field?: UserFieldForActions;
}

const COLUMNS: Column[] = [
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

interface UserTableProps {
  users: User[];
  sort: UserSortState;
  onSort: (field: UserFieldForActions) => void;
  filter: UserFilterState;
  onFilterChange: (field: UserFieldForActions, value: string) => void;
}

function renderCell(user: User, key: keyof User) {
  if (key === "middleName") return user.middleName ?? "—";
  if (key === "gender") {
    return user.gender === UserGender.Male ? "Мужской" : "Женский";
  }
  return user[key] as string | number;
}

export function UserTable({ users, sort, onSort, filter, onFilterChange }: UserTableProps) {
  const tableRef = useRef<HTMLTableElement>(null);
  const { widths, startResize } = useColumnResize(tableRef, COLUMNS.length);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const renderFilterControl = (column: Column) => {
    if (!column.field) return null;
    const value = filter[column.field] ?? "";

    if (column.key === "gender") {
      return (
        <select
          className="filter-control"
          value={value}
          onChange={(e) => onFilterChange(column.field as UserFieldForActions, e.target.value)}
        >
          <option value="">Все</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
      );
    }

    return (
      <input
        className="filter-control"
        type="text"
        placeholder="Фильтр"
        value={value}
        onChange={(e) => onFilterChange(column.field as UserFieldForActions, e.target.value)}
      />
    );
  };

  return (
    <>
      <table ref={tableRef} className="user-table">
      <thead>
        <tr>
          {COLUMNS.map((column, index) => {
            const width = widths[index];
            const filterControl = renderFilterControl(column);
            if (column.field) {
              return (
                <SortableHeader
                  key={column.key}
                  label={column.label}
                  field={column.field}
                  sort={sort}
                  onSort={onSort}
                  width={width}
                  onResizeStart={(e) => startResize(index, e)}
                  filterControl={filterControl}
                />
              );
            }
            return (
              <th
                key={column.key}
                className="non-sortable"
                style={width !== undefined ? { width } : undefined}
              >
                <span className="th-content">{column.label}</span>
                {filterControl}
                <Resizer onResizeStart={(e) => startResize(index, e)} />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td className="empty" colSpan={COLUMNS.length}>
              Ничего не найдено
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr
              key={user.id}
              className="clickable-row"
              onClick={() => setSelectedUser(user)}
            >
              {COLUMNS.map((column) => (
                <td key={column.key}>{renderCell(user, column.key)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
    <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  );
}
