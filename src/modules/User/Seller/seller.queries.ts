import { SellerAddressUpdate } from 'services/api-address.type';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  deleteSellerAddress,
  getAllSellerAddress,
  getSellerAddressDetailById,
  updateSellerAddress,
} from 'services/api-address.service';
import { getAllSeller, getSellerById, PaginationParams, updateSeller } from 'services/api-seller.service';
import { SellerUpdateData } from 'services/api-seller.type';

export const useAllSellersQuery = (filter: PaginationParams) => {
  return useQuery(['allSeller', filter], () => {
    return getAllSeller(filter);
  });
};

export const useUpdateSeller = () => {
  const queryClient = useQueryClient();
  return useMutation((seller: SellerUpdateData) => updateSeller(seller), {
    onSuccess: () => {
      queryClient.invalidateQueries('allSeller');
    },
  });
};

export const useGetSeller = (id: string) => {
  return useQuery(['detailSeller', id], () => {
    return getSellerById(id);
  });
};

export const useSellerAllAddressQuery = (id: string) => {
  return useQuery(['allAddressOfSeller', id], () => {
    return getAllSellerAddress(id);
  });
};

export const useSellerDetailAddressQuery = (sellerAddressId: string) => {
  return useQuery(['allAddressOfSeller', sellerAddressId], () => {
    return getSellerAddressDetailById(sellerAddressId);
  });
};

export const useUpdateSellerAddress = () => {
  const queryClient = useQueryClient();
  return useMutation((sellerAddress: SellerAddressUpdate) => updateSellerAddress(sellerAddress), {
    onSuccess: () => {
      queryClient.invalidateQueries('allAddressOfSeller');
    },
  });
};

export const useDeleteSellerAddress = () => {
  const queryClient = useQueryClient();
  return useMutation((sellerAddressId: string) => deleteSellerAddress(sellerAddressId), {
    onSuccess: () => {
      queryClient.invalidateQueries('allAddressOfSeller');
    },
  });
};
