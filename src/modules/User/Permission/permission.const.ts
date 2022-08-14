import { EStatus, FilterType, variantStatusOption } from './permission.type';

export const groupPermissionStatus = [EStatus.Active, EStatus.Inactive] as variantStatusOption[];

export const classOptionByVariant: Record<variantStatusOption, string> = {
  Active: 'active',
  Inactive: 'inactive',
};

export const initFilterByStatus: FilterType = {
  [EStatus.Active]: false,
  [EStatus.Inactive]: false,
};
