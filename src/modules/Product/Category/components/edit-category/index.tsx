import { Modal, ModalProps, Form, Row, Col, Input, Dropdown, Menu, Tree } from 'antd';
import { CommonButton } from 'components/CommonButton';
import { useState, useEffect } from 'react';
import {
  selectCategoryList,
  getListCategories,
  selectStatusGetCategoryList,
  categoryActions,
  selectListSearchCate,
} from 'redux/category/category.slice';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { Category, ParentSelect } from 'types';
import clsx from 'clsx';
import { SearchIcon } from 'components/icons';
import { UAngleRightIcon } from 'components/icons/UAngleRightIcon';
import { StatusSelect } from 'components/form-control';
import { getParentKey, isEmpty } from 'utils/helper';
import { categoryApi } from 'services/api-category.service';
import { categoryLevel } from '../../category.const';
import '../create-category/styles.scss';

interface EditCategoryModalProps extends ModalProps {
  cateEdit?: Category;
  handleCloseModal: () => void;
}

export function EditCategoryModal({ cateEdit, handleCloseModal, ...props }: EditCategoryModalProps) {
  const [form] = Form.useForm();
  const listCategories = useAppSelector(selectCategoryList);
  const listSearchCates = useAppSelector(selectListSearchCate);
  const statusGetListCate = useAppSelector(selectStatusGetCategoryList);
  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parentSelected, setParentSelected] = useState<ParentSelect>({
    displayLevel: '',
    displayPathName: '',
  });

  const dispatch = useAppDispatch();
  const removeLevel03 = (data: Category[]): Array<Category> => {
    return data.map((item) => {
      return {
        ...item,
        key: JSON.stringify({
          displayLevel: item.path ? `${item.path}/${item.key}` : item.key,
          displayPathName: item.pathName ? `${item.pathName}/${item.title}` : item.title,
        }),
        children: item.level === categoryLevel.Level02 ? [] : removeLevel03(item.children),
      };
    });
  };

  const totalLevel = (data: Array<Category>): any => {
    return data?.map((item: Category) => {
      let total = 1;
      if (item.children.length > 0) {
        return (total += totalLevel(item.children));
      }
      return total;
    });
  };
  const result = totalLevel(cateEdit?.children as Category[]);
  const childNodeOfCate =
    result?.length === 0 ? 1 : result?.findIndex((item: unknown) => typeof item === 'string') >= 0 ? 3 : 2;

  const listCateWhitoutLevel03 = removeLevel03(listCategories);

  const preFormatData = () => {
    if (cateEdit?.level === categoryLevel.Level02 && isEmpty(cateEdit.hasChildren)) {
      return listCateWhitoutLevel03.map((item) => {
        if (item._id === cateEdit?.path) {
          return { ...item, children: item.children.filter((item) => item._id !== cateEdit._id) };
        }
        return item;
      });
    } else if (cateEdit?.level === categoryLevel.Level02 && cateEdit.hasChildren) {
      return listCateWhitoutLevel03.map((item) => {
        return { ...item, children: [] };
      });
    } else if (cateEdit?.level === categoryLevel.Level03) {
      return listCateWhitoutLevel03;
    } else if (cateEdit?.level === categoryLevel.Level01) {
      if (childNodeOfCate === 1) {
        return listCateWhitoutLevel03.filter((item) => item._id !== cateEdit?._id);
      } else if (childNodeOfCate === 2) {
        return listCateWhitoutLevel03
          .map((item) => {
            return { ...item, children: [] };
          })
          .filter((item) => item._id !== cateEdit?._id);
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  const gData = preFormatData();

  const dataList: any = [];
  function generateList(data: Array<Category>) {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push(node);
      if (node.children) {
        generateList(node.children);
      }
    }
  }
  generateList(gData);

  function onExpand(expandedKeys: any) {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  }

  function resetState() {
    setSelectedKeys([]);
    setSearchValue('');
    setExpandedKeys([]);
  }

  function onChange(e: any) {
    const { value } = e.target;

    const listCateExpanded: Category[] = dataList
      .map((item: Category) => {
        if (item.title.toUpperCase().indexOf(value.toUpperCase()) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);

    const _expandedKeys = listCateExpanded.map((cate: Category) => cate.key);
    const listExpandedIds = listCateExpanded.map((item) => item._id);

    dispatch(categoryActions.searchCate({ dataList, expandedKeys: listExpandedIds, searchValue: value }));

    if (value) {
      setExpandedKeys(_expandedKeys as any);
      setSearchValue(value);
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setSearchValue('');
      setAutoExpandParent(false);
    }
  }

  function handleSelected(selectedKeys: any) {
    setParentSelected(JSON.parse(selectedKeys));
    setIsOpenDropDown(false);
    setExpandedKeys(selectedKeys);
    setSelectedKeys(selectedKeys);
    setSearchValue('');
  }

  function loop(data: any) {
    return data.map((item: Category) => {
      const index = item?.title?.indexOf(searchValue);
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
            <span>{item.title}</span>
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

  useEffect(() => {
    form.setFieldsValue({
      name: cateEdit?.name,
      status: cateEdit?.status,
    });
    const _selectedKey = JSON.stringify({
      displayLevel: cateEdit?.path,
      displayPathName: cateEdit?.pathName,
    });
    //@ts-ignore
    setSelectedKeys([_selectedKey]);
    //@ts-ignore
    setExpandedKeys([_selectedKey]);
  }, [cateEdit, form]);

  const handleSetNoParent = () => {
    setParentSelected((prev: ParentSelect) => {
      return {
        ...prev,
        displayLevel: null,
        displayPathName: 'No Parent',
      };
    });
    setSelectedKeys([]);
    setIsOpenDropDown(false);
  };

  const handleCancelEdit = () => {
    handleCloseModal();
    resetState();
    setParentSelected({ displayLevel: '', displayPathName: '' });
  };

  const handleEditCate = () => {
    form
      .validateFields()
      .then(async (values) => {
        const bodyEdit = {
          name: values.name.trim(),
          status: values.status,
          path: parentSelected.displayPathName ? parentSelected.displayLevel : cateEdit?.path,
        };
        if (bodyEdit.name.length === 0) {
          form.setFields([
            {
              name: 'name',
              errors: ['This is require field'],
            },
          ]);
        } else {
          setIsLoading(true);
          await categoryApi
            .editCategory(bodyEdit, cateEdit?._id as string)
            .then((res) => {
              if (res) {
                dispatch(getListCategories());
                if (statusGetListCate === 'done') {
                  setIsLoading(false);
                  setTimeout(async () => {
                    await handleCloseModal();
                    setParentSelected({ displayLevel: null, displayPathName: '' });
                    resetState();
                  }, 1000);
                }
              }
            })
            .catch((error) => {
              setIsLoading(false);
              form.setFields([
                {
                  name: 'name',
                  errors: [`${error.response.data.message}`],
                },
              ]);
            });
        }
      })
      .catch((info) => {
        return;
      });
  };

  const menu = (
    <Menu className="add-edit-cate__menu-wrapper">
      <Input
        style={{ marginBottom: 8 }}
        placeholder="Search categoty"
        onChange={onChange}
        value={searchValue}
        prefix={<SearchIcon className="flex mr-1-5" />}
      />
      <span
        className={clsx(
          'no-parent-title',
          (parentSelected.displayPathName === 'No Parent' || !cateEdit?.path) && 'no-parent__active',
        )}
        onClick={handleSetNoParent}
      >
        No Parent
      </span>
      {searchValue && isEmpty(listSearchCates) ? (
        <div className="no-search-result">
          <span>No results found</span>
        </div>
      ) : (
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={searchValue ? loop(listSearchCates) : loop(gData)}
          showIcon={false}
          onSelect={handleSelected}
          selectedKeys={selectedKeys}
          className="select-cate-content_custom"
          switcherIcon={<UAngleRightIcon />}
        />
      )}
    </Menu>
  );

  return (
    <Modal
      closable={false}
      width={400}
      okText="Save"
      className="add-edit-category-wrapper"
      title="Edit Category"
      onCancel={handleCancelEdit}
      destroyOnClose={true}
      onOk={handleEditCate}
      okButtonProps={{ htmlType: 'submit', loading: isLoading }}
      {...props}
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item
              label="Name"
              name="name"
              initialValue={cateEdit?.name}
              rules={[
                {
                  required: true,
                  message: 'This is require field',
                },
                { min: 1, max: 200, message: 'Category name is between 01 and 200 characters' },
              ]}
            >
              <Input placeholder="Text input" />
            </Form.Item>
          </Col>
        </Row>

        {gData.length !== 0 ? (
          <Row>
            <Col span={24}>
              <Form.Item label="Parents">
                <Dropdown
                  overlay={menu}
                  trigger={['click']}
                  placement="bottomCenter"
                  visible={isOpenDropDown}
                  onVisibleChange={(visible: boolean) => setIsOpenDropDown(visible)}
                >
                  <CommonButton
                    block
                    onClick={() => setIsOpenDropDown(!isOpenDropDown)}
                    variant="dashed"
                    textBold={false}
                  >
                    <span className="wrapper-button-select-cate">
                      <span>
                        <ul className="parent-selected">
                          {parentSelected.displayPathName ? (
                            parentSelected.displayPathName.split('/').map((item, index) => (
                              <li key={index}>
                                {item}{' '}
                                {index !== parentSelected.displayPathName.split('/').length - 1 && <>{'>'}&nbsp;</>}
                              </li>
                            ))
                          ) : (
                            <>
                              {cateEdit?.pathName ? (
                                <>
                                  {cateEdit?.pathName?.split('/').map((item, index) => (
                                    <li key={index}>
                                      {item}
                                      {/* @ts-ignore */}
                                      {index !== cateEdit?.pathName.split('/').length - 1 && <>&nbsp;{'>'}&nbsp;</>}
                                    </li>
                                  ))}
                                </>
                              ) : (
                                'No Parent'
                              )}
                            </>
                          )}
                        </ul>
                      </span>
                      <span className={isOpenDropDown ? 'dropdown-open-icon' : ''}>
                        <UAngleRightIcon />
                      </span>
                    </span>
                  </CommonButton>
                </Dropdown>

                <span className="note-title">
                  If you don't choose a parent, it will be interpreted as creating a new category level 1
                </span>
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={24}>
              <Form.Item label="Parents">
                <CommonButton block variant="dashed" textBold={false}>
                  <span className="wrapper-button-select-cate">No Parent</span>
                </CommonButton>
                <span className="note-title">
                  If you don't choose a parent, it will be interpreted as creating a new category level 1
                </span>
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row>
          <Col span={24}>
            <StatusSelect name="status" label="Status" options={['Active', 'Inactive'] as any} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
