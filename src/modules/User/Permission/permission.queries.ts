import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  createGroupPermission,
  getAllGroupPermission,
  getGroupPerMissionById,
  getListPermission,
  PaginationParams,
  updateGroupPermission,
} from 'services/api-permission.service';
import { GroupPermission } from 'services/api-permission.type';

export const useAllGroupPermissionQuery = (filter: PaginationParams) => {
  return useQuery(['allGroupPermission', filter], () => {
    return getAllGroupPermission(filter);
  });
};

export const useUpdateGroupPerMission = () => {
  const queryClient = useQueryClient();
  return useMutation((groupPermission: GroupPermission) => updateGroupPermission(groupPermission), {
    onSuccess: () => {
      queryClient.invalidateQueries('allGroupPermission');
    },
  });
};

export const useAllPerMissionQuery = () => {
  return useQuery(['allPermission'], () => {
    return getListPermission();
  });
};

export const useCreateGroupPermission = () => {
  const queryClient = useQueryClient();
  return useMutation((group: any) => createGroupPermission(group), {
    onSuccess: () => {
      queryClient.invalidateQueries('allPermission');
    },
  });
};

export const useGetGroupPermission = (id: string) => {
  return useQuery(['detailBuyer', id], () => {
    return getGroupPerMissionById(id);
  });
};
