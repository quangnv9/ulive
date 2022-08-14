import { EStatus, FilterType, variantStatusOption } from './seller.type';

export const sellerStatus = [EStatus.Active, EStatus.Inactive, EStatus.Banned] as variantStatusOption[];

export const classOptionByVariant: Record<variantStatusOption, string> = {
  Active: 'active',
  Inactive: 'inactive',
  Banned: 'banned',
};

export const initFilterByStatus: FilterType = {
  [EStatus.Active]: false,
  [EStatus.Inactive]: false,
  [EStatus.Banned]: false,
};
