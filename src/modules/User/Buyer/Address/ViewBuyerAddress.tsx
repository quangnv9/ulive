import { Row, Col, Menu, Dropdown, Empty } from 'antd';
import './ViewBuyerAddress.scss';
import { useState } from 'react';
import { useBuyerAllAddressQuery, useDeleteBuyerAddress, useUpdateAddress } from 'modules/User/Buyer/buyer.queries';
import { Address } from 'services/api-address.type';
import { useParams } from 'react-router';
import { AddressIcon, EditAddressIcon, PhoneIcon, ThreeDotOptionIcon } from 'components/icons';
import { EditBuyerAddress } from './EditBuyerAddress';
import { alertMessage, isEmpty } from 'utils/helper';
import { Buyer } from 'services/api-buyer.type';
import { ConfirmModal } from 'components/modal';
import { LoadingComponent } from 'components/LoadingComponent';
import { useLocation, useHistory } from 'react-router-dom';
import { useParseParams } from 'hooks/use-params';

type BuyerParam = {
  buyerId: string;
};

interface ViewBuyerAddressProps {
  detailBuyer: Partial<Buyer>;
}
export const ViewBuyerAddress = ({ detailBuyer }: ViewBuyerAddressProps) => {
  const { buyerId } = useParams<BuyerParam>();
  const { data, isLoading } = useBuyerAllAddressQuery(buyerId);
  const { mutate: saveAdress } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteBuyerAddress();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [editAddress, setEditAddress] = useState({});
  const [addressDelete, setAddressDelete] = useState<Address>();
  const { action } = useParseParams();

  const location = useLocation();
  const history = useHistory();

  const handleSetDefaultAddress = (input: Address) => {
    saveAdress({ ...input, isDefault: true, city: input.city?._id });
  };

  const handleOpenDeleteAddressModal = (item: Address) => {
    setOpenDeleteModal(true);
    setAddressDelete(item);
  };

  const handleDeleteAddress = () => {
    deleteAddress(addressDelete?._id as string, {
      onSuccess: (res) => {
        setOpenDeleteModal(false);
        alertMessage('Delete buyer successfully', 'success');
      },
      onError: (error) => {
        setOpenDeleteModal(false);
        alertMessage('Delete buyer failed', 'error');
      },
    });
  };

  const AddressMenu = (item: Address) => (
    <Menu className="action-menu">
      <Menu.Item disabled={item.isDefault} className="menu-item" onClick={() => handleSetDefaultAddress(item)}>
        Set as default
      </Menu.Item>
      <Menu.Item disabled={item.isDefault} className="menu-item" onClick={() => handleOpenDeleteAddressModal(item)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const handleEditAddress = (address: Address) => {
    setEditAddress(address);
    history.push(`${location.pathname}?action=edit`);
  };

  const handleCancleEdit = () => {
    setEditAddress({});
    history.push(location.pathname);
  };

  if (isLoading) {
    return <LoadingComponent size="large" />;
  }
  if (data?.length === 0) {
    return <Empty />;
  }

  return (
    <>
      {!isEmpty(editAddress) && action ? (
        <EditBuyerAddress handleCancleEdit={handleCancleEdit} editAddress={editAddress} detailBuyer={detailBuyer} />
      ) : (
        <>
          <div className="address-container">
            <Row gutter={[24, 24]}>
              {data?.map((address, index) => (
                <Col span={12} key={`address-${index}`}>
                  <div className="address-card">
                    <div className="card-row card-row__between">
                      <div className="card-row__left">
                        <span className="full-name">{address.fullName}</span>
                        {address.isDefault && <span className="default">Default</span>}
                      </div>
                      <div className="card-row__right">
                        <span className="icon edit-icon" onClick={() => handleEditAddress(address)}>
                          <EditAddressIcon />
                        </span>
                        <Dropdown trigger={['click']} overlay={() => AddressMenu(address)} placement="bottomRight">
                          <span className="icon">
                            <ThreeDotOptionIcon />
                          </span>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="card-row">
                      <span className="card-icon">
                        <PhoneIcon />
                      </span>
                      <span className="card-text">{address.phone}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-icon">
                        <AddressIcon />
                      </span>
                      <div className="address-with-city">
                        <span className="card-text">{address.address}</span>
                        <span className="card-text">{address.city ? address.city.name : null}</span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          <ConfirmModal
            visible={openDeleteModal}
            okText="Delete"
            onCancel={() => setOpenDeleteModal(false)}
            onOk={handleDeleteAddress}
          >
            Are you sure to delete this address?
          </ConfirmModal>
        </>
      )}
    </>
  );
};
