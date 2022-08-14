import { IApiResponse } from 'types/api.types';

export interface AttributeListResponse extends IApiResponse {
  data: Array<Attribute>;
}

export type Attribute = {
  _id: string;
  name: string;
  status: string;
  type: string;
  deletedAt: string;
  dateCreated: string;
  dateUpdated: string;
};

export type NewAttribute = {
  name: string | undefined;
  status: string | undefined;
};
