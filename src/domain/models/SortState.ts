import type { SortableField } from "./types/SortableField";
import type { SortDirection } from "./enums/SortDirection";

export interface SortState {
  field: SortableField | null;
  direction: SortDirection;
}
