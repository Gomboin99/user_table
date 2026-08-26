import { useState, useEffect, useMemo, useCallback } from "react";
import type { User } from "../../domain/models/User";
import type { SortState } from "../../domain/models/SortState";
import type { SortableField } from "../../domain/models/types/SortableField";
import { SortDirection } from "../../domain/models/enums/SortDirection";
import type { FilterState, FilterableField } from "../../domain/models/types/FilterState";
import { RequestError } from "../../domain/errors/Errors";
import { container } from "../../di/Container";
import { PAGE_SIZE } from "../../config/constants";

export function useUsers() {
  const userRepository = container.getUsersRepository();

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const [sort, setSort] = useState<SortState>({
    field: null,
    direction: SortDirection.None,
  });
  const [rawFilter, setRawFilter] = useState<FilterState>({});
  const [appliedFilter, setAppliedFilter] = useState<FilterState>({});
  const [page, setPage] = useState(1);

  const query = useMemo(() => {
    const result: Parameters<typeof userRepository.getUsers>[0] = {
      page
    };

    const active = (
      Object.entries(appliedFilter) as [FilterableField, string][]
    ).filter(([, value]) => value.trim() !== "");
    if (active.length > 0) {
      const [key, value] = active[0];
      result.filter = { key, value };
    }

    if (sort.field !== null && sort.direction !== SortDirection.None) {
      result.sort = {
        field: sort.field,
        order: sort.direction === SortDirection.Asc ? "asc" : "desc",
      };
    }

    return result;
  }, [appliedFilter, sort, page, userRepository]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const next: FilterState = {};
      for (const [field, value] of Object.entries(rawFilter)) {
        const trimmed = value.trim();
        if (trimmed.length >= 2) {
          next[field as FilterableField] = trimmed;
        }
      }

      if (JSON.stringify(next) === JSON.stringify(appliedFilter)) return;

      setLoading(true);
      setPage(1);
      setAppliedFilter(next);
    }, 2000);

    return () => clearTimeout(timer);
  }, [rawFilter, appliedFilter]);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    userRepository
      .getUsers(query, controller.signal)
      .then(({ users, total }) => {
        if (!cancelled) {
          setUsers(users);
          setTotal(total);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof RequestError) {
          setError(err.message);
        } else if (err instanceof DOMException && err.name === "AbortError") {
          setError(null);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Неизвестная ошибка");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [userRepository, query, reloadToken]);

  const cycleSort = useCallback((field: SortableField) => {
    setLoading(true);
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

  const changeFilter = useCallback((field: FilterableField, value: string) => {
    setRawFilter(value === "" ? {} : { [field]: value });
  }, []);

  const goToPage = useCallback((next: number) => {
    setLoading(true);
    setPage(next);
  }, []);

  const reload = useCallback(() => {
    setError(null);
    setLoading(true);
    setReloadToken((token) => token + 1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    users,
    total,
    totalPages,
    page,
    loading,
    error,
    sort,
    filter: rawFilter,
    cycleSort,
    changeFilter,
    setPage: goToPage,
    reload,
  };
}
