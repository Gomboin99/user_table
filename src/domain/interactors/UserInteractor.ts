import { MIN_FILTER_LENGTH, PAGE_SIZE } from "../../config/constants";
import { RequestError } from "../../errors/Errors";
import type { UserRepository } from "../interfaces/UserRepository";
import type { GetUserParams } from "../models/GetUserParams";
import type { GetUsersResult } from "../models/GetUserResult";
import type { UserSortState } from "../models/UserSortState";
import { SortDirection } from "../models/enums/SortDirection";
import type { UserFieldForActions } from "../models/types/UserFieldForActions";
import type { UserFilterState } from "../models/types/UserFilterState";

export class UserInteractor {
  private repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  calculateTotalPages(countPerson: number) {
    return Math.max(1, Math.ceil(countPerson / PAGE_SIZE));
  }

  getAppliedFilter(
    debouncedRawFilter: Partial<Record<UserFieldForActions, string>>
  ): UserFilterState {
    const next: UserFilterState = {};
    for (const [field, value] of Object.entries(debouncedRawFilter)) {
      const trimmed = value.trim();
      if (trimmed.length >= MIN_FILTER_LENGTH) {
        next[field as UserFieldForActions] = trimmed;
      }
    }
    return next;
  }

  buildGetUsersParams(
    appliedFilter: Partial<Record<UserFieldForActions, string>>,
    page: number,
    sort: UserSortState
  ): GetUserParams {
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
  }

  toggleSort(sortState: UserSortState, field: UserFieldForActions) {
    if (sortState.field !== field)
      return { field, direction: SortDirection.Asc };
    if (sortState.direction === SortDirection.Asc) {
      return { field, direction: SortDirection.Desc };
    }
    return { field: null, direction: SortDirection.None };
  }

  async getUsers(
    params: GetUserParams,
    signal: AbortSignal,
    onProgress: (loading: boolean) => void
  ): Promise<GetUsersResult> {
    onProgress?.(true);

    try {
      const { users, total } = await this.repository.getUsers(params, signal);

      return {
        success: true,
        users,
        total,
      };
    } catch (err) {
      return {
        success: false,
        error: this.mapError(err),
      };
    } finally {
      onProgress?.(false);
    }
  }

  private mapError(err: unknown): string | null {
    if (err instanceof DOMException && err.name === "AbortError") {
      return null;
    }
    if (err instanceof RequestError) {
      return err.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return "Неизвестная ошибка";
  }
}
