import { useParseParams } from 'hooks/use-params';
import { useMemo } from 'react';
import { EStatus } from '../seller.type';
import { useHistory, useLocation } from 'react-router';
import { initFilterByStatus } from '../seller.const';
import { SearchComponent } from './SearchInput';
import { SortByComponent } from './SortByButton';
import { FilterComponent } from './FilterButton';
import './index.scss';

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
        [EStatus.Banned]: arrStatus.includes(EStatus.Banned),
      };
    }
    return initFilterByStatus;
  }, [currentCondition]);

  return (
    <div className="tools-container">
      <SearchComponent currentFilter={currentCondition} history={history} location={location} />
      <div className="button-container">
        <div className="mr-3">
          <SortByComponent currentFilter={currentCondition} history={history} location={location} />
        </div>
        <FilterComponent
          filterByStatus={currentFilterByStatus}
          currentFilter={currentCondition}
          history={history}
          location={location}
        />
      </div>
    </div>
  );
};
