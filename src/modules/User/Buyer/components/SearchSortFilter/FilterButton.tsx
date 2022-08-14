import { useState } from 'react';
import { Checkbox, Dropdown, Menu } from 'antd';
import { mergeParam } from 'utils/helper';
import { EStatus, FilterType } from '../buyer.type';
import { initFilter } from 'constant';
import { CommonButton } from 'components/CommonButton';
import { FilterIcon } from 'components/icons';

export type FilterComponentProps = {
  filterByStatus: FilterType;
  history: any;
  location: any;
  currentFilter: any;
};

export const FilterComponent = ({ filterByStatus, history, location, currentFilter }: FilterComponentProps) => {
  const [filter, setFilter] = useState<FilterType>({ ...filterByStatus });
  const onChangeChecked = (checkType: keyof FilterType): void => {
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

  const toggleReset = () => {
    setFilter({
      [EStatus.Active]: false,
      [EStatus.Inactive]: false,
      [EStatus.Banned]: false,
    });
    const newUrl = mergeParam(location.pathname, { ...currentFilter, page: initFilter.page, status: '' });
    history.push(newUrl);
  };

  const menu = (
    <Menu className="filter-dropdown-menu buyer">
      <div className="filter-dropdown-menu-container">
        <p className="checkbox-text">STATUS</p>
        <div className="checkbox-container">
          <Checkbox checked={filter[EStatus.Active]} onChange={() => onChangeChecked(EStatus.Active)}>
            Active
          </Checkbox>
          <Checkbox checked={filter[EStatus.Inactive]} onChange={() => onChangeChecked(EStatus.Inactive)}>
            Inactive
          </Checkbox>
          <Checkbox checked={filter[EStatus.Banned]} onChange={() => onChangeChecked(EStatus.Banned)}>
            Banned
          </Checkbox>
        </div>
        <div className="filter-dropdown-button-container flex justify-end">
          <div className="mr-2">
            <CommonButton onClick={toggleApply} size="small" space="space-large" textBold={false}>
              Apply
            </CommonButton>
          </div>

          <CommonButton onClick={toggleReset} variant="default" size="small" space="space-large" textBold={false}>
            Reset
          </CommonButton>
        </div>
      </div>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomLeft">
      <CommonButton size="middle" variant="default" icon={<FilterIcon className="mr-1-5" />}>
        Filter
      </CommonButton>
    </Dropdown>
  );
};
