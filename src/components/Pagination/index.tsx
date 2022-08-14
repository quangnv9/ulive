import { Pagination, Select } from 'antd';
import './pagination.scss';
import { useHistory } from 'react-router';
import { useParseParams } from 'hooks/use-params';
import { mergeParam } from 'utils/helper';
import { initFilter, listSizePage } from 'constant';
import { useLocation } from 'react-router-dom';
import React from 'react';

export interface PagingTableProp {
  pageSize: number;
  currentPage: number;
  totalPage?: number;
  totalItem?: number;
  onSelectedRowKeys?: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PagingTable = ({
  pageSize,
  totalPage = 0,
  currentPage,
  totalItem = 0,
  onSelectedRowKeys,
}: PagingTableProp) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const currentFilter = useParseParams();
  const { Option } = Select;
  const handleSetPageSize = (perPage: string) => {
    const newUrl = mergeParam(pathname, {
      ...currentFilter,
      page: initFilter.page,
      pageSize: perPage,
    });
    history.push(newUrl);
  };

  const handleSetCurrentPage = (selectedPage: number) => {
    onSelectedRowKeys?.([]);
    const newUrl = mergeParam(pathname, {
      ...currentFilter,
      page: selectedPage,
      pageSize: currentFilter.pageSize ?? initFilter.pageSize,
    });
    history.push(newUrl);
  };

  return (
    <div className="area-paging">
      <div className="paging-record">
        <div className="size-page">
          <Select
            value={`${pageSize} records/ page`}
            style={{ width: 185, color: '#a9a9ba' }}
            className="select-sizePage"
            onChange={handleSetPageSize}
            placeholder="records/ page"
          >
            {listSizePage.map((item, sizeIdx) => (
              <Option value={item} key={`pagination-size-${sizeIdx}`}>
                {item} records/ page
              </Option>
            ))}
          </Select>
          <label className="lbl-record">
            <span>{totalItem} records</span>
          </label>
        </div>
      </div>
      {totalPage > 1 && (
        <div className="choose-page">
          <Pagination
            size="default"
            className="paging-custom"
            defaultCurrent={currentPage}
            onChange={handleSetCurrentPage}
            total={totalItem}
            pageSize={pageSize}
            showQuickJumper
            locale={{ jump_to: 'Page' }}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};
