import { useState } from 'react';
import { message, Select, Table, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import { formatDate } from 'utils/date';
import { Seller, SellerUpdateData } from 'services/api-seller.type';
import './styles.scss';
import { ConfirmModal } from 'components/modal/modal-confirm';
import { classOptionByVariant, sellerStatus } from '../seller.const';
import { useUpdateSeller } from '../../seller.queries';

export type SellerListingProps = {
  sellers?: any;
  isLoading?: boolean;
  page: number;
  perPage: number;
};

export const SellerListing = ({ sellers, isLoading, page, perPage }: SellerListingProps) => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<SellerUpdateData>();
  const { Option } = Select;

  const columns = [
    {
      title: 'Shop Name',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      ellipsis: {
        showTitle: false,
      },
      render: (email: string, row: Seller) => {
        if (row?.user?.email?.split('.').join('').length > 30) {
          return (
            <Tooltip placement="topLeft" title={email}>
              {row?.user?.email}
            </Tooltip>
          );
        } else {
          return <span>{row?.user?.email}</span>;
        }
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      width: '20%',
      render: (phone: string, row: Seller) => {
        if (!row?.user?.phone) {
          return null;
        } else {
          return <span>{`(+${row?.user.country.numberCode}) ${row?.user?.phone}`}</span>;
        }
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      render: (date: string) => <span>{formatDate(date)}</span>,
      width: '15%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string, row: Seller) => (
        <Select value={status} onChange={(status: string) => handleChangeStatus(status, row)} onClick={actionClick}>
          {sellerStatus.map((item, index) => (
            <Option value={item} key={`status-${index}`}>
              <span className={classOptionByVariant[item]}>{item}</span>
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const actionClick = (e: any) => {
    e.stopPropagation();
  };

  const handleChangeStatus = (status: string, seller: Seller) => {
    setSelectedSeller({
      ...seller,
      status,
      logo: seller?.logo?.key,
      wallImage: seller?.wallImage?.key,
    });
    setVisible(true);
  };
  const { mutate: saveSeller } = useUpdateSeller();

  const handleAcceptChangeStatus = () => {
    if (selectedSeller) {
      saveSeller(selectedSeller, {
        onSuccess: () => {
          message.success({
            content: 'Update seller successfully!',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
        onError: () => {
          message.error({
            content: 'Update seller failed!',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
      });
    }
    setVisible(false);
  };

  return (
    <>
      <div className="table-paging">
        <Table
          className={sellers?.length ? 'table-content' : 'table-second'}
          columns={columns}
          dataSource={sellers}
          pagination={false}
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => history.push(`/user/seller/${record._id}`),
          })}
          rowKey={(record: Seller | any) => record?._id}
          locale={{ emptyText: 'No result found' }}
        />
      </div>
      <ConfirmModal
        visible={visible}
        onOk={handleAcceptChangeStatus}
        onCancel={() => setVisible(false)}
        okText={selectedSeller?.status}
      >
        Are you sure to{' '}
        {selectedSeller?.status.toLowerCase() === 'banned' ? 'ban' : selectedSeller?.status.toLowerCase()} this seller?
      </ConfirmModal>
    </>
  );
};
