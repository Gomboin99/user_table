import { useRef } from "react";
import type { User } from "../../domain/models/User";
import type { SortState } from "../../domain/models/SortState";
import type { SortableField } from "../../domain/models/types/SortableField";
import type { FilterState } from "../../domain/models/types/FilterState";
import { Gender } from "../../domain/models/enums/Gender";
import { SortableHeader } from "./SortableHeader";
import { Resizer } from "./Resizer";
import { useColumnResize } from "../hooks/useColumnResize";

interface Column {
  key: keyof User;
  label: string;
  field?: SortableField;
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
  sort: SortState;
  onSort: (field: SortableField) => void;
  filter: FilterState;
  onFilterChange: (field: SortableField, value: string) => void;
}

function renderCell(user: User, key: keyof User) {
  if (key === "middleName") return user.middleName ?? "—";
  if (key === "gender") {
    return user.gender === Gender.Male ? "Мужской" : "Женский";
  }
  return user[key] as string | number;
}

export function UserTable({ users, sort, onSort, filter, onFilterChange }: UserTableProps) {
  const tableRef = useRef<HTMLTableElement>(null);
  const { widths, startResize } = useColumnResize(tableRef, COLUMNS.length);

  const renderFilterControl = (column: Column) => {
    if (!column.field) return null;
    const value = filter[column.field] ?? "";

    if (column.key === "gender") {
      return (
        <select
          className="filter-control"
          value={value}
          onChange={(e) => onFilterChange(column.field as SortableField, e.target.value)}
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
        onChange={(e) => onFilterChange(column.field as SortableField, e.target.value)}
      />
    );
  };

  return (
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
            <tr key={user.id}>
              {COLUMNS.map((column) => (
                <td key={column.key}>{renderCell(user, column.key)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
