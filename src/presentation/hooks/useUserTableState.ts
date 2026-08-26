import { useState, useMemo, useCallback } from "react";
import type { UserSortState } from "../../domain/models/UserSortState";
import type { UserFieldForActions } from "../../domain/models/types/UserFieldForActions";
import { SortDirection } from "../../domain/models/enums/SortDirection";
import type { UserFilterState } from "../../domain/models/types/UserFilterState";
import { FILTER_DEBOUNCE_MS, MIN_FILTER_LENGTH } from "../../config/constants";
import { useDebounce } from "./useDebounce";
import type { GetUserParams } from "../../domain/models/GetUserParams";

export function useUserTableState() {
  const [sort, setSort] = useState<UserSortState>({
    field: null,
    direction: SortDirection.None,
  });
  const [rawFilter, setRawFilter] = useState<UserFilterState>({});
  const [page, setPage] = useState(1);

  const debouncedRawFilter = useDebounce(rawFilter, FILTER_DEBOUNCE_MS);

  const appliedFilter = useMemo<UserFilterState>(() => {
    const next: UserFilterState = {};
    for (const [field, value] of Object.entries(debouncedRawFilter)) {
      const trimmed = value.trim();
      if (trimmed.length >= MIN_FILTER_LENGTH) {
        next[field as UserFieldForActions] = trimmed;
      }
    }
    return next;
  }, [debouncedRawFilter]);

  const params = useMemo<GetUserParams>(() => {
    const result: GetUserParams = { page };

    const active = (
      Object.entries(appliedFilter) as [UserFieldForActions, string][]
    ).filter(([, value]) => value.trim() !== "");
    if (active.length > 0) {
      const [key, value] = active[0];
      result.filter = { key, value };
    }

    if (sort.field !== null && sort.direction !== SortDirection.None) {
      result.sort = { field: sort.field, order: sort.direction };
    }

    return result;
  }, [appliedFilter, sort, page]);

  const cycleSort = useCallback((field: UserFieldForActions) => {
    setSort((prev) => {
      if (prev.field !== field) return { field, direction: SortDirection.Asc };
      if (prev.direction === SortDirection.Asc) {
        return { field, direction: SortDirection.Desc };
      }
      return { field: null, direction: SortDirection.None };
    });
    setPage(1);
  }, []);

  const changeFilter = useCallback(
    (field: UserFieldForActions, value: string) => {
      setRawFilter(value === "" ? {} : { [field]: value });
      setPage(1);
    },
    []
  );

  const goToPage = useCallback((next: number) => setPage(next), []);

  return { params, sort, rawFilter, page, cycleSort, changeFilter, goToPage };
}
