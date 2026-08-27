export interface GetUserParams {
    filter?: { key: string; value: string };
    sort?: { field: string; order: "asc" | "desc" };
    page: number;
  }