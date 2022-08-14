import { Table, Select, message } from 'antd';
import 'antd/dist/antd.css';
import { ConfirmModal } from 'components/modal';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { Admin, AdminUpdateData } from 'services/api-admin.type';
import { formatDate } from 'utils/date';
import { useUpdateAdminStatus } from '../../admin.queries';
import { adminStatus, classAdminOptionByVariant } from '../admin.const';

export type AdminListingProps = {
  admin?: Admin[];
  page: number;
  perPage: number;
  isLoading: boolean;
};

export const AdminListing = ({ admin, page, perPage, isLoading }: AdminListingProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUpdateData>();
  const { Option } = Select;
  const history = useHistory();

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      width: '5%',
      key: 'no',
      render: (value: number, row: Admin, index: number) => {
        return String((page - 1) * perPage + index + 1).padStart(2, '0');
      },
      onclick: (record: Admin) => history.push(`/user/admin/:${record._id}`),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      width: '20%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '20%',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      width: '20%',
      render: (phone: number, row: Admin, index: number) => {
        return phone && `(+${row.country?.numberCode}) ${phone}`;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: '20%',
      render: (date: string) => <span>{formatDate(date)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string, row: Admin) => {
        return (
          <Select value={status} onChange={(status: string) => handleChangeStatus(status, row)} onClick={actionClick}>
            {adminStatus.map((item, index) => (
              <Option value={item} key={`status-${index}`}>
                <span className={classAdminOptionByVariant[item]}>{item}</span>
              </Option>
            ))}
          </Select>
        );
      },
    },
  ];
  const handleChangeStatus = (status: string, admin: Admin) => {
    setSelectedAdmin({
      ...admin,
      status,
      country: admin.country?._id,
      groupPermission: admin.groupPermission?._id,
      avatar: admin.avatar?._id,
    });
    setVisible(true);
  };

  const { mutate: saveAdmin } = useUpdateAdminStatus();

  const handleAcceptChangeStatus = () => {
    if (selectedAdmin) {
      saveAdmin(selectedAdmin, {
        onSuccess: () => {
          message.success({
            content: 'Update admin successfully!',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
        onError: () => {
          message.error({
            content: 'Update admin failed!',
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

  const actionClick = (e: any) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="table-paging">
        <Table
          className={admin?.length ? 'table-content' : 'table-second'}
          locale={{ emptyText: 'No result found' }}
          columns={columns}
          dataSource={admin}
          pagination={false}
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => history.push(`/user/admin/${record._id}`),
          })}
        />
      </div>
      <ConfirmModal
        visible={visible}
        onOk={handleAcceptChangeStatus}
        onCancel={() => setVisible(false)}
        okText={selectedAdmin?.status}
      >
        Are you sure to {selectedAdmin?.status?.toLowerCase()} this admin?
      </ConfirmModal>
    </>
  );
};
