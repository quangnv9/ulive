import { AdminEStatus, AdminFilterType, AdminVariantStatusOption } from './admin.type';

export const adminStatus = [AdminEStatus.Active, AdminEStatus.Inactive] as AdminVariantStatusOption[];

export const classAdminOptionByVariant: Record<AdminVariantStatusOption, string> = {
  Active: 'active',
  Inactive: 'inactive',
};
export const initFilterByStatusAdmin: AdminFilterType = {
  [AdminEStatus.Active]: false,
  [AdminEStatus.Inactive]: false,
};
