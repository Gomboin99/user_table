import type { SortableField } from "../../domain/models/types/SortableField";
import { SortDirection } from "../../domain/models/enums/SortDirection";
import type { SortState } from "../../domain/models/SortState";

interface SortableHeaderProps {
  label: string;
  field: SortableField;
  sort: SortState;
  onSort: (field: SortableField) => void;
}

const indicator: Record<SortDirection, string> = {
  [SortDirection.None]: "⇅",
  [SortDirection.Asc]: "↑",
  [SortDirection.Desc]: "↓",
};

export function SortableHeader({ label, field, sort, onSort }: SortableHeaderProps) {
  const active = sort.field === field;
  const symbol = active ? indicator[sort.direction] : indicator[SortDirection.None];

  return (
    <th
      onClick={() => onSort(field)}
      className={active ? "sortable active" : "sortable"}
      aria-sort={
        active && sort.direction === SortDirection.Asc
          ? "ascending"
          : active && sort.direction === SortDirection.Desc
            ? "descending"
            : "none"
      }
    >
      <span className="th-content">
        {label}
        <span className="sort-indicator">{symbol}</span>
      </span>
    </th>
  );
}
