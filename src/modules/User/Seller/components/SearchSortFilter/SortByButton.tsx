import { Dropdown, Menu } from 'antd';
import { mergeParam } from 'utils/helper';
import { useMemo } from 'react';
import { ESortBy } from '../seller.type';
import { initFilter } from 'constant';
import { CommonButton } from 'components/CommonButton';
import { ArrowDownSortIcon } from 'components/icons';

export type SortComponentProps = {
  history: any;
  location: any;
  currentFilter: any;
};

export const SortByComponent = ({ history, location, currentFilter }: SortComponentProps) => {
  const classByStatus = useMemo(() => {
    return {
      newest: !currentFilter.sort ? 'text-selected' : '',
      oldest: currentFilter.sort === ESortBy.DateCreatedAsc ? 'text-selected' : '',
    };
  }, [currentFilter]);

  const handleSort = (input?: string) => {
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, sort: input });
    history.push(newUrl);
  };

  const menu = (
    <Menu className="sortby-dropdown-menu seller">
      <div className="sortby-dropdown-menu-container flex flex-column">
        <span onClick={() => handleSort()} className={`${classByStatus['newest']} sort-item`}>
          Newest Created Date
        </span>
        <span onClick={() => handleSort(ESortBy.DateCreatedAsc)} className={`${classByStatus['oldest']} sort-item`}>
          Oldest Created Date
        </span>

        <CommonButton
          onClick={() => handleSort()}
          variant="default"
          size="small"
          space="space-large"
          textBold={false}
          block={true}
          className="tuanva"
        >
          Reset
        </CommonButton>
      </div>
    </Menu>
  );
  return (
    <Dropdown placement="bottomRight" overlay={menu}>
      <CommonButton size="middle" variant="default" icon={<ArrowDownSortIcon />} reverseIcon={true}>
        <span className="mr-2">Sort by</span>
      </CommonButton>
    </Dropdown>
  );
};
