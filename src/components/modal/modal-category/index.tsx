import React, { Key, useEffect, useState } from 'react';
import { Modal, ModalProps, Tree } from 'antd';
import clsx from 'clsx';
import { SearchIcon } from 'components/icons';
import { CircleXFillIcon } from 'components/icons/CircleXFillIcon';
import { ExpandCateIcon } from 'components/icons/ExpandCateIcon';
import { useAppDispatch } from 'redux/hooks';
import { getListCategories, selectCategoryList } from 'redux/category/category.slice';
import { useSelector } from 'react-redux';
import { Category, CateSelected } from 'services/api-product.type';

interface CategoryModalProps extends ModalProps {
  selectedTitle: any[];
  setSelectedTitle: React.Dispatch<React.SetStateAction<any[]>>;
  title: any[];
  setTitle: React.Dispatch<React.SetStateAction<any[]>>;
  checkedKeys: React.Key[];
  setCheckedKeys: any;
  oldTitle: any[];
  setOldTitle: React.Dispatch<React.SetStateAction<any[]>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export function CategoryModal({
  title,
  setTitle,
  checkedKeys,
  setCheckedKeys,
  searchValue,
  setSearchValue,
  ...props
}: CategoryModalProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const listCategories = useSelector(selectCategoryList);

  useEffect(() => {
    dispatch(getListCategories());
  }, [dispatch]);

  function newData(data: Category[]): any {
    return data?.map((item: Category) => {
      return { ...item, key: item?._id, children: item?.children && newData(item?.children) };
    });
  }

  const gDataNew = newData(listCategories);

  function onExpand(expandedKeysValue: React.Key[]) {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  }

  function onCheck(checked: Key[] | { checked: Key[]; halfChecked: Key[] }, info: any) {
    setCheckedKeys(checked);
    const resultWithoutChidlren = info.checkedNodes.filter((el: any) => el.children.length === 0);
    const resultTitle = resultWithoutChidlren.map((el: any) => ({
      title: el.title,
      key: el.key,
    }));
    setTitle(resultTitle);
  }

  function onDeleteCategory(key: string) {
    const result = title.filter((el) => el.key !== key);
    const arr: Category[] = [];
    result?.forEach((el) => {
      arr.push(el.key);
    });
    setTitle(result);
    setCheckedKeys(arr);
  }

  function loop(data: any): any {
    return data?.map((item: any) => {
      const index = item?.title?.indexOf(searchValue);
      const beforeStr = item?.title?.substr(0, index);
      const afterStr = item?.title?.substr(index + searchValue.length);
      const isRootCate = item?.path === null;
      const isCateLevel02 = item?.path?.split('/').length === 1;

      const title =
        index > -1 ? (
          <span
            className={clsx(
              isRootCate && 'root-cate',
              isCateLevel02 && 'cate-level-02',
              !isRootCate && !isCateLevel02 ? 'cate-item' : '',
            )}
          >
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span
            className={clsx(
              isRootCate && 'root-cate',
              isCateLevel02 && 'cate-level-02',
              !isRootCate && !isCateLevel02 ? 'cate-item' : '',
            )}
          >
            {item.title}
          </span>
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

  const dataList: CateSelected[] = [];

  function generateList(data: any) {
    for (let i = 0; i < data?.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title });
      if (node.children) {
        generateList(node.children);
      }
    }
  }
  generateList(gDataNew);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    const expandedKeys = dataList
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gDataNew);
        }
        return null;
      })
      .filter((item: CateSelected, i: number, self: CateSelected[]) => item && self.indexOf(item) === i);
    if (value) {
      setExpandedKeys(expandedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setSearchValue('');
      setAutoExpandParent(false);
    }
  }

  function getParentKey(key: any, tree: any): any {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  }

  function filterTreeNode(node: any) {
    const title = node?.title?.props?.children[2];
    const result = title?.indexOf(searchValue) !== -1;
    return result;
  }

  return (
    <Modal okText="Save" width={900} className="category-modal" title="Filter Category" {...props}>
      <div className="selected-category-container">
        <SearchIcon />
        {title?.map((el: any) => (
          <div className="selected-category-content-container">
            <div className="selected-category-content">{el.title}</div>
            <CircleXFillIcon className="delete-category" onClick={() => onDeleteCategory(el.key)} />
          </div>
        ))}
        <input onChange={onChange} value={searchValue} className="search-category-box" />
      </div>

      <Tree
        checkable
        switcherIcon={<ExpandCateIcon />}
        className="category-tree"
        onExpand={onExpand}
        filterTreeNode={filterTreeNode}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        showIcon={false}
        checkedKeys={checkedKeys}
        treeData={loop(gDataNew)}
        defaultExpandAll={true}
        height={350}
        blockNode={false}
        selectable={false}
      />
    </Modal>
  );
}
