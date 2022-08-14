import { clientApi } from 'utils/api';
import { configs } from 'constant';
import { CityListResponse } from './api-city.type';

export const getAllCity = (): Promise<CityListResponse> => {
  return clientApi.get(`${configs.apiCityUrl}`).then((res) => {
    if (res.data) {
      return res.data.data;
    }
    return {} as CityListResponse;
  });
};
