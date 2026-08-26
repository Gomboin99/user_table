import { PAGE_SIZE } from "../../config/constants";
import { useUserTableState } from "./useUserTableState";
import { useFetchUsers } from "./useFetchUsers";

export function useUsers() {
  const { params, sort, rawFilter, page, cycleSort, changeFilter, goToPage } =
    useUserTableState();
  const { users, total, loading, error, reload } = useFetchUsers(params);

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
