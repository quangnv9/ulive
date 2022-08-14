import { Menu, Dropdown, Checkbox } from 'antd';
import { CommonButton } from 'components/CommonButton';
import { FilterIcon } from 'components/icons';
import { initFilter } from 'constant';
import { useState } from 'react';
import { mergeParam } from 'utils/helper';
import { AdminEStatus, AdminFilterType } from '../admin.type';

export type FilterComponentProps = {
  filterByStatus: AdminFilterType;
  history: any;
  location: any;
  currentFilter: any;
};

export const FilterButton = ({ filterByStatus, history, location, currentFilter }: FilterComponentProps) => {
  const [filter, setFilter] = useState<AdminFilterType>({ ...filterByStatus });

  const onChangeChecked = (checkType: keyof AdminFilterType): void => {
    setFilter({ ...filter, [checkType]: !filter[checkType] });
  };

  const toggleApply = () => {
    let newCondition = [];
    for (const [fieldName, value] of Object.entries(filter)) {
      if (value) {
        newCondition.push(fieldName);
      }
    }

    const newUrl = mergeParam(location.pathname, {
      ...currentFilter,
      page: initFilter.page,
      status: newCondition.length ? newCondition.join(';') : null,
    });

    history.push(newUrl);
  };

  const toggleRest = () => {
    setFilter({
      [AdminEStatus.Active]: false,
      [AdminEStatus.Inactive]: false,
    });
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, status: '' });
    history.push(newUrl);
  };

  const menu = (
    <Menu className="filter-dropdown-menu admin">
      <div className="filter-dropdown-menu-container">
        <p className="checkbox-text">STATUS</p>
        <div className="checkbox-container">
          <Checkbox checked={filter[AdminEStatus.Active]} onChange={() => onChangeChecked(AdminEStatus.Active)}>
            Active
          </Checkbox>
          <Checkbox checked={filter[AdminEStatus.Inactive]} onChange={() => onChangeChecked(AdminEStatus.Inactive)}>
            Inactive
          </Checkbox>
        </div>
        <div className="filter-dropdown-button-container flex justify-end">
          <div className="mr-2">
            <CommonButton onClick={toggleApply} size="small" space="space-large" textBold={false}>
              Apply
            </CommonButton>
          </div>
          <CommonButton onClick={toggleRest} variant="default" size="small" space="space-large" textBold={false}>
            Reset
          </CommonButton>
        </div>
      </div>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <CommonButton size="middle" variant="default" icon={<FilterIcon className="mr-1-5" />}>
        Filter
      </CommonButton>
    </Dropdown>
  );
};
