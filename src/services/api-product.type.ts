import { IApiResponse } from 'types/api.types';

export interface ProductListResponse extends IApiResponse {
  data: Array<Product>;
}
export type Product = {
  _id?: string;
  key: string;
  name: string;
  category: string;
  type: string;
  imageIds: ImageIds;
  descriptions: string;
  updatedBy: string;
  createdBy: string;
  status: string;
  isDeleted: boolean;
  deletedAt: string;
  dateCreated: string;
  dateUpdated: string;
  productVariant: ProductVariant;
};

export type ImageIds = {
  _id: string;
  user: string;
  type: string;
  bucket: string;
  prefix: string;
  key: string;
  profiles: any;
  originalName: string;
  status: string;
  dateCreated: string;
  dateUpdated: string;
};

export type ProductVariant = {
  minPrice: number;
  maxPrice: number;
  minDiscountPrice: number;
  maxDiscountPrice: number;
  minOriginalPrice: number;
  maxOriginalPrice: number;
  totalQuantity: number;
  totalVariant: number;
};
export type UpdateProductStatus = {
  _id: string;
  status: string;
};

export interface Category {
  _id: string;
  name: string;
  path: null | string;
  status: string;
  title: string;
  children?: Category[];
}
export interface CateSelected {
  key: string;
  title: string;
}
