import type { SortableField } from "./SortableField";

export type FilterableField = SortableField;

export type FilterState = Partial<Record<FilterableField, string>>;
