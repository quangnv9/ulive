import { PagingTable } from 'components/Pagination';
import { useParseParams } from 'hooks/use-params';
import { Alert } from 'antd';
import { initFilter } from 'constant';
import { useAllGroupPermissionQuery } from '../permission.queries';
import { GroupPermissionListing } from '../GroupPermissionListing';
import { SearchSortFilter } from 'modules/User/Permission/components/SearchSortFilter';

export function PermissionMain() {
  const { pageSize, page, content, sort, status } = useParseParams();
  const groupPermissionFilter = {
    pageSize: pageSize ?? initFilter.pageSize,
    page: page ?? initFilter.page,
    content,
    sort,
    status,
  };

  const { data, error, isLoading } = useAllGroupPermissionQuery(groupPermissionFilter);

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
            <GroupPermissionListing
              groupPermission={data?.data}
              isLoading={isLoading}
              page={groupPermissionFilter.page}
              perPage={groupPermissionFilter.pageSize}
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
