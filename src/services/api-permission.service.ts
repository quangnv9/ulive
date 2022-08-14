import { configs } from 'constant';
import { clientApi, extractErrors } from 'utils/api';
import { ApiParam } from 'types/api.types';
import { GroupPermission, GroupPermissionResponse, Permission } from './api-permission.type';
import { AxiosError } from 'axios';

export interface PaginationParams extends ApiParam {
  sort?: string;
}
export const getAllGroupPermission = (filter: PaginationParams): Promise<GroupPermissionResponse> => {
  return clientApi
    .get(`${configs.apiBaseUrl}/group-permission`, {
      params: filter,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data;
      }
      return {} as GroupPermissionResponse;
    });
};

export const updateGroupPermission = (group: GroupPermission): Promise<GroupPermission> => {
  return clientApi
    .patch(`${configs.apiBaseUrl}/group-permission/${group._id}`, {
      ...group,
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as GroupPermission;
    })
    .catch((error: AxiosError) => extractErrors(error));
};

export async function getListPermission(): Promise<Permission> {
  const res = await clientApi.get(`${configs.apiBaseUrl}/permission`);
  if (res.data) {
    return res.data.data;
  }
  return {} as Permission;
}

export const createGroupPermission = (group: any): Promise<any> => {
  return clientApi
    .post(`${configs.apiBaseUrl}/group-permission/`, {
      ...group,
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as any;
    })
    .catch((error: AxiosError) => extractErrors(error));
};

export const getGroupPerMissionById = (id: string): Promise<GroupPermission> => {
  return clientApi.get(`${configs.apiBaseUrl}/group-permission/${id}`).then((res) => {
    if (res.data) {
      return res.data.data;
    }
    return {} as GroupPermission;
  });
};
