export const SortDirection = {
    None: "none",
    Asc: "asc",
    Desc: "desc",
  } as const;
  
  export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection];