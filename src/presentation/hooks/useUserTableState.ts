import { useState, useMemo, useCallback } from "react";
import type { UserSortState } from "../../domain/models/UserSortState";
import type { UserFieldForActions } from "../../domain/models/types/UserFieldForActions";
import { SortDirection } from "../../domain/models/enums/SortDirection";
import type { UserFilterState } from "../../domain/models/types/UserFilterState";
import { FILTER_DEBOUNCE_MS } from "../../config/constants";
import { useDebounce } from "./useDebounce";
import type { GetUserParams } from "../../domain/models/GetUserParams";
import { container } from "../../di/Container";

export function useUserTableState() {
  const [sort, setSort] = useState<UserSortState>({
    field: null,
    direction: SortDirection.None,
  });
  const [rawFilter, setRawFilter] = useState<UserFilterState>({});
  const [page, setPage] = useState(1);
  const userInteractor = container.getUserInteractor();

  const debouncedRawFilter = useDebounce(rawFilter, FILTER_DEBOUNCE_MS);

  const appliedFilter = useMemo<UserFilterState>(() => {
    return userInteractor.getAppliedFilter(debouncedRawFilter);
  }, [debouncedRawFilter, userInteractor]);

  const params = useMemo<GetUserParams>(() => {
    return userInteractor.buildGetUsersParams(appliedFilter, page, sort);
  }, [userInteractor, appliedFilter, page, sort]);

  const cycleSort = useCallback((field: UserFieldForActions) => {
    setSort((prev) =>  userInteractor.toggleSort(prev, field));
    setPage(1);
  }, [userInteractor]);

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
