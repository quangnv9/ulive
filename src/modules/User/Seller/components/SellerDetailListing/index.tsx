import { ConfirmModal } from 'components/modal';
import { useState } from 'react';
import { Product, UpdateProductStatus } from 'services/api-product.type';
import { formatDate } from 'utils/date';
import { message, Select, Table } from 'antd';
import { classOptionByVariant, productStatus } from '../product.const';
import { useUpdateStautusProductQuery } from '../product.queries';
import { configs } from 'constant';
import { useHistory } from 'react-router-dom';

export interface SellerDetailListingProps {
  product?: any;
  isLoading: boolean;
  selectedRowKeys: Array<string>;
  onSelectedRowKeys: any;
}
export const SellerDetailListing = ({
  product,
  isLoading,
  selectedRowKeys,
  onSelectedRowKeys,
}: SellerDetailListingProps) => {
  const { Option } = Select;
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<UpdateProductStatus>();
  const history = useHistory();

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      width: '20%',
      render: (value: string, row: any) => {
        return (
          <div className="flex item-center">
            <img
              src={`${configs.imageUrl}${row?.imageIds[0]?.key}`}
              alt=""
              width="30%"
              style={{ borderRadius: '8px', marginRight: '24px' }}
            />
            <span>{row?.name}</span>
          </div>
        );
      },
    },
    {
      title: 'Variants',
      dataIndex: 'variants',
      width: '10%',
      render: (value: string, row: Product) => (
        <span>{row?.productVariant?.totalVariant === 1 ? 0 : row?.productVariant?.totalVariant}</span>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (value: string, row: any) => {
        let resultShowData: string = '';
        // Single
        if (row?.productVariant.minPrice === row?.productVariant.maxPrice) {
          resultShowData = `€${row?.productVariant.minPrice}`;
          if (row?.productVariant.minPrice !== row?.productVariant.minOriginalPrice) {
            // on sale
            resultShowData = `€${row?.productVariant.minPrice} ~ €${row?.productVariant.maxPrice}`;
          }
        } else {
          resultShowData = `€${row?.productVariant.minPrice} ~ €${row?.productVariant.maxPrice}`;
          // Multiple
        }
        return resultShowData;
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (value: string, row: any) => <span>{row?.productVariant.totalQuantity}</span>,
    },
    {
      title: 'Created Date',
      dataIndex: 'dateCreated',
      render: (date: string) => <span>{formatDate(date)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '15%',
      render: (status: string, row: Product) => {
        return (
          <Select value={status} onChange={(status: string) => handleChangeStatus(status, row)} onClick={actionClick}>
            {productStatus.map((item, index) => (
              <Option value={item} key={`status-${index}`}>
                <span className={classOptionByVariant[item]}>{item}</span>
              </Option>
            ))}
          </Select>
        );
      },
    },
  ];

  function actionClick(e: any) {
    e.stopPropagation();
  }

  function handleChangeStatus(status: string, product: Product) {
    let str = JSON.stringify(product);
    str = str.replace(/key/g, '_id');
    const value = JSON.parse(str);
    setSelectedProduct({ _id: value._id, status });
    setVisible(true);
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
    setVisible(false);
  }

  function onSelectChange(value: any) {
    onSelectedRowKeys(value);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <>
      <div className="table-paging">
        <Table
          loading={isLoading}
          className="table-content"
          columns={columns}
          dataSource={product}
          pagination={false}
          locale={{ emptyText: 'No product has been added' }}
          rowSelection={product?.length && rowSelection}
          onRow={(record) => ({
            onClick: () => history.push(`/user/seller/product-details/${record.key}`),
          })}
        />
      </div>
      <ConfirmModal
        visible={visible}
        onOk={handleAcceptChangeStatus}
        onCancel={() => setVisible(false)}
        okText={selectedProduct?.status}
      >
        Are you sure to {selectedProduct?.status.toLowerCase()} this product?
      </ConfirmModal>
    </>
  );
};
