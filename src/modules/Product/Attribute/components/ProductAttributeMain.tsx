import { Alert } from 'antd';
import { PagingTable } from 'components/Pagination';
import { initFilter } from 'constant';
import { useParseParams } from 'hooks/use-params';
import { useAllAttributeQuery } from '../attribute.queries';
import { AttributeListing } from './AttributeListing';
import { SearchAndAdd } from './SearchAndAdd';

export function ProductAttributeMain() {
  const { pageSize, page, content } = useParseParams();

  const attributeFilter = {
    page: page ?? initFilter.page,
    pageSize: pageSize ?? initFilter.pageSize,
    content,
  };

  const { data, error, isLoading } = useAllAttributeQuery(attributeFilter);

  return (
    <div>
      {error ? (
        <Alert message="No results found" type="error" />
      ) : (
        <>
          <div className="search-sort-filter">
            <SearchAndAdd />
          </div>
          <div className="listing-table-container">
            <AttributeListing
              attributes={data?.data}
              isLoading={isLoading}
              page={attributeFilter.page}
              perPage={attributeFilter.pageSize}
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
