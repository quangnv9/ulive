import { Address, AddressUpdate, SellerAddress, SellerAddressUpdate } from './api-address.type';
import { clientApi } from 'utils/api';
import { configs } from 'constant';

export const getAddressBuyId = (id: string): Promise<Address[]> => {
  return clientApi.get(`${configs.apiBaseUrl}/user/${id}/address`).then((res) => {
    if (res.data) {
      return res.data.data.data;
    }
    return [] as Address[];
  });
};

export const getAddressDetailById = (addressId: string): Promise<Address> => {
  return clientApi.get(`${configs.apiBaseUrl}/address/${addressId}`).then((res) => {
    if (res.data) {
      return res.data.data;
    }
    return {} as Address;
  });
};

export const updateBuyerAddress = (buyerAddress: AddressUpdate): Promise<Address> => {
  return clientApi.patch(`${configs.apiBaseUrl}/address/${buyerAddress._id}`, buyerAddress).then((res) => {
    if (res.data) {
      return res.data;
    }
    return {} as Address;
  });
};

export const deleteBuyerAddress = (addressId: string): Promise<Address> => {
  return clientApi.delete(`${configs.apiBaseUrl}/address/${addressId}`).then((res) => {
    if (res.data) {
      return res.data;
    }
    return {} as Address;
  });
};

export const getAllSellerAddress = (id: string): Promise<SellerAddress[]> => {
  return clientApi.get(`${configs.apiBaseUrl}/shop-profile/${id}/shop-address`).then((res) => {
    if (res.data) {
      return res.data.data.data;
    }
    return [] as SellerAddress[];
  });
};

export const getSellerAddressDetailById = (sellerAddressId: string): Promise<SellerAddress> => {
  return clientApi.get(`${configs.apiBaseUrl}/shop-address/${sellerAddressId}`).then((res) => {
    if (res.data) {
      return res.data.data;
    }
    return {} as SellerAddress;
  });
};

export const updateSellerAddress = (sellerAddress: SellerAddressUpdate): Promise<SellerAddress> => {
  return clientApi.patch(`${configs.apiBaseUrl}/shop-address/${sellerAddress._id}`, sellerAddress).then((res) => {
    if (res.data) {
      return res.data;
    }
    return {} as SellerAddress;
  });
};

export const deleteSellerAddress = (sellerAddressId: string): Promise<SellerAddress> => {
  return clientApi.delete(`${configs.apiBaseUrl}/shop-address/${sellerAddressId}`).then((res) => {
    if (res.data) {
      return res.data;
    }
    return {} as SellerAddress;
  });
};
export const getDetailProduct = (productId: string): Promise<any> => {
  return clientApi.get(`${configs.apiShoppingBaseUrl}/api/v1/product/admin/${productId}`).then((res) => {
    if (res.data) {
      return res.data.data;
    }
    return {} as any;
  });
};
