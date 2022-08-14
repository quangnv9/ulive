import { useState } from 'react';
import { Select, Table, message, Modal } from 'antd';
import './index.scss';
import { ConfirmModal } from 'components/modal/modal-confirm';
import { Attribute } from 'services/api-attribute.type';
import { attributeStatus, classOptionByVariant } from '../attribute.const';
import { useDeleteAttribute, useUpdateAttribute } from '../../attribute.queries';
import { UTrashAltIcon } from 'components/icons';

export type AttributeListingProps = {
  attributes?: any;
  isLoading?: boolean;
  page: number;
  perPage: number;
};

export const AttributeListing = ({ attributes, isLoading, page, perPage }: AttributeListingProps) => {
  const [visible, setVisible] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute>();
  const [openDeleteErrorModal, setOpenDeleteErrorModal] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [errorChangeStatusMessage, setErrorChangeStatusMessage] = useState<string>();
  const [openChangeStatusErrorModal, setOpenChangeStatusErrorModal] = useState<boolean>();
  const [attributeDelete, setAttributeDelete] = useState<Attribute>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const { Option } = Select;
  const { mutate: deleteAttribute } = useDeleteAttribute();

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (text: any, record: Attribute, index: number) => (
        <div className="attribute-table-row" onClick={stopPagination}>
          {`0${(page - 1) * perPage + index + 1}`.slice(-2)}
        </div>
      ),
      width: '5%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '70%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      align: 'center' as 'center',
      render: (status: string, row: Attribute) => (
        <div className="flex item-center">
          <Select value={status} onChange={(status: string) => handleChangeStatus(status, row)} onClick={actionClick}>
            {attributeStatus.map((item, index) => (
              <Option value={item} key={`status-${index}`}>
                <span className={classOptionByVariant[item]}>{item}</span>
              </Option>
            ))}
          </Select>
        </div>
      ),
    },
    {
      title: 'Action',
      align: 'center' as 'center',
      width: '15%',
      render: (id: string, row: Attribute) => {
        return (
          <div className="item-center">
            <UTrashAltIcon onClick={(event) => handleOpenDeleteAttributeModal(row, event)} />
          </div>
        );
      },
    },
  ];

  //Delete Attribute

  const stopPagination = (e: any) => {
    e.stopPropagation();
  };

  const handleOpenDeleteAttributeModal = (item: Attribute, e: any) => {
    e.stopPropagation();
    setOpenDeleteModal(true);
    setAttributeDelete(item);
  };

  const handleAcceptDeleteAttribute = () => {
    setIsLoadingDelete(true);
    deleteAttribute(attributeDelete?._id as string, {
      onSuccess: (res) => {
        setOpenDeleteModal(false);
        message.success({
          content: 'Delete successfully',
          className: 'custom-class',
          style: {
            textAlign: 'right',
          },
        });
        setIsLoadingDelete(false);
      },
      onError: (error: any) => {
        setOpenDeleteModal(false);
        setOpenDeleteErrorModal(true);
        setErrorMessage(error.message);
        setIsLoadingDelete(false);
      },
    });
  };

  //Change Status

  const actionClick = (e: any) => {
    e.stopPropagation();
  };

  const handleChangeStatus = (status: string, attribute: Attribute) => {
    setSelectedAttribute({
      ...attribute,
      status,
    });
    setVisible(true);
  };

  const { mutate: saveAttribute } = useUpdateAttribute();

  const handleAcceptChangeStatus = (e: any) => {
    if (selectedAttribute) {
      saveAttribute(selectedAttribute, {
        onSuccess: () => {
          setVisible(false);
          message.success({
            content: 'Update attribute successfully',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        },
        onError: (error: any) => {
          setVisible(false);
          setOpenChangeStatusErrorModal(true);
          setErrorChangeStatusMessage(error.message);
        },
      });
    }
    setVisible(false);
  };

  return (
    <>
      <div className="table-paging">
        <Table
          className={attributes?.length ? 'table-content' : 'table-second'}
          columns={columns}
          dataSource={attributes}
          pagination={false}
          loading={isLoading}
          rowKey={(record: Attribute | any) => record?._id}
          locale={{ emptyText: 'No result found' }}
        />
      </div>
      <ConfirmModal
        visible={visible}
        onOk={handleAcceptChangeStatus}
        onCancel={() => setVisible(false)}
        okText={attributes?.status}
      >
        Are you sure to{' '}
        {attributes?.status?.toLowerCase() === 'banned' ? 'ban' : selectedAttribute?.status?.toLowerCase()} this
        attribute?
      </ConfirmModal>
      <ConfirmModal
        visible={openDeleteModal}
        okText="Delete"
        onCancel={() => setOpenDeleteModal(false)}
        onOk={handleAcceptDeleteAttribute}
        okButtonProps={{ loading: isLoadingDelete }}
      >
        Are you sure to delete this attribute?
      </ConfirmModal>
      <Modal
        visible={openDeleteErrorModal}
        width={353}
        className="error-modal-wrapper"
        footer={null}
        closable={false}
        cancelText="Close"
        centered
      >
        {errorMessage}
        <div onClick={() => setOpenDeleteErrorModal(false)}>Close</div>
      </Modal>
      <Modal
        visible={openChangeStatusErrorModal}
        width={353}
        className="error-modal-wrapper"
        footer={null}
        closable={false}
        cancelText="Close"
        centered
      >
        {errorChangeStatusMessage}
        <div onClick={() => setOpenChangeStatusErrorModal(false)}>Close</div>
      </Modal>
    </>
  );
};
