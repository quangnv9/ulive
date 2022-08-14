import { Alert } from 'antd';
import { PagingTable } from 'components/Pagination';
import { initFilter } from 'constant';
import { useParseParams } from 'hooks/use-params';
import { useAllAdminsQuery } from '../admin.queries';
import { AdminListing } from '../components/AdminListing';
import { SearchSortFilter } from './SearchSortFilter';

export function AdminMainPage() {
  const { page, pageSize, keyWord, sort, status } = useParseParams();

  const AdminFilter = {
    page: page ?? initFilter.page,
    pageSize: pageSize ?? initFilter.pageSize,
    keyWord,
    sort,
    status,
  };

  const { data, error, isLoading } = useAllAdminsQuery(AdminFilter);

  return (
    <>
      {error ? (
        <Alert message="No result found" type="error" />
      ) : (
        <>
          <div className="search-sort-filter">
            <SearchSortFilter />
          </div>
          <div className="listing-table-container">
            <AdminListing
              admin={data?.data}
              page={AdminFilter.page}
              perPage={AdminFilter.pageSize}
              isLoading={isLoading}
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
    </>
  );
}
