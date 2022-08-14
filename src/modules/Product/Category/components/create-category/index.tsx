import { Modal, ModalProps, Form, Row, Col, Input, Dropdown, Menu, Tree } from 'antd';
import { CommonButton } from 'components/CommonButton';
import { useState } from 'react';
import {
  categoryActions,
  getListCategories,
  selectCategoryList,
  selectListSearchCate,
  selectStatusGetCategoryList,
} from 'redux/category/category.slice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Category, ParentSelect } from 'types';
import './styles.scss';
import clsx from 'clsx';
import { SearchIcon } from 'components/icons';
import { UAngleRightIcon } from 'components/icons/UAngleRightIcon';
import { StatusSelect } from 'components/form-control';
import { categoryApi } from 'services/api-category.service';
import { getParentKey, isEmpty } from 'utils/helper';
import { categoryLevel } from '../../category.const';

interface CreateCategoryModalProps extends ModalProps {
  handleCloseModal: () => void;
}

export function CreateCategoryModal({ handleCloseModal, ...props }: CreateCategoryModalProps) {
  const [form] = Form.useForm();
  const listCategories = useAppSelector(selectCategoryList);
  const listSearchCates = useAppSelector(selectListSearchCate);
  const statusGetListCate = useAppSelector(selectStatusGetCategoryList);
  const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<Array<string>>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [parentSelected, setParentSelected] = useState<ParentSelect>({
    displayLevel: null,
    displayPathName: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const addKeyToListCate = (data: Category[]): Array<Category> => {
    return data.map((item) => {
      return {
        ...item,
        key: JSON.stringify({
          displayLevel: item.path ? `${item.path}/${item.key}` : item.key,
          displayPathName: item.pathName ? `${item.pathName}/${item.title}` : item.title,
        }),
        children: item.level === categoryLevel.Level02 ? [] : addKeyToListCate(item.children),
      };
    });
  };
  const gData = addKeyToListCate(listCategories);

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
      setExpandedKeys(_expandedKeys as string[]);
      setSearchValue(value);
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setSearchValue('');
      setAutoExpandParent(false);
    }
  }

  function handleSelected(selectedKeys: any) {
    setSelectedKeys(selectedKeys);
    setParentSelected(JSON.parse(selectedKeys));
    setIsOpenDropDown(false);
    setSearchValue('');
  }

  const onSelectNoParent = () => {
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
  const handleCanleAddCate = () => {
    handleCloseModal();
    resetState();
    setParentSelected({ displayLevel: null, displayPathName: '' });
    form.resetFields();
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
        className={clsx('no-parent-title', parentSelected.displayPathName === 'No Parent' && 'no-parent__active')}
        onClick={onSelectNoParent}
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

  const handleCreateCate = () => {
    form
      .validateFields()
      .then(async (values) => {
        const bodyCreate = {
          name: values.name.trim(),
          status: values.status,
          path: parentSelected.displayLevel,
        };
        if (bodyCreate.name.length === 0) {
          form.setFields([
            {
              name: 'name',
              errors: ['This is require field'],
            },
          ]);
        } else {
          setIsLoading(true);

          await categoryApi
            .addCategory(bodyCreate)
            .then((res) => {
              if (res) {
                dispatch(getListCategories());
                if (statusGetListCate === 'done') {
                  setIsLoading(false);
                  resetState();
                  setTimeout(async () => {
                    await handleCloseModal();
                    form.resetFields();
                    setParentSelected({ displayLevel: null, displayPathName: '' });
                  }, 1000);
                }
              }
            })
            .catch((error) => {
              setIsLoading(false);
              resetState();
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

  return (
    <Modal
      closable={false}
      width={400}
      okText="Save"
      className="add-edit-category-wrapper"
      title="Create New Category"
      onCancel={handleCanleAddCate}
      onOk={handleCreateCate}
      okButtonProps={{ loading: isLoading }}
      destroyOnClose={true}
      {...props}
    >
      <Form form={form} layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item
              label="Name"
              name="name"
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
                      {parentSelected?.displayPathName ? (
                        <ul className="parent-selected">
                          {parentSelected.displayPathName.split('/').map((item, index) => (
                            <li key={index}>
                              {item}{' '}
                              {index !== parentSelected.displayPathName.split('/').length - 1 && <>{'>'}&nbsp;</>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'Select a category'
                      )}
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
        <Row>
          <Col span={24}>
            <StatusSelect name="status" label="Status" initialValue="Active" options={['Active', 'Inactive'] as any} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
