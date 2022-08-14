import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getProducts, PaginationParams, removeProduct, updateProductStatus } from 'services/api-product.service';
import { UpdateProductStatus } from 'services/api-product.type';

export const useAllProductQuery = (id: string, filter: PaginationParams) => {
  return useQuery(['allProducts', { id, filter }], () => {
    return getProducts(id, filter);
  });
};

export const useRemoveProductQuery = () => {
  const queryClient = useQueryClient();
  return useMutation((ids: Array<string>) => removeProduct(ids), {
    onSuccess: () => {
      queryClient.invalidateQueries('allProducts');
    },
  });
};

export const useUpdateStautusProductQuery = () => {
  const queryClient = useQueryClient();
  return useMutation((product: UpdateProductStatus) => updateProductStatus(product), {
    onSuccess: () => {
      queryClient.invalidateQueries('allProducts');
    },
  });
};
