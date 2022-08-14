import { IApiResponse } from 'types/api.types';

export type CityStatus = 'Active';

export interface City {
  _id: string;
  id: number;
  countryId: number;
  name: string;
  status: CityStatus;
  dateCreated: string;
  dateUpdated: string;
}

export interface CityListResponse extends IApiResponse {
  data: Array<City>;
}
