import { configs } from 'constant';
import { Admin, AdminListResponse, GroupPermission, AdminUpdateData, NewAdmin, Country } from './api-admin.type';
import { clientApi, extractErrors } from 'utils/api';
import { AxiosError } from 'axios';
import { PaginationParams } from './api-buyer.service';

export type PermissionStatus = {
  status: string;
};

export const getAllAdmins = (filter: PaginationParams): Promise<AdminListResponse> => {
  return clientApi
    .get(`${configs.apiBaseUrl}/list`, {
      params: filter,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data;
      }

      return {} as AdminListResponse;
    });
};

export const updateAdmin = (admin: AdminUpdateData): Promise<AdminUpdateData> => {
  return clientApi
    .patch(`${configs.apiBaseUrl}/update/${admin._id}`, {
      ...admin,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data;
      }
      return {} as AdminUpdateData;
    });
};

export const getAllCountry = (pageSize: string): Promise<Country[]> => {
  return clientApi.get(`${configs.apiCountryUrl}${pageSize}`).then((res) => {
    if (res.data) {
      return res.data.data.data;
    }
    return [] as Country[];
  });
};

export const getAdminById = (id: string): Promise<Admin> => {
  return clientApi.get(`${configs.apiBaseUrl}/detail/${id}`).then((res) => {
    if (res.data) {
      return res.data.data;
    }
    return {} as Admin;
  });
};

export const getListGroupPermission = (status: PermissionStatus): Promise<GroupPermission[]> => {
  return clientApi
    .get(`${configs.apiBaseUrl}/group-permission`, {
      params: status,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data.data;
      }
      return [] as GroupPermission[];
    });
};

export const updateAdminById = (adminDetail: AdminUpdateData): Promise<AdminUpdateData> => {
  return clientApi
    .patch(`${configs.apiBaseUrl}/update/${adminDetail._id}`, adminDetail)
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as AdminUpdateData;
    })
    .catch((error: AxiosError) => extractErrors(error));
};

export const createAdmin = (newAdmin: NewAdmin): Promise<NewAdmin> => {
  return clientApi
    .post(`${configs.apiBaseUrl}/create`, newAdmin)
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as NewAdmin;
    })
    .catch((error: AxiosError) => extractErrors(error));
};
