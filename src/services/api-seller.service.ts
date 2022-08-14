import { Seller, SellerListResponse, SellerUpdateData } from './api-seller.type';
import { clientApi } from 'utils/api';
import { ApiParam } from 'types/api.types';
import { configs } from 'constant';

export interface PaginationParams extends ApiParam {
  sort?: string;
}

export const getAllSeller = (filter: PaginationParams): Promise<SellerListResponse> => {
  return clientApi
    .get(`${configs.apiBaseUrl}/shop-profile`, {
      params: filter,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data;
      }
      return {} as SellerListResponse;
    });
};

export const updateSeller = (seller: SellerUpdateData): Promise<SellerUpdateData> => {
  return clientApi
    .patch(`${configs.apiBaseUrl}/shop-profile/${seller._id}`, {
      ...seller,
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as SellerUpdateData;
    });
};

export const getSellerById = (id: string): Promise<Seller> => {
  return clientApi.get(`${configs.apiBaseUrl}/shop-profile/${id}`).then((res) => {
    if (res.data) {
      return res.data.data;
    }
    return {} as Seller;
  });
};
