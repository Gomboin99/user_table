import type { UserFieldForActions } from "../../../domain/models/types/UserFieldForActions";
import type { UserFilterState } from "../../../domain/models/types/UserFilterState";
import type { Column } from "./columns";


interface UserFilterControlProps {
  column: Column;
  filter: UserFilterState;
  onFilterChange: (field: UserFieldForActions, value: string) => void;
}

export function UserFilterControl({
  column,
  filter,
  onFilterChange,
}: UserFilterControlProps) {
  const field = column.field;
  if (!field) return null;
  const value = filter[field] ?? "";

  if (column.key === "gender") {
    return (
      <select
        className="filter-control"
        value={value}
        onChange={(e) => onFilterChange(field, e.target.value)}
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
      onChange={(e) => onFilterChange(field, e.target.value)}
    />
  );
}
