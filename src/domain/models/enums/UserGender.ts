export const UserGender = {
    Male: "male",
    Female: "female",
  } as const;
  
  export type UserGender = (typeof UserGender)[keyof typeof UserGender];