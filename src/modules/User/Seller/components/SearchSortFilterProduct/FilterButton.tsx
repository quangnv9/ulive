import { CommonButton } from 'components/CommonButton';
import { ArrowRightIcon, FilterIcon } from 'components/icons';
import { Col, Dropdown, Form, Input, Menu, Row } from 'antd';
import { useEffect, useState } from 'react';
import { CategoryModal } from 'components/modal/modal-category';
import { mergeParam } from 'utils/helper';
import { useParseParams } from 'hooks/use-params';
import { getListCategories, selectCategoryList } from 'redux/category/category.slice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Category, CateSelected } from 'services/api-product.type';

export interface FilterComponentProps {
  currentFilter: any;
  history: any;
  location: any;
}
export interface ICategory extends Category {
  key: string;
}

const FilterComponent = ({ currentFilter, history, location }: FilterComponentProps) => {
  const [selectCategoryModal, setSelectCategoryModal] = useState<boolean>(false);
  const [visileFilterDropDown, setVisibleFilterDropDown] = useState<boolean>(false);
  const [selectedTitle, setSelectedTitle] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [oldData, setOldData] = useState<any[]>([]);
  const [oldTitle, setOldTitle] = useState<any[]>([]);
  const [minPrice, setminPrice] = useState<string>('');
  const [maxPrice, setmaxPrice] = useState<string>('');
  const [searchValue, setSearchValue] = useState('');
  const [title, setTitle] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [formFilter] = Form.useForm();
  const { minPrice: priceMin, maxPrice: priceMax, categoryIds, sort, keyWord } = useParseParams();
  const listCategories = useAppSelector(selectCategoryList);

  /*eslint-disable*/
  useEffect(() => {
    dispatch(getListCategories());
    formFilter.setFieldsValue({
      minPrice: priceMin,
      maxPrice: priceMax,
    });
    const arr = categoryIds?.split(',');

    function newData(data: Category[]): any {
      return data?.map((item: Category) => {
        return { ...item, key: item?._id, children: item?.children && newData(item?.children) };
      });
    }

    const gDataNew = newData(listCategories);
    const nodeWithOutChildrenArr: any = [];

    if (gDataNew) {
      gDataNew?.forEach((el: Category) => {
        const getItem = (treeData: Category) => {
          if (treeData.children?.length === 0) {
            nodeWithOutChildrenArr.push(el);
          } else {
            treeData.children?.forEach((data: Category) => getItem(data));
          }
        };
        getItem(el);
      });
      if (nodeWithOutChildrenArr && arr) {
        const result = nodeWithOutChildrenArr?.filter((el: ICategory) => arr?.includes(el.key));
        const oldDataArr: Array<string> = [];
        result.forEach((el: ICategory) => {
          oldDataArr.push(el.key);
        });
        const currentTitle = result?.map((el: ICategory) => ({
          title: el.title,
          key: el.key,
        }));
        setCheckedKeys(oldDataArr);
        setOldTitle(currentTitle);
        setSelectedTitle(currentTitle);
        setTitle(currentTitle);
      }
      if (!nodeWithOutChildrenArr || !arr) {
        setCheckedKeys([]);
        setOldTitle([]);
        setTitle([]);
        setSelectedTitle([]);
      }
    }
  }, []);

  function handleOpenSelectCategoryModal() {
    setSelectCategoryModal(true);
    setVisibleFilterDropDown(false);
  }

  function handleChangeminPrice(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setminPrice(value);
  }

  function handleChangemaxPrice(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setmaxPrice(value);
  }
  function onOkSelectCategoryModal() {
    setSelectCategoryModal(false);
    setSelectedTitle(title);
    setOldData(checkedKeys);
    setOldTitle(title);
  }

  function handleApplyFilter() {
    const selectedKeysArr: Array<string> = [];
    selectedTitle.map((el: CateSelected) => selectedKeysArr.push(el.key));
    const newUrl = mergeParam(location.pathname, {
      ...currentFilter,
      sort,
      keyWord,
      categoryIds: selectedKeysArr?.length ? selectedKeysArr?.join(',') : null,
      minPrice,
      maxPrice,
    });
    history.push(newUrl);
    setVisibleFilterDropDown(false);
  }

  function handleResetFilter() {
    setCheckedKeys([]);
    setOldTitle([]);
    setTitle([]);
    setSelectedTitle([]);
    setminPrice('');
    setmaxPrice('');
    const newUrl = mergeParam(location.pathname, {
      ...currentFilter,
      sort,
      keyWord,
      minPrice: '',
      maxPrice: '',
      categoryIds: null,
    });
    history.push(newUrl);
  }

  function onCancleSelectCategoryModal() {
    setSelectCategoryModal(false);
    setCheckedKeys(oldData);
    setTitle(oldTitle);
    setSelectedTitle(oldTitle);
  }

  function handleAfterCloseSelectCategoryModal() {
    setVisibleFilterDropDown(true);
    setCheckedKeys(oldData);
    setTitle(oldTitle);
    setSelectedTitle(oldTitle);
  }

  const menu = (
    <Menu className="filter-dropdown-menu product">
      <div className="filter-dropdown-menu-container">
        <div className="price-range-container">
          <Form form={formFilter}>
            <Row gutter={[16, 32]}>
              <Col span={12}>
                <Form.Item className="form-input-wrapper" label="PRICE RANGE" name="minPrice">
                  <Input prefix="€" onChange={handleChangeminPrice} placeholder="Min" />
                </Form.Item>
              </Col>
              <Col className="max-price" span={12}>
                <Form.Item className="form-input-wrapper" name="maxPrice">
                  <Input prefix="€" onChange={handleChangemaxPrice} placeholder="Max" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 32]}>
              <Col span={24}>
                <Form.Item className="form-input-wrapper" label="CATEGORY" name="minPrice">
                  {selectedTitle.length === 0 ? (
                    <div onClick={handleOpenSelectCategoryModal} className="category-button">
                      <div className="fake-placeholder">Select Category</div>
                      <ArrowRightIcon className="category-button-icon" />
                    </div>
                  ) : (
                    <div onClick={handleOpenSelectCategoryModal} className="category-button">
                      {selectedTitle.length > 3 ? (
                        <div className="selected-category">
                          <p>{selectedTitle[0].title},</p>
                          <p>{selectedTitle[1].title},</p>
                          <p>{selectedTitle[2].title},</p>
                          <p>...</p>
                        </div>
                      ) : (
                        <div className="selected-category">
                          {selectedTitle.length === 1 ? (
                            <>
                              <p>{selectedTitle[0].title}</p>
                            </>
                          ) : (
                            <div className="selected-category">
                              {selectedTitle.length === 2 ? (
                                <>
                                  <p>{selectedTitle[0].title},</p>
                                  <p>{selectedTitle[1].title}</p>
                                </>
                              ) : (
                                <>
                                  <p>{selectedTitle[0].title},</p>
                                  <p>{selectedTitle[1].title},</p>
                                  <p>{selectedTitle[2].title}</p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      <ArrowRightIcon className="category-button-icon" />
                    </div>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <div className="filter-button-container">
              <CommonButton onClick={handleApplyFilter} className="mr-2 filter-button" size="middle">
                Apply
              </CommonButton>
              <CommonButton onClick={handleResetFilter} size="middle" variant="default" className="ml-2">
                Reset
              </CommonButton>
            </div>
          </Form>
        </div>
      </div>
    </Menu>
  );
  return (
    <>
      <Dropdown
        trigger={['click']}
        onVisibleChange={() => setVisibleFilterDropDown(!visileFilterDropDown)}
        visible={visileFilterDropDown}
        overlay={menu}
        placement="bottomLeft"
      >
        <CommonButton size="middle" variant="default" icon={<FilterIcon className="mr-1-5" />}>
          Filter
        </CommonButton>
      </Dropdown>
      <CategoryModal
        closable={false}
        afterClose={handleAfterCloseSelectCategoryModal}
        selectedTitle={selectedTitle}
        setSelectedTitle={setSelectedTitle}
        title={title}
        checkedKeys={checkedKeys}
        setCheckedKeys={setCheckedKeys}
        oldTitle={oldTitle}
        setOldTitle={setOldTitle}
        setTitle={setTitle}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onOk={onOkSelectCategoryModal}
        onCancel={onCancleSelectCategoryModal}
        visible={selectCategoryModal}
      />
    </>
  );
};

export default FilterComponent;
