import { configs } from 'constant';
import { Buyer, BuyerListResponse, BuyerUpdateData } from './api-buyer.type';
import { clientApi } from 'utils/api';
import { ApiParam } from 'types/api.types';

export interface PaginationParams extends ApiParam {
  sort?: string;
}

export const getAllBuyers = (filter: PaginationParams): Promise<BuyerListResponse> => {
  return clientApi
    .get(`${configs.apiBaseUrl}/user`, {
      params: filter,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data;
      }
      return {} as BuyerListResponse;
    });
};

export const updateBuyer = (buyer: BuyerUpdateData): Promise<BuyerUpdateData> => {
  return clientApi
    .patch(`${configs.apiBaseUrl}/user/${buyer._id}`, {
      ...buyer,
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as BuyerUpdateData;
    });
};
export const getBuyerById = (id: string): Promise<Buyer> => {
  return clientApi.get(`${configs.apiBaseUrl}/user/${id}`).then((res) => {
    if (res.data) {
      return res.data.data;
    }
    return {} as Buyer;
  });
};
