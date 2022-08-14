import { Attribute, NewAttribute } from 'services/api-attribute.type';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createAttribute,
  deleteAttribute,
  getAllAttribute,
  PaginationParams,
  updateAttribute,
} from 'services/api-attribute.service';

export const useAllAttributeQuery = (filter: PaginationParams) => {
  return useQuery(['allAttribute', filter], () => {
    return getAllAttribute(filter);
  });
};

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation((attribute: Attribute) => updateAttribute(attribute), {
    onSuccess: () => {
      queryClient.invalidateQueries('allAttribute');
    },
  });
};

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();
  return useMutation((attributeId: string) => deleteAttribute(attributeId), {
    onSuccess: () => {
      queryClient.invalidateQueries('allAttribute');
    },
  });
};

export const useAttributeCreate = () => {
  const queryClient = useQueryClient();
  return useMutation((newAttribute: NewAttribute) => createAttribute(newAttribute), {
    onSuccess: () => {
      queryClient.invalidateQueries('allAttribute');
    },
  });
};
