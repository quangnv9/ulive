import { Dropdown, Menu } from 'antd';
import { mergeParam } from 'utils/helper';
import { useMemo } from 'react';
import { initFilter } from 'constant';
import { ESortBy } from '../../permission.type';
import { CommonButton } from 'components/CommonButton';
import { ArrowDownSortIcon } from 'components/icons';
import clsx from 'clsx';

export type SortComponentProps = {
  history: any;
  location: any;
  currentFilter: any;
};

export const SortByComponent = ({ history, location, currentFilter }: SortComponentProps) => {
  const classByStatus = useMemo(() => {
    return {
      newestCreated: !currentFilter.sort ? 'text-selected' : '',
      oldestCreated: currentFilter.sort === ESortBy.DateCreatedAsc ? 'text-selected' : '',
      newestUpdated: currentFilter.sort === ESortBy.DateUpdatedDec ? 'text-selected' : '',
      oldestUpdated: currentFilter.sort === ESortBy.DateUpdatedAsc ? 'text-selected' : '',
    };
  }, [currentFilter]);

  const handleSort = (input?: string) => {
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, sort: input });
    history.push(newUrl);
  };

  const menu = (
    <Menu className="sortby-dropdown-menu permission">
      <div className="sortby-dropdown-menu-container flex flex-column">
        <span onClick={() => handleSort()} className={clsx(classByStatus['newestCreated'], 'sort-item')}>
          Newest Created Date
        </span>
        <span
          onClick={() => handleSort(ESortBy.DateCreatedAsc)}
          className={clsx(classByStatus['oldestCreated'], 'sort-item')}
        >
          Oldest Created Date
        </span>
        <span
          onClick={() => handleSort(ESortBy.DateUpdatedDec)}
          className={clsx(classByStatus['newestUpdated'], 'sort-item')}
        >
          Newest Updated Date
        </span>
        <span
          onClick={() => handleSort(ESortBy.DateUpdatedAsc)}
          className={clsx(classByStatus['oldestUpdated'], 'sort-item')}
        >
          Oldest Updated Date
        </span>
        <CommonButton
          variant="default"
          size="small"
          space="space-large"
          block={true}
          textBold={false}
          onClick={() => handleSort()}
        >
          Reset
        </CommonButton>
      </div>
    </Menu>
  );
  return (
    <Dropdown placement="bottomLeft" overlay={menu}>
      <CommonButton size="middle" variant="default" icon={<ArrowDownSortIcon />} reverseIcon={true}>
        <span className="mr-2">Sort by</span>
      </CommonButton>
    </Dropdown>
  );
};
