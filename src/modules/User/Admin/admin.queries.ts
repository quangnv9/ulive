import { AdminUpdateData, NewAdmin } from 'services/api-admin.type';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  getAllCountry,
  getListGroupPermission,
  updateAdminById,
  PermissionStatus,
  getAllAdmins,
  updateAdmin,
  createAdmin,
} from 'services/api-admin.service';

import { getAdminById } from 'services/api-admin.service';
import { PaginationParams } from 'services/api-buyer.service';

export const useAllAdminsQuery = (filter: PaginationParams) => {
  return useQuery(['allAdmins', filter], () => {
    return getAllAdmins(filter);
  });
};

export const useUpdateAdminStatus = () => {
  const queryClient = useQueryClient();
  return useMutation((admin: AdminUpdateData) => updateAdmin(admin), {
    onSuccess: () => {
      queryClient.invalidateQueries('allAdmins');
    },
  });
};

export const useAllCountryQuery = (pageSize: string) => {
  return useQuery(['allCountry'], () => {
    return getAllCountry(pageSize);
  });
};

export const useAdminByIdQuery = (id: string) => {
  return useQuery(['detailAdmin', id], () => {
    return getAdminById(id);
  });
};

export const useGetListGroupPermissionQuery = (status: PermissionStatus) => {
  return useQuery(['listGroupPermission', status], () => {
    return getListGroupPermission(status);
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation((adminDetail: AdminUpdateData) => updateAdminById(adminDetail), {
    onSuccess: () => {
      queryClient.invalidateQueries('detailAdmin');
    },
  });
};

export const useAdminCreate = () => {
  const queryClient = useQueryClient();
  return useMutation((newAdmin: NewAdmin) => createAdmin(newAdmin), {
    onSuccess: () => {
      queryClient.invalidateQueries('createAdmin');
    },
  });
};
