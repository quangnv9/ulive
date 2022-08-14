import { IApiResponse } from 'types/api.types';

export interface BuyerListResponse extends IApiResponse {
  data: Array<Buyer>;
}

export type Country = {
  dateCreated: string;
  dateUpdated: string;
  flag: string;
  id: string | number;
  name: string;
  numberCode: string;
  status: string;
  _id: string;
};

export type Avatar = {
  key: string;
  _id: string;
};
export type Profile = {
  fullName?: string;
  dateOfBith?: string;
  avatar?: Avatar;
};

export type Buyer = {
  appleId?: string;
  country?: Country;
  profile: Profile;
  phone: string;
  username: string;
  name?: string;
  lastLogin: string;
  status: string;
  statusSeller: string;
  dateUpated: string;
  dateCreated: string;
  email?: string;
  _id?: string;
};

export type BuyerUpdateData = Omit<Buyer, 'country' | 'profile'> & {
  country?: string;
  profile?: {
    avatar: string;
  };
};
