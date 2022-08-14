import { useState } from 'react';
import { Select, Table, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import { formatDate } from 'utils/date';
import { buyerStatus, classOptionByVariant } from '../buyer.const';
import { useUpdateBuyer } from '../../buyer.queries';
import { Buyer, BuyerUpdateData } from 'services/api-buyer.type';
import './styles.scss';
import { ConfirmModal } from 'components/modal/modal-confirm';
import { alertMessage } from 'utils/helper';

export type BuyerListingProps = {
  buyers?: Buyer[];
  isLoading?: boolean;
  page: number;
  perPage: number;
};

export const BuyerListing = ({ buyers, isLoading, page, perPage }: BuyerListingProps) => {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerUpdateData>();
  const { Option } = Select;

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text: any, record: Buyer, index: number) => `0${(page - 1) * perPage + index + 1}`.slice(-2),
      onclick: (record: Buyer) => history.push(`/user/buyer/:${record._id}`),
      width: '10%',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'useName',
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
      render: (email: string) => {
        if (email?.split('.').join('').length > 30) {
          return (
            <Tooltip placement="topLeft" title={email}>
              {email}
            </Tooltip>
          );
        } else {
          return <span>{email}</span>;
        }
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phoneNumber',
      width: '20%',
      render: (phone: string, row: Buyer) => {
        if (!phone) {
          return null;
        } else {
          return <span>{row.country ? `(+${row.country?.numberCode}) ${phone}` : phone}</span>;
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
      render: (status: string, row: Buyer) => (
        <Select value={status} onChange={(status: string) => handleChangeStatus(status, row)} onClick={actionClick}>
          {buyerStatus.map((item, index) => (
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

  const handleChangeStatus = (status: string, buyer: Buyer) => {
    setSelectedBuyer({
      ...buyer,
      country: buyer.country?._id,
      status,
      profile: { avatar: '' },
    });
    setVisible(true);
  };

  const { mutate: saveBuyer } = useUpdateBuyer();

  const handleAcceptChangeStatus = () => {
    if (selectedBuyer) {
      saveBuyer(selectedBuyer, {
        onSuccess: () => {
          alertMessage('Update buyer successfully!', 'success');
        },
        onError: () => {
          alertMessage('Update buyer failed!', 'error');
        },
      });
    }
    setVisible(false);
  };

  return (
    <>
      <div className="table-paging">
        <Table
          className={buyers?.length ? 'table-content' : 'table-second'}
          columns={columns}
          dataSource={buyers}
          pagination={false}
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => history.push(`/user/buyer/${record._id}`),
          })}
          rowKey={(record: Buyer | any) => record?._id}
          locale={{ emptyText: 'No result found' }}
        />
      </div>
      <ConfirmModal
        visible={visible}
        onOk={handleAcceptChangeStatus}
        onCancel={() => setVisible(false)}
        okText={selectedBuyer?.status}
      >
        Are you sure to {selectedBuyer?.status.toLowerCase() === 'banned' ? 'ban' : selectedBuyer?.status.toLowerCase()}{' '}
        this buyer
      </ConfirmModal>
    </>
  );
};
