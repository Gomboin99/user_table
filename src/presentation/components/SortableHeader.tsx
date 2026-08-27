import type { ReactNode } from "react";
import type { UserFieldForActions } from "../../domain/models/types/UserFieldForActions";
import { SortDirection } from "../../domain/models/enums/SortDirection";
import type { UserSortState } from "../../domain/models/UserSortState";
import { Resizer } from "./Resizer";

interface SortableHeaderProps {
  label: string;
  field: UserFieldForActions;
  sort: UserSortState;
  onSort: (field: UserFieldForActions) => void;
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

  const stop = (e: React.MouseEvent) => e.stopPropagation();

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
      onClick={() => onSort(field)}
    >
      <span className="th-content sort-trigger">
        {label}
        <span className="sort-indicator">{symbol}</span>
      </span>
      <div className="th-filter" onClick={stop}>
        {filterControl}
      </div>
      <span className="th-resizer" onClick={stop}>
        <Resizer onResizeStart={onResizeStart} />
      </span>
    </th>
  );
}
