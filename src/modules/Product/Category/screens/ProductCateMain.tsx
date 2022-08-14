import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  selectCategoryList,
  getListCategories,
  categoryActions,
  selectListSearchCate,
  selectStatusGetCategoryList,
  selectFirstLoading,
} from 'redux/category/category.slice';
import { Category } from 'types';
import { SearchIcon, XCircleIcon } from 'components/icons';
import { CommonButton } from 'components/CommonButton';
import './ProductCateMain.scss';
import { AddIcon } from 'components/icons/AddIcon';
import { CardCate, CreateCategoryModal } from '../components';
import { getParentKey } from 'utils/helper';
import { LoadingComponent } from 'components/LoadingComponent';
import { categoryLevel } from './../category.const';

export function ProductCateMain() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpenModalCreateCate, setIsOpenModalCreateCate] = useState<boolean>(false);
  const listCategories = useAppSelector(selectCategoryList);
  const listSearchCate = useAppSelector(selectListSearchCate);
  const statusGetListCate = useAppSelector(selectStatusGetCategoryList);
  const firstLoading = useAppSelector(selectFirstLoading);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getListCategories());
  }, [dispatch]);

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
  generateList(listCategories);

  function onChange(e: any) {
    const { value } = e.target;

    const listCateExpanded: Category[] = dataList
      .map((item: Category) => {
        if (item.title.toUpperCase().indexOf(value.toUpperCase()) > -1) {
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

    dispatch(categoryActions.searchCate({ searchValue: value, dataList, expandedKeys }));

    if (value) {
      setSearchValue(value);
    } else {
      setSearchValue('');
    }
  }

  const handleCloseModalAddCate = () => {
    setIsOpenModalCreateCate(false);
  };

  return (
    <>
      <div className="category-container">
        <div className="search-add-cate-wrapper">
          <div className="search-wrapper">
            <Input
              style={{ marginBottom: 8 }}
              placeholder="Name"
              onChange={onChange}
              value={searchValue}
              prefix={<SearchIcon className="flex mr-1-5" />}
              suffix={
                searchValue && <XCircleIcon className="flex mr-1 cursor-pointer" onClick={() => setSearchValue('')} />
              }
            />
            <CommonButton htmlType="submit" loading={false} className="search-button" size="small">
              Search
            </CommonButton>
          </div>
          <CommonButton icon={<AddIcon className="mr-1-5" />} onClick={() => setIsOpenModalCreateCate(true)}>
            Add Category
          </CommonButton>
        </div>
        <div className="cate-content-wrapper">
          {searchValue ? (
            <>
              {listSearchCate.length === 0 ? (
                <span className="no-result-title">There are no results that match your search</span>
              ) : (
                <>
                  {listSearchCate.map((cate: Category) => (
                    <CardCate treeCate={[cate]} searchValue={searchValue} />
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {statusGetListCate === 'pending' && firstLoading ? (
                <LoadingComponent />
              ) : (
                <>
                  {listCategories.map((cate: Category) => (
                    <CardCate treeCate={[cate]} searchValue="" />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
      <CreateCategoryModal visible={isOpenModalCreateCate} handleCloseModal={handleCloseModalAddCate} />
    </>
  );
}
