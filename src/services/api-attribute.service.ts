import { clientApi, extractErrors } from './../utils/api';
import { ApiParam } from 'types/api.types';
import { configs } from 'constant';
import { Attribute, AttributeListResponse, NewAttribute } from './api-attribute.type';
import { AxiosError } from 'axios';

export interface PaginationParams extends ApiParam {
  sort?: string;
}

export const getAllAttribute = (filter: PaginationParams): Promise<AttributeListResponse> => {
  return clientApi
    .get(`${configs.apiShoppingBaseUrl}/api/v1/admin/attribute`, {
      params: filter,
    })
    .then((res) => {
      if (res.data) {
        return res.data.data;
      }
      return {} as AttributeListResponse;
    });
};

export const updateAttribute = (attribute: Attribute): Promise<Attribute> => {
  return clientApi
    .patch(`${configs.apiShoppingBaseUrl}/api/v1/admin/attribute/${attribute._id}`, {
      ...attribute,
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as Attribute;
    })
    .catch((error: AxiosError) => extractErrors(error));
};

export const deleteAttribute = (attributeId: string): Promise<Attribute> => {
  return clientApi
    .delete(`${configs.apiShoppingBaseUrl}/api/v1/admin/attribute/${attributeId}`)
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as Attribute;
    })
    .catch((error: AxiosError) => extractErrors(error));
};

export const createAttribute = (newAttribute: NewAttribute): Promise<NewAttribute> => {
  return clientApi
    .post(`${configs.apiShoppingBaseUrl}/api/v1/admin/attribute`, newAttribute)
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      return {} as NewAttribute;
    })
    .catch((error: AxiosError) => extractErrors(error));
};
