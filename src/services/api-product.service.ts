import { configs } from 'constant';
import { ApiParam } from 'types/api.types';
import { clientApi } from 'utils/api';
import { ProductListResponse, UpdateProductStatus } from './api-product.type';

export interface PaginationParams extends ApiParam {
  sort?: string;
}

export const getProducts = (id: string, filter: PaginationParams): Promise<ProductListResponse> => {
  return clientApi
    .get(`${configs.apiShoppingBaseUrl}/api/v1/product/admin/list/${id}`, {
      params: filter,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data;
      }

      return {} as ProductListResponse;
    });
};

export const removeProduct = (ids: Array<string>) => {
  return clientApi
    .delete(`${configs.apiShoppingBaseUrl}/api/v1/product/admin/delete`, {
      data: {
        productIds: ids,
      },
    })
    .then((res) => {
      return {};
    });
};

export const updateProductStatus = (product: UpdateProductStatus): Promise<UpdateProductStatus> => {
  return clientApi
    .patch(`${configs.apiShoppingBaseUrl}/api/v1/product/admin/status/${product._id}`, {
      ...product,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data;
      }

      return {} as UpdateProductStatus;
    });
};
