import { BuyerListing } from './BuyerListing';
import { PagingTable } from 'components/Pagination';
import { useAllBuyersQuery } from '../buyer.queries';
import { useParseParams } from 'hooks/use-params';
import { Alert } from 'antd';
import { SearchSortFilter } from './SearchSortFilter';
import { initFilter } from 'constant';
import './BuyerListing/styles.scss';

export function BuyerMain() {
  const { pageSize, page, content, sort, status } = useParseParams();

  const buyerFilter = {
    page: page ?? initFilter.page,
    pageSize: pageSize ?? initFilter.pageSize,
    content,
    sort,
    status,
  };

  const { data, error, isLoading } = useAllBuyersQuery(buyerFilter);

  return (
    <div>
      {error ? (
        <Alert message="No result found" type="error" />
      ) : (
        <>
          <div className="search-sort-filter">
            <SearchSortFilter />
          </div>
          <div className="listing-table-container">
            <BuyerListing
              buyers={data?.data}
              isLoading={isLoading}
              page={buyerFilter.page}
              perPage={buyerFilter.pageSize}
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
