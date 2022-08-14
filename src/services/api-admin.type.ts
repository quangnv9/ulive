import { IApiResponse } from 'types/api.types';
export interface AdminListResponse extends IApiResponse {
  data: Array<Admin>;
}

export type groupPermission = {
  description: string;
  permissions: Array<string>;
  status: string;
  _id: string;
  name: string;
};

export interface ListCountryResponse extends IApiResponse {
  data: Array<Country>;
}

export type Country = {
  _id: string;
  id: number;
  name: string;
  flag: string;
  numberCode: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type Admin = {
  _id?: string;
  email?: string;
  fullName?: string;
  avatar?: AdminAvatar;
  lastLogin?: string;
  status?: string;
  isSuperAdmin?: boolean;
  username?: string;
  country?: CountryAdmin;
  phone?: string;
  fullPhone: string;
  groupPermission?: AdminGroupPermission;
  dateCreated?: string;
  dateUpdated?: string;
};

export type AdminAvatar = {
  key?: string;
  _id?: string;
};

export type CountryAdmin = {
  _id: string;
  id: number;
  name: string;
  flag: string;
  numberCode: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type AdminGroupPermission = {
  name: string;
  description: string;
  permission: Array<string>;
  status: string;
  _id: string;
  dateCreated: string;
  dateUpdated: string;
};

export interface ListPermissionGroup extends IApiResponse {
  data: Array<GroupPermission>;
}

export type GroupPermission = {
  _id: string;
  name: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type AdminUpdateData = Omit<Admin, 'country' | 'avatar' | 'groupPermission' | 'fullName'> & {
  country?: string;
  avatar?: string;
  groupPermission?: string;
  fullName?: string | null;
};

export type NewAdmin = {
  avatar?: string;
  fullName?: string | null;
  email: string;
  phone: string;
  country: string | undefined;
  groupPermission: string;
  username?: string;
  status?: string;
};
