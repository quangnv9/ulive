export enum EStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum ESortBy {
  PriceAsc = 'highest',
  PriceDec = 'lowest',
}

export type VariantStatusOption = EStatus.Active | EStatus.Inactive;
