import { IApiResponse } from 'types/api.types';

export interface SellerListResponse extends IApiResponse {
  data: Array<Seller>;
}

export type Seller = {
  _id: string;
  user: User;
  logo: Logo;
  wallImage: WallImage;
  name: string;
  description: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  phone: string;
  fullPhone: string;
  googleId: string;
  facebookId: string;
  appleId: string;
  profile: Profile;
  lastLogin: string;
  country: Country;
  status: string;
  statusSeller: string;
  isSeller: string;
  dateCreated: string;
  dateUpdated: string;
};

export type Country = {
  _id: string;
  id: string;
  name: string;
  flag: string;
  numberCode: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type Logo = {
  _id: string;
  user: string;
  type: string;
  bucket: string;
  prefix: string;
  key: string;
  profiles: [];
  originalName: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type WallImage = {
  _id: string;
  user: string;
  type: string;
  bucket: string;
  prefix: string;
  key: string;
  profiles: [];
  originalName: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type Profile = {
  fullName: string;
  dateOfBirth: string;
  avatar: string;
};

export type SellerUpdateData = Omit<Seller, 'logo' | 'wallImage'> & {
  // country?: string;
  logo?: string;
  wallImage?: string;
};
