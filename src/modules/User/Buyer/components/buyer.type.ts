export enum EStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Banned = 'Banned',
}
export enum ESortBy {
  DateCreatedAsc = 'dateCreated:1',
  DateCreatedDec = 'dateCreated:-1',
}
export type variantStatusOption = EStatus.Active | EStatus.Inactive | EStatus.Banned;

export type FilterType = {
  [EStatus.Active]: boolean;
  [EStatus.Inactive]: boolean;
  [EStatus.Banned]: boolean;
};
