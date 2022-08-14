import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  getAddressBuyId,
  updateBuyerAddress,
  deleteBuyerAddress,
  getAddressDetailById,
} from 'services/api-address.service';
import { AddressUpdate } from 'services/api-address.type';
import { PaginationParams, getAllBuyers, updateBuyer, getBuyerById } from 'services/api-buyer.service';
import { BuyerUpdateData } from 'services/api-buyer.type';

export const useAllBuyersQuery = (filter: PaginationParams) => {
  return useQuery(['allBuyers', filter], () => {
    return getAllBuyers(filter);
  });
};

export const useUpdateBuyer = () => {
  const queryClient = useQueryClient();
  return useMutation((buyer: BuyerUpdateData) => updateBuyer(buyer), {
    onSuccess: () => {
      queryClient.invalidateQueries('allBuyers');
    },
  });
};

export const useBuyerAllAddressQuery = (id: string) => {
  return useQuery(['allAddressOfBuyer', id], () => {
    return getAddressBuyId(id);
  });
};

export const useDetailAddressQuery = (addressId: string) => {
  return useQuery(['detailAddress', addressId], () => {
    return getAddressDetailById(addressId);
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation((buyerAddress: AddressUpdate) => updateBuyerAddress(buyerAddress), {
    onSuccess: () => {
      queryClient.invalidateQueries('allAddressOfBuyer');
    },
  });
};

export const useDeleteBuyerAddress = () => {
  const queryClient = useQueryClient();
  return useMutation((addresId: string) => deleteBuyerAddress(addresId), {
    onSuccess: () => {
      queryClient.invalidateQueries('allAddressOfBuyer');
    },
  });
};

export const useGetBuyer = (id: string) => {
  return useQuery(['detailBuyer', id], () => {
    return getBuyerById(id);
  });
};
