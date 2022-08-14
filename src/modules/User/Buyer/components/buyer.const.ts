import { EStatus, FilterType, variantStatusOption } from './buyer.type';

export const buyerStatus = [EStatus.Active, EStatus.Inactive, EStatus.Banned] as variantStatusOption[];

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
