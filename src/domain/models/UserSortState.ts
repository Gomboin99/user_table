import type { UserFieldForActions } from "./types/UserFieldForActions";
import type { SortDirection } from "./enums/SortDirection";

export interface UserSortState {
  field: UserFieldForActions | null;
  direction: SortDirection;
}
