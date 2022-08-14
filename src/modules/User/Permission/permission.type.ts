export enum EStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum ESortBy {
  DateCreatedAsc = 'dateCreated:1',
  DateCreatedDec = 'dateCreated:-1',
  DateUpdatedAsc = 'dateUpdated:1',
  DateUpdatedDec = 'dateUpdated:-1',
}

export type variantStatusOption = EStatus.Active | EStatus.Inactive;

export type FilterType = {
  [EStatus.Active]: boolean;
  [EStatus.Inactive]: boolean;
};
