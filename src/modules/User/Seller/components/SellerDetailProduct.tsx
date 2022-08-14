import { Col, Form, Input, message, Row, Select, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { CommonButton } from 'components/CommonButton';
import { DeletePink } from 'components/icons/DeletePink';
import { ConfirmModal } from 'components/modal/modal-confirm';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getDetailProduct } from 'services/api-address.service';
import { UpdateProductStatus } from 'services/api-product.type';
import { CateSelected } from 'types';
import { classOptionByVariant, productStatus } from './product.const';
import { useRemoveProductQuery, useUpdateStautusProductQuery } from './product.queries';
import ProductImage from './ProductImage';
import { PriceInventoryForm } from './ProductProfile/AttributeInventoryForm';
import { ListVariant } from './ProductProfile/ListVariant';
import { OptionAttribute } from './ProductProfile/OptionAttribute';
import './SellerDetailProduct.scss';

type ProductDetailParam = {
  sellerId: string;
};

export interface ImageProduct {
  id: string;
  imageUrl: string;
}

interface UploadImageProduct {
  loading: boolean;
  listImage: Array<ImageProduct>;
}
export const SellerDetailProduct = () => {
  const productId = useParams<ProductDetailParam>().sellerId;
  const [formDetail] = Form.useForm();
  const [isLoadingGetDetail, setIsLoadingGetDetail] = useState(false);
  const [visibleChangeStatus, setVisibleChangeStatus] = useState<boolean>(false);
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<UpdateProductStatus>();
  const [upload, setUpload] = useState<UploadImageProduct>({ loading: false, listImage: [] });
  const [cateSelected, setCateSelected] = useState<Array<CateSelected>>([]);
  const [isOpenModalConfirm, setIsOpenModalConfirm] = useState<boolean>(false);
  const [isShowPriceInventory, setIsShowPriceInventory] = useState(false);
  const history = useHistory();
  const [basePriceInventory, setBasePriceInventory] = useState({
    originPrice: '',
    discountPrice: '',
    sku: '',
    quantity: '',
  });
  const [detailOPtionAttribute, setDetailOPtionAttribute] = useState(null);
  const [detailVariant, setDetailVariant] = useState(null);
  //sub function

  function handleChangeStatus(status: string) {
    setSelectedProduct({ _id: productId, status });
    setVisibleChangeStatus(true);
  }

  const { mutate: removeProduct } = useRemoveProductQuery();
  function handleDeleteProduct() {
    if (productId) {
      removeProduct([productId], {
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
    setVisible(false);
  }

  const { mutate: saveProduct } = useUpdateStautusProductQuery();
  function handleAcceptChangeStatus() {
    if (selectedProduct) {
      saveProduct(selectedProduct, {
        onSuccess: () => {
          message.success({
            content: 'Update product successfully!',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
        onError: () => {
          message.error({
            content: 'Update product failed!',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
      });
    }
    setVisibleChangeStatus(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getDataDetail() {
    setIsLoadingGetDetail(true);
    getDetailProduct(productId)
      .then((res: any) => {
        // base data
        formDetail.setFieldsValue({
          productName: res.name,
          descriptions: res.descriptions,
          status: res.status,
        });
        // image
        const imageResponse = res.imageIds.map((item: { _id: string; key: string }) => ({
          id: item._id,
          imageUrl: `https://vinivia-liveshopping-dev.s3.us-east-2.amazonaws.com/${item.key}`,
        }));
        setUpload((prevState) => ({
          ...prevState,
          listImage: imageResponse,
        }));
        // category
        setCateSelected([{ key: res.category._id, title: res.category.pathName.replaceAll('/', '>') }]);
        //price and inventory
        if (res.type === 'Single') {
          setIsShowPriceInventory(true);
          const priceInventoryDetail = {
            originPrice: res.productVariant[0].price,
            discountPrice: res.productVariant[0].discountPrice,
            sku: res.productVariant[0].sku,
            quantity: res.productVariant[0].quantity,
          };
          setBasePriceInventory(priceInventoryDetail);
        } else if (res.type === 'Multiple') {
          //listVariant
          setDetailVariant(
            res.productVariant.map(
              (item: { price: any; discountPrice: any; sku: any; quantity: any; name: any }, index: number) => ({
                originPrice: item.price,
                discountPrice: item.discountPrice,
                sku: item.sku ? `#${item.sku}` : '#',
                quantity: item.quantity,
                name: item.name,
                key: `${index}`,
                no: String(index + 1).padStart(2, '0'),
              }),
            ),
          );
          //priceOption
          setDetailOPtionAttribute(res.attributes);
        } else {
          return;
        }
        setIsLoadingGetDetail(false);
      })
      .catch(function () {
        setIsLoadingGetDetail(false);
        return;
      });
  }
  useEffect(() => {
    getDataDetail();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="detail-product-container">
      <>
        {isLoadingGetDetail ? (
          <Spin size="large" style={{ textAlign: 'center', display: 'block' }} />
        ) : (
          <>
            <Form form={formDetail} layout="vertical">
              {/*  Basic information form */}
              <div className="basic-info-wrapper">
                <h1 className="title-basic-info">Basic Information</h1>
                <Row>
                  <Col span={16}>
                    <Form.Item
                      label="Product Name*"
                      name="productName"
                      required={true}
                      rules={[
                        { required: true, message: 'This is required field' },
                        { min: 1, max: 150, message: 'Product name is between 01 to 150 characters' },
                      ]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item label="Image*" name="productImage">
                      <div className="image-product-wrapper">
                        {upload.listImage.map((image, index) => (
                          <div className="wrapper-product-image">
                            <ProductImage key={image.id} productImage={image} />
                            <span className="image-position-title">
                              {index === 0 ? 'Cover Image' : `Image ${index}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={16}>
                    <Form.Item label="Category*" name="categories">
                      <CommonButton disabled variant="dashed" block>
                        <div className="btn-select-product-cate-content">
                          {cateSelected.length > 0 ? (
                            <ul className="cate-selected-wrapper">
                              {cateSelected.map((item, index) => (
                                <li key={item.key}>
                                  <span className="selected-item">
                                    {item.title} <span>{index !== cateSelected.length - 1 && '>'}</span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span>Select category</span>
                          )}
                        </div>
                      </CommonButton>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label="Product Description*"
                      name="descriptions"
                      rules={[
                        { required: true, message: 'This is required field' },
                        {
                          min: 30,
                          max: 500,
                          message: 'Product description is between 30 to 500 characters',
                        },
                      ]}
                    >
                      <TextArea disabled placeholder="Type description here" autoSize={{ minRows: 5, maxRows: 10 }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Form.Item label="Status*" name="status" initialValue="Active">
                      <Select
                        showArrow
                        className="product-select-status"
                        onChange={(status: string) => handleChangeStatus(status)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {productStatus.map((item, index) => (
                          <Select.Option key={`status-${index}`} value={item}>
                            <span className={classOptionByVariant[item]}>{item}</span>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              {/*  Attribute combination form */}
              <div>
                {isShowPriceInventory && <PriceInventoryForm basePriceInventory={basePriceInventory} />}
                {detailOPtionAttribute && <OptionAttribute detailOPtionAttribute={detailOPtionAttribute} />}
                {detailVariant && <ListVariant detailVariant={detailVariant} />}
              </div>

              <div>
                <Row justify="end">
                  <Col span={12}>
                    <div className="wrapper-act-btn">
                      <CommonButton
                        variant="default"
                        className="bg-transparent mr-2"
                        space="space-large"
                        icon={<DeletePink fill=" #E56C76" className="mr-1-5" />}
                        onClick={() => setVisible(true)} //handle delete
                      >
                        Delete Product
                      </CommonButton>
                      <div style={{ width: '24px' }}></div>
                      <CommonButton variant="default" onClick={() => setIsOpenModalConfirm(true)} space="space-large">
                        Back
                      </CommonButton>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
            <ConfirmModal
              cancelText="No"
              okText="Yes"
              visible={isOpenModalConfirm}
              onCancel={() => setIsOpenModalConfirm(false)}
              onOk={() => history.push('user/seller/')}
            >
              Are you sure to go back without saving?
            </ConfirmModal>
            <ConfirmModal
              visible={visibleChangeStatus}
              onOk={handleAcceptChangeStatus}
              onCancel={() => setVisibleChangeStatus(false)}
              okText={selectedProduct?.status}
            >
              Are you sure to {selectedProduct?.status.toLowerCase()} this product?
            </ConfirmModal>
            <ConfirmModal
              visible={visible}
              onOk={handleDeleteProduct}
              onCancel={() => setVisible(false)}
              okText="Delete"
            >
              Are you sure to delete this product?
            </ConfirmModal>
          </>
        )}
      </>
    </div>
  );
};
