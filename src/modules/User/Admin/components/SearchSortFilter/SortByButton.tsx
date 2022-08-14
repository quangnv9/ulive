import { Menu, Dropdown } from 'antd';
import { CommonButton } from 'components/CommonButton';
import { ArrowDownSortIcon } from 'components/icons';
import { initFilter } from 'constant';
import { useMemo } from 'react';
import { mergeParam } from 'utils/helper';
import { ESortByAdmin } from '../admin.type';

export type SortComponentProps = {
  currentFilter: any;
  history: any;
  location: any;
};

export const SortByButton = ({ currentFilter, history, location }: SortComponentProps) => {
  const classByStatus = useMemo(() => {
    return {
      newest: !currentFilter.sort ? 'text-selected' : '',
      oldest: currentFilter.sort === ESortByAdmin.DateCreatedAsc ? 'text-selected' : '',
    };
  }, [currentFilter]);

  const handleSort = (value?: string) => {
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, sort: value });
    history.push(newUrl);
  };

  const menu = (
    <Menu className="sortby-dropdown-menu admin">
      <div className="sortby-dropdown-menu-container flex flex-column">
        <span onClick={() => handleSort()} className={`${classByStatus['newest']} sort-item`}>
          Newest Created Date
        </span>
        <span
          onClick={() => handleSort(ESortByAdmin.DateCreatedAsc)}
          className={`${classByStatus['oldest']} sort-item`}
        >
          Oldest Created Date
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
    <div>
      <Dropdown placement="bottomLeft" overlay={menu}>
        <CommonButton size="middle" variant="default" icon={<ArrowDownSortIcon />} reverseIcon={true}>
          <span className="mr-2">Sort by</span>
        </CommonButton>
      </Dropdown>
    </div>
  );
};
