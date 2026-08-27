import { useUserTableState } from "./useUserTableState";
import { useFetchUsers } from "./useFetchUsers";
import { container } from "../../di/Container";

export function useUsers() {
  const userInteractor = container.getUserInteractor();
  const { params, sort, rawFilter, page, cycleSort, changeFilter, goToPage } =
    useUserTableState();
  const { users, total, loading, error, reload } = useFetchUsers(params);

  const totalPages = userInteractor.calculateTotalPages(total);

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
