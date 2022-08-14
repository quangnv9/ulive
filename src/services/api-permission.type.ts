import { IApiResponse } from 'types/api.types';

export interface GroupPermissionResponse extends IApiResponse {
  data: Array<GroupPermission>;
}

export type GroupPermission = {
  _id?: string;
  name: string;
  status: string;
  dateCreated?: string;
  dateUpdated?: string;
  permissions?: Array<string>;
  description?: string;
};

export type Permission = {
  _id: string;
  action: string;
  resource: string;
  description: string;
  status: string;
};
