import { message, Select, Table } from 'antd';
import { formatDate } from 'utils/date';
import { GroupPermission } from 'services/api-permission.type';
import { classOptionByVariant, groupPermissionStatus } from '../permission.const';
import { useHistory } from 'react-router';
import React, { useState } from 'react';
import { ConfirmModal } from 'components/modal';
import { useUpdateGroupPerMission } from '../permission.queries';

export type GroupPermissionProps = {
  groupPermission?: GroupPermission[];
  isLoading?: boolean;
  page: number;
  perPage: number;
};

export const GroupPermissionListing = ({ groupPermission, isLoading, page, perPage }: GroupPermissionProps) => {
  const history = useHistory();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupPermission>();
  const { Option } = Select;
  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'no',
      width: '5%',
      render: (value: number, row: GroupPermission, index: number) =>
        String((page - 1) * perPage + index + 1).padStart(2, '0'),
      onclick: (record: GroupPermission) => history.push(`/user/permission/:${record._id}`),
    },
    {
      title: 'Group Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created Date',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: '15%',
      render: (date: string) => <span>{formatDate(date)}</span>,
    },
    {
      title: 'Updated Date',
      dataIndex: 'dateUpdated',
      key: 'dateUpdated',
      width: '15%',
      render: (date: string) => <span>{formatDate(date)}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string, row: GroupPermission) => (
        <Select value={status} onChange={(status: string) => handleChangeStatus(status, row)} onClick={handleClick}>
          {groupPermissionStatus.map((item, index) => (
            <Option value={item} key={`status-${index}`}>
              <span className={classOptionByVariant[item]}>{item}</span>
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  const handleChangeStatus = (status: string, group: GroupPermission) => {
    setSelectedGroup({ ...group, status });
    setVisible(true);
  };

  const { mutate: saveGroupPermission } = useUpdateGroupPerMission();

  const handleAcceptChangeStatus = () => {
    if (selectedGroup) {
      saveGroupPermission(selectedGroup, {
        onSuccess: () => {
          message.success({
            content: 'Update permission successfully!',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
        onError: () => {
          message.error({
            content: 'Update permission failed!',
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
          locale={{ emptyText: 'No result found' }}
          className={groupPermission?.length ? 'table-content' : 'table-second'}
          columns={columns}
          dataSource={groupPermission}
          pagination={false}
          loading={isLoading}
          onRow={(record) => ({
            onClick: () => {
              history.replace(`/user/permission/${record._id}`);
              window.location.reload();
            },
          })}
          rowKey={(record: GroupPermission | any) => record?._id}
        />
      </div>
      <ConfirmModal
        visible={visible}
        onOk={handleAcceptChangeStatus}
        onCancel={() => setVisible(false)}
        okText={selectedGroup?.status}
      >
        Are you sure to {selectedGroup?.status.toLowerCase()} this group permission?
      </ConfirmModal>
    </>
  );
};
