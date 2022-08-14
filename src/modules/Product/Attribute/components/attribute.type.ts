export enum EStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}
export type variantStatusOption = EStatus.Active | EStatus.Inactive;

export type FilterType = {
  [EStatus.Active]: boolean;
  [EStatus.Inactive]: boolean;
};
