import { Alert } from 'antd';
import { PagingTable } from 'components/Pagination';
import { initFilter } from 'constant';
import { useParseParams } from 'hooks/use-params';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from 'services/api-product.type';
import { useGetSeller } from '../seller.queries';
import { useAllProductQuery } from './product.queries';
import { SearchSortFilter } from './SearchSortFilterProduct';
import { SellerDetailListing } from './SellerDetailListing';

type SellerDetailParam = {
  sellerId: string;
  keyword?: string;
};

export function SellerDetailPage() {
  const { sellerId } = useParams<SellerDetailParam>();

  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string>>([]);
  const { page, pageSize, keyWord, minPrice, maxPrice, sort, categoryIds } = useParseParams();

  const ProductFilter = {
    page: page ?? initFilter.page,
    pageSize: pageSize ?? initFilter.pageSize,
    keyWord,
    minPrice,
    maxPrice,
    sort,
    categoryIds,
  };
  const { data: seller } = useGetSeller(sellerId);
  const { data, error, isLoading } = useAllProductQuery(seller?.user._id!, ProductFilter);

  function covertData(array: Product[] = []) {
    let str = JSON.stringify(array);
    str = str.replace(/_id/g, 'key');
    return JSON.parse(str);
  }
  return (
    <>
      {error ? (
        <Alert message="No result found" type="error" />
      ) : (
        <>
          <div className="search-sort-filter">
            <SearchSortFilter selectedRowKeys={selectedRowKeys} onSelectedRowKeys={setSelectedRowKeys} />
          </div>
          <div className="listing-table-container">
            <SellerDetailListing
              selectedRowKeys={selectedRowKeys}
              onSelectedRowKeys={setSelectedRowKeys}
              product={covertData(data?.data)}
              isLoading={isLoading}
            />
            {(data?.totalItem as number) > 0 && (
              <PagingTable
                onSelectedRowKeys={setSelectedRowKeys}
                currentPage={page ? page : initFilter.page}
                pageSize={pageSize ? pageSize : initFilter.pageSize}
                totalItem={data?.totalItem}
                totalPage={data?.totalPage}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
