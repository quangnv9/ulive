import { CommonButton } from 'components/CommonButton';
import { FilterButton } from './FilterButton';
import { SearchInput } from './SearchInput';
import { SortByButton } from './SortByButton';
import { useHistory, useLocation } from 'react-router';
import { useParseParams } from 'hooks/use-params';
import { AddIcon } from 'components/icons/AddIcon';
import './index.scss';
import { useMemo } from 'react';
import { AdminEStatus } from '../admin.type';
import { initFilterByStatusAdmin } from '../admin.const';

export const SearchSortFilter = () => {
  const history = useHistory();
  const location = useLocation();
  const currentCondition = useParseParams();

  const currentFilterByStatus = useMemo(() => {
    if (currentCondition.status) {
      const arrStatus = currentCondition.status.split(';');
      return {
        [AdminEStatus.Active]: arrStatus.includes(AdminEStatus.Active),
        [AdminEStatus.Inactive]: arrStatus.includes(AdminEStatus.Inactive),
      };
    }
    return initFilterByStatusAdmin;
  }, [currentCondition]);

  return (
    <div className="tools-container__admin">
      <div className="tools-container-admin__left">
        <div className="mr-2">
          <SearchInput currentFilter={currentCondition} location={location} history={history} />
        </div>
        <div className="mr-2">
          <SortByButton currentFilter={currentCondition} location={location} history={history} />
        </div>
        <FilterButton
          filterByStatus={currentFilterByStatus}
          currentFilter={currentCondition}
          history={history}
          location={location}
        />
      </div>
      <CommonButton
        onClick={() => history.push('/user/admin/create?action=edit')}
        icon={<AddIcon className="mr-1-5" />}
      >
        Add Admin
      </CommonButton>
    </div>
  );
};
