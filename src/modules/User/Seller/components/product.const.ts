import { EStatus, VariantStatusOption } from './product.type';

export const productStatus = [EStatus.Active, EStatus.Inactive] as VariantStatusOption[];

export const classOptionByVariant: Record<VariantStatusOption, string> = {
  Active: 'active',
  Inactive: 'inactive',
};
