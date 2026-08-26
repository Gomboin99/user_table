import type { ReactNode } from "react";
import type { SortableField } from "../../domain/models/types/SortableField";
import { SortDirection } from "../../domain/models/enums/SortDirection";
import type { SortState } from "../../domain/models/SortState";
import { Resizer } from "./Resizer";

interface SortableHeaderProps {
  label: string;
  field: SortableField;
  sort: SortState;
  onSort: (field: SortableField) => void;
  width?: number;
  onResizeStart: (e: React.MouseEvent) => void;
  filterControl?: ReactNode;
}

const indicator: Record<SortDirection, string> = {
  [SortDirection.None]: "⇅",
  [SortDirection.Asc]: "↑",
  [SortDirection.Desc]: "↓",
};

export function SortableHeader({
  label,
  field,
  sort,
  onSort,
  width,
  onResizeStart,
  filterControl,
}: SortableHeaderProps) {
  const active = sort.field === field;
  const symbol = active ? indicator[sort.direction] : indicator[SortDirection.None];

  return (
    <th
      className={active ? "sortable active" : "sortable"}
      style={width !== undefined ? { width } : undefined}
      aria-sort={
        active && sort.direction === SortDirection.Asc
          ? "ascending"
          : active && sort.direction === SortDirection.Desc
            ? "descending"
            : "none"
      }
    >
      <span className="th-content sort-trigger" onClick={() => onSort(field)}>
        {label}
        <span className="sort-indicator">{symbol}</span>
      </span>
      {filterControl}
      <Resizer onResizeStart={onResizeStart} />
    </th>
  );
}
