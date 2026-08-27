import { useEffect, useRef, useState } from "react";
import { SortableHeader } from "../SortableHeader";
import { Resizer } from "../Resizer";
import { useColumnResize } from "../../hooks/useColumnResize";
import { UserDetailsModal } from "../UserDetailsModal";
import { COLUMNS } from "./columns";
import { renderUserCell } from "./renderUserCell";
import { UserFilterControl } from "./UserFilterControl";
import type { User } from "../../../domain/models/User";
import type { UserSortState } from "../../../domain/models/UserSortState";
import type { UserFieldForActions } from "../../../domain/models/types/UserFieldForActions";
import type { UserFilterState } from "../../../domain/models/types/UserFilterState";

interface UserTableProps {
  users: User[];
  sort: UserSortState;
  onSort: (field: UserFieldForActions) => void;
  filter: UserFilterState;
  onFilterChange: (field: UserFieldForActions, value: string) => void;
}

export function UserTable({
  users,
  sort,
  onSort,
  filter,
  onFilterChange,
}: UserTableProps) {
  const tableRef = useRef<HTMLTableElement>(null);
  const { widths, startResize } = useColumnResize(tableRef, COLUMNS.length);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!selectedUser) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedUser(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedUser]);

  return (
    <>
      <table ref={tableRef} className="user-table">
        <thead>
          <tr>
            {COLUMNS.map((column, index) => {
              const width = widths[index];
              const filterControl = (
                <UserFilterControl
                  column={column}
                  filter={filter}
                  onFilterChange={onFilterChange}
                />
              );
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
                role="button"
                tabIndex={0}
                aria-label={`Подробнее о ${user.firstName} ${user.lastName}`}
                onClick={() => setSelectedUser(user)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedUser(user);
                  }
                }}
              >
                {COLUMNS.map((column) => (
                  <td key={column.key}>{renderUserCell(user, column.key)}</td>
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
