import { SortByComponent } from 'modules/User/Permission/components/SearchSortFilter/SortByButton';
import { FilterComponent } from 'modules/User/Permission/components/SearchSortFilter/FilterButton';
import { SearchComponent } from 'modules/User/Permission/components/SearchSortFilter/SearchInput';
import './index.scss';
import { useParseParams } from 'hooks/use-params';
import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { EStatus } from '../../permission.type';
import { initFilterByStatus } from 'modules/User/Permission/permission.const';
import { CommonButton } from 'components/CommonButton';
import { AddIcon } from 'components/icons/AddIcon';

export const SearchSortFilter = () => {
  const history = useHistory();
  const location = useLocation();
  const currentCondition = useParseParams();

  const currentFilterByStatus = useMemo(() => {
    if (currentCondition.status) {
      const arrStatus = currentCondition.status.split(';');
      return {
        [EStatus.Active]: arrStatus.includes(EStatus.Active),
        [EStatus.Inactive]: arrStatus.includes(EStatus.Inactive),
      };
    }
    return initFilterByStatus;
  }, [currentCondition]);

  return (
    <div className="tools-container__permission">
      <div className="tools-container-permission__left">
        <div className="mr-2">
          <SearchComponent currentFilter={currentCondition} history={history} location={location} />
        </div>
        <div className="mr-2">
          <SortByComponent currentFilter={currentCondition} history={history} location={location} />
        </div>
        <FilterComponent
          filterByStatus={currentFilterByStatus}
          currentFilter={currentCondition}
          history={history}
          location={location}
        />
      </div>
      <CommonButton
        onClick={() => history.push('/user/permission/add-group?action=create')}
        icon={<AddIcon className="mr-1-5" />}
      >
        Add Group
      </CommonButton>
    </div>
  );
};
