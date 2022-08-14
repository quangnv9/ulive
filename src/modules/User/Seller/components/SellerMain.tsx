import { PagingTable } from 'components/Pagination';
import { useParseParams } from 'hooks/use-params';
import { SearchSortFilter } from './SearchSortFilter';
import { initFilter } from 'constant';
import { SellerListing } from './SellerListing';
import { useAllSellersQuery } from '../seller.queries';
import { Alert } from 'antd';

export function SellerMainPage() {
  const { pageSize, page, content, sort, status } = useParseParams();

  const sellerFilter = {
    page: page ?? initFilter.page,
    pageSize: pageSize ?? initFilter.pageSize,
    content,
    sort,
    status,
  };

  const { data, error, isLoading } = useAllSellersQuery(sellerFilter);

  return (
    <div>
      {error ? (
        <Alert message="No results found" type="error" />
      ) : (
        <>
          <div className="search-sort-filter">
            <SearchSortFilter />
          </div>
          <div className="listing-table-container">
            <SellerListing
              sellers={data?.data}
              isLoading={isLoading}
              page={sellerFilter.page}
              perPage={sellerFilter.pageSize}
            />

            {(data?.totalItem as number) > 0 && (
              <PagingTable
                currentPage={page ? page : initFilter.page}
                pageSize={pageSize ? pageSize : initFilter.pageSize}
                totalItem={data?.totalItem}
                totalPage={data?.totalPage}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
