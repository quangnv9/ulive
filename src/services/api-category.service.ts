import { configs } from 'constant';
import { clientApi } from 'utils/api';

export const categoryApi = {
  async getAllCategory() {
    try {
      const response = await clientApi.get(`${configs.apiShoppingBaseUrl}/api/v1/admin/category`);
      if (response.data.statusCode === 200) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      return error;
    }
  },
  async editCategory(bodyEdit: any, idCate: string) {
    return await clientApi.patch(`${configs.apiShoppingBaseUrl}/api/v1/admin/category/${idCate}`, bodyEdit);
  },
  async addCategory(bodyCreate: any) {
    return await clientApi.post(`${configs.apiShoppingBaseUrl}/api/v1/admin/category`, bodyCreate);
  },
  async deleteCategory(cateId: string) {
    return await clientApi.delete(`${configs.apiShoppingBaseUrl}/api/v1/admin/category/${cateId}`);
  },
};
