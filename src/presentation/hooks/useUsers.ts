import { useState, useEffect, useCallback } from "react";
import type { User } from "../../domain/models/User";
import type { SortState } from "../../domain/models/SortState";
import { SortDirection } from "../../domain/models/enums/SortDirection";
import type { SortableField } from "../../domain/models/types/SortableField";
import { container } from "../../di/Container";

export function useUsers() {
  const userRepository = container.getUsersRepository();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortState>({
    field: null,
    direction: SortDirection.None,
  });

  useEffect(() => {
    let cancelled = false;

    userRepository
      .getUsers(sort)
      .then((data) => {
        if (!cancelled) {
          setUsers(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sort, userRepository]);

  const cycleSort = useCallback((field: SortableField) => {
    setSort((prev) => {
      if (prev.field !== field) {
        return { field, direction: SortDirection.Asc };
      }
      if (prev.direction === SortDirection.Asc) {
        return { field, direction: SortDirection.Desc };
      }
      return { field: null, direction: SortDirection.None };
    });
  }, []);

  return { users, loading, error, sort, cycleSort };
}
