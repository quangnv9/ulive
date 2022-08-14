export enum AdminEStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export type AdminVariantStatusOption = AdminEStatus.Active | AdminEStatus.Inactive;

export type AdminFilterType = {
  [AdminEStatus.Active]: boolean;
  [AdminEStatus.Inactive]: boolean;
};

export enum ESortByAdmin {
  DateCreatedAsc = 'dateCreated:1',
  DateCreatedDec = 'dateCreated:-1',
}
