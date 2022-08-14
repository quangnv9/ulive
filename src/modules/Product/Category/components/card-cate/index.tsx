import { useEffect, useState } from 'react';
import { Tree } from 'antd';
import clsx from 'clsx';
import { Category, ParentStatus, CateLevel, StatusCate } from 'types';
import { UPenIcon, UTrashAltIcon } from 'components/icons';
import { UAngleRightIcon } from 'components/icons/UAngleRightIcon';
import { getParentKey, isEmpty } from 'utils/helper';
import { EditCategoryModal } from './../edit-category';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { getListCategories, selectCategoryList, selectStatusGetCategoryList } from 'redux/category/category.slice';
import { NotificationModal } from 'components/modal/modal-notification';
import { ConfirmModal } from 'components/modal/modal-confirm';
import { categoryApi } from 'services/api-category.service';
import { categoryLevel, categoryStatus } from '../../category.const';

interface CardCateProps {
  treeCate: Category[];
  searchValue: string;
}
type ModalNotificationState = {
  notiHasChildren: boolean;
  notiHasProduct: boolean;
  notiDelete: boolean;
};
export function CardCate({ treeCate, searchValue }: CardCateProps) {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isOpenModalEditCate, setIsOpenModalEditCate] = useState<boolean>(false);
  const [cateEdit, setCateEdit] = useState<Category>();
  const [cateDelete, setCateDelete] = useState<Category>();
  const [isLoadingDeleteCate, setIsLoadingDeleteCate] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<ModalNotificationState>({
    notiHasChildren: false,
    notiHasProduct: false,
    notiDelete: false,
  });
  const statusGetListCate = useAppSelector(selectStatusGetCategoryList);

  const dispatch = useAppDispatch();

  const listCategories = useAppSelector(selectCategoryList);

  const dataList: any = [];
  function generateList(data: Array<Category>) {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push(node);
      if (node.children) {
        generateList(node.children);
      }
    }
    return dataList;
  }

  function autoExpandedKeys() {
    const listCateExpanded: Category[] = dataList
      .map((item: Category) => {
        if (item.title.toUpperCase().indexOf(searchValue.toUpperCase()) > -1) {
          const parentKey: Category = getParentKey(item.key, listCategories);
          if (parentKey?.level === categoryLevel.Level02) {
            return { ...parentKey, addPath: parentKey.path };
          }
          return parentKey;
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    const arr01 = listCateExpanded.map((item: Category) => item._id);
    const arr02 = listCateExpanded.map((item: Category) => item?.addPath);
    const sumArr = arr01.concat(arr02);
    const expandedKeys: string[] = Array.from(new Set(sumArr)).filter((item) => item !== undefined);
    if (searchValue) {
      setExpandedKeys(expandedKeys as []);
    } else {
      setExpandedKeys([]);
    }
  }

  useEffect(() => {
    if (searchValue) {
      autoExpandedKeys();
    } else {
      setExpandedKeys([]);
    }
    /*eslint-disable */
  }, [searchValue]);

  generateList(treeCate);

  function onExpand(expandedKeys: any) {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  }

  const getParentStatus = (parentStatus: ParentStatus[], level: CateLevel) => {
    if (level === categoryLevel.Level01) {
      return null;
    } else if (level === categoryLevel.Level02) {
      return parentStatus.filter((item) => item.level === categoryLevel.Level01)[0].status;
    } else {
      return parentStatus.filter((item) => item.level === categoryLevel.Level02)[0].status;
    }
  };
  const getStatusLevel01 = (parentStatus: ParentStatus[]) => {
    return parentStatus.filter((item) => item.level === categoryLevel.Level01)[0].status;
  };

  const getDisableIcon = (item: Category, statusLevel01: StatusCate, parentStatus: StatusCate) => {
    if (item.status === categoryStatus.Inactive) {
      if (item.level === categoryLevel.Level01) {
        return false;
      }
      if (item.level === categoryLevel.Level02) {
        if (item.hasChildren === true && statusLevel01 === categoryStatus.Inactive) {
          return true;
        } else if (isEmpty(item.hasChildren) && statusLevel01 === categoryStatus.Inactive) {
          return true;
        } else {
          return false;
        }
      }
      if (item.level === categoryLevel.Level03) {
        if (parentStatus === categoryStatus.Active) {
          return false;
        }
        return true;
      }
      return true;
    } else if (statusLevel01 === categoryStatus.Inactive) {
      return true;
    } else if (parentStatus === categoryStatus.Inactive) {
      return true;
    } else {
      return false;
    }
  };

  function loop(data: any) {
    return data.map((item: Category) => {
      const index = item?.title?.toUpperCase().indexOf(searchValue.toUpperCase());
      const beforeStr = item?.title?.substr(0, index);
      const afterStr = item?.title?.substr(index + searchValue.length);
      const _seachValue = item?.title.substr(beforeStr.length, searchValue.length);

      const isRootCate = item?.path === null;
      const isCateLevel02 = item?.path?.split('/').length === 1;
      const parentStatus = getParentStatus(item.parentStatus, item.level);
      const statusLevel01 = getStatusLevel01(item.parentStatus);
      const isDisableIcon = getDisableIcon(item, statusLevel01, parentStatus as StatusCate);
      const isDecreasePadding = item.level === categoryLevel.Level01;

      const title =
        index > -1 ? (
          <div className={clsx('tree-title-custom', isDecreasePadding && 'decrease-padding')}>
            <span
              className={clsx(
                isRootCate && 'root-cate',
                isCateLevel02 && 'cate-level-02',
                !isRootCate && !isCateLevel02 ? 'cate-item' : '',

                statusLevel01 === categoryStatus.Inactive
                  ? 'cate-disabled'
                  : item.status === categoryStatus.Inactive || parentStatus === categoryStatus.Inactive
                  ? 'cate-disabled'
                  : '',
              )}
            >
              {beforeStr}
              <span className="site-tree-search-value">{_seachValue}</span>
              {afterStr}
            </span>

            {isDisableIcon ? (
              <div className={clsx('icon-action-wrapper', 'disable-action')}>
                <UPenIcon className="mr-2" />
                <UTrashAltIcon />
              </div>
            ) : (
              <div className="icon-action-wrapper">
                <UPenIcon className="mr-2" onClick={() => handleEditCategory(item)} />
                <UTrashAltIcon onClick={() => openModalDeleteCategory(item)} />
              </div>
            )}
          </div>
        ) : (
          <div className={clsx('tree-title-custom', isDecreasePadding && 'decrease-padding')}>
            <span
              className={clsx(
                isRootCate && 'root-cate',
                isCateLevel02 && 'cate-level-02',
                !isRootCate && !isCateLevel02 ? 'cate-item' : '',
                statusLevel01 === categoryStatus.Inactive
                  ? 'cate-disabled'
                  : item.status === categoryStatus.Inactive || parentStatus === categoryStatus.Inactive
                  ? 'cate-disabled'
                  : '',
              )}
            >
              {item.title}
            </span>
            {isDisableIcon ? (
              <div className={clsx('icon-action-wrapper', 'disable-action')}>
                <UPenIcon className="mr-2" />
                <UTrashAltIcon />
              </div>
            ) : (
              <div className="icon-action-wrapper">
                <UPenIcon className="mr-2" onClick={() => handleEditCategory(item)} />
                <UTrashAltIcon onClick={() => openModalDeleteCategory(item)} />
              </div>
            )}
          </div>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
      };
    });
  }

  function handleSelected(selectedKeys: any) {
    setSelectedKeys(selectedKeys);
  }

  function handleEditCategory(cate: Category) {
    setIsOpenModalEditCate(true);
    setCateEdit(cate);
  }
  const handleCloseModalEditCate = () => {
    setIsOpenModalEditCate(false);
    setCateEdit({} as Category);
  };

  function openModalDeleteCategory(cate: Category) {
    if (cate.children.length) {
      setIsOpenModal((prev) => {
        return { ...prev, notiHasChildren: true };
      });
    } else {
      setIsOpenModal((prev) => {
        return { ...prev, notiDelete: true };
      });
      setCateDelete(cate);
    }
  }
  async function handleDeleteCategory() {
    setIsLoadingDeleteCate(true);
    await categoryApi
      .deleteCategory(cateDelete?._id as string)
      .then((res) => {
        if (res) {
          dispatch(getListCategories());
          if (statusGetListCate === 'done') {
            setIsLoadingDeleteCate(false);
            setTimeout(() => {
              setIsOpenModal((prev) => {
                return { ...prev, notiDelete: false };
              });
            }, 1000);
          }
        }
      })
      .catch((error) => {
        setIsLoadingDeleteCate(false);
        setIsOpenModal((prev) => {
          return { ...prev, notiDelete: false, notiHasProduct: true };
        });
      });
  }

  return (
    <>
      <div className="one-card-category">
        <div className="tree-cate-wrapper">
          <Tree.DirectoryTree
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(treeCate)}
            showIcon={false}
            onSelect={handleSelected}
            selectedKeys={selectedKeys}
            className="cate-content-custom"
            switcherIcon={<UAngleRightIcon />}
          />
        </div>
      </div>
      <EditCategoryModal
        visible={isOpenModalEditCate}
        handleCloseModal={handleCloseModalEditCate}
        cateEdit={cateEdit}
      />
      <NotificationModal
        visible={isOpenModal.notiHasProduct}
        onCancel={() =>
          setIsOpenModal((prev) => {
            return { ...prev, notiHasProduct: false };
          })
        }
        cancelText="Close"
      >
        <p>This category already has products on it.</p>
        <p>Please remove all of the products before you want to remove this category.</p>
      </NotificationModal>
      <NotificationModal
        visible={isOpenModal.notiHasChildren}
        onCancel={() =>
          setIsOpenModal((prev) => {
            return { ...prev, notiHasChildren: false };
          })
        }
        cancelText="Close"
      >
        <p>This category has child categories on it.</p>
        <p>Please remove all of the child categories before you want to remove this category.</p>
      </NotificationModal>
      <ConfirmModal
        visible={isOpenModal.notiDelete}
        onCancel={() =>
          setIsOpenModal((prev) => {
            return { ...prev, notiDelete: false };
          })
        }
        okButtonProps={{ loading: isLoadingDeleteCate }}
        onOk={handleDeleteCategory}
        okText="Delete"
      >
        Are you sure to delete this category ?
      </ConfirmModal>
    </>
  );
}
