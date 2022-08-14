import { IApiResponse } from 'types/api.types';
import { Seller } from './api-seller.type';

export interface AddressResponse extends IApiResponse {
  data: Array<Address>;
}

export type City = {
  countryId: number;
  dateCreated: string;
  dateUpdated: string;
  id: number;
  name: string;
  status: string;
  _id: string;
};

export type Address = {
  _id: string;
  user: string;
  phone: string;
  fullName: string;
  city: City | null;
  address: string;
  subAddress: string;
  label: string;
  isDefault: boolean;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type AddressUpdate = Omit<Address, 'city'> & {
  city?: string;
};

export interface SellerAddressResponse extends IApiResponse {
  data: Array<SellerAddress>;
}

export type SellerAddress = {
  _id: string;
  shopProfile: Seller;
  phone: string;
  fullName: string;
  city: City | null;
  address: string;
  label: string;
  isDefault: boolean;
  status: string;
  dateCreated: string;
  dateUpdated: string;
  subAddress: string | null;
};

export type SellerAddressUpdate = Omit<SellerAddress, 'city'> & {
  city?: string;
};
