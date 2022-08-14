import clsx from 'clsx';
import { useState } from 'react';
import { useParseParams } from 'hooks/use-params';
import { useHistory, useLocation } from 'react-router';
import { CommonButton } from 'components/CommonButton';
import { ConfirmModal } from 'components/modal';
import FilterComponent from './FilterButton';
import { SearchComponent } from './SearchInput';
import { SortByComponent } from './SortByButton';
import { TrashIcon } from 'components/icons/TrashIcon';
import { useRemoveProductQuery } from '../product.queries';
import { message } from 'antd';
import './index.scss';
interface SearchSortFilterProps {
  selectedRowKeys: Array<string>;
  onSelectedRowKeys: any;
}
export function SearchSortFilter({ selectedRowKeys, onSelectedRowKeys }: SearchSortFilterProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const history = useHistory();
  const location = useLocation();

  const currentCondition = useParseParams();

  function handleDeleteProduct() {
    setVisible(true);
  }
  const { mutate: saveProduct } = useRemoveProductQuery();
  function handleConfirmDelete() {
    if (selectedRowKeys.length) {
      saveProduct(selectedRowKeys, {
        onSuccess: () => {
          message.success({
            content: 'Delete product successfully!',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
        onError: () => {
          message.error({
            content: 'Delete product failed!',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
      });
    }

    onSelectedRowKeys([]);
    setVisible(false);
  }

  return (
    <div className="tools-container" style={{ borderBottom: 'none' }}>
      <SearchComponent currentFilter={currentCondition} history={history} location={location} />
      {selectedRowKeys.length ? (
        <>
          <CommonButton
            style={{ background: '#F44336' }}
            className="button-delete"
            size="middle"
            icon={<TrashIcon className="mr-1-5" />}
            onClick={handleDeleteProduct}
          >
            Delete ( {selectedRowKeys?.length} )
          </CommonButton>
          <ConfirmModal visible={visible} onOk={handleConfirmDelete} onCancel={() => setVisible(false)} okText="Delete">
            Are you sure to delete this product?
          </ConfirmModal>
        </>
      ) : (
        <div className="button-container">
          <div className={clsx('mr-3')}>
            <SortByComponent currentFilter={currentCondition} history={history} location={location} />
          </div>
          <div className="mr-3">
            <FilterComponent currentFilter={currentCondition} history={history} location={location} />
          </div>
        </div>
      )}
    </div>
  );
}
