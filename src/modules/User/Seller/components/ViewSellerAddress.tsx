import { Row, Col, Menu, Dropdown, Empty, message } from 'antd';
import { useState } from 'react';
import { SellerAddress } from 'services/api-address.type';
import { useParams } from 'react-router';
import { AddressIcon, EditAddressIcon, PhoneIcon, ThreeDotOptionIcon } from 'components/icons';
import { isEmpty } from 'utils/helper';
import { ConfirmModal } from 'components/modal';
import { LoadingComponent } from 'components/LoadingComponent';
import { useLocation, useHistory } from 'react-router-dom';
import { useParseParams } from 'hooks/use-params';
import { Seller } from 'services/api-seller.type';
import { useSellerAllAddressQuery, useUpdateSellerAddress, useDeleteSellerAddress } from '../seller.queries';
import { EditSellerAddress } from './EditSellerAddress';

type SellerParam = {
  sellerId: string;
};

interface ViewSellerAddressProps {
  detailSeller: Partial<Seller>;
}
export const ViewSellerAddress = ({ detailSeller }: ViewSellerAddressProps) => {
  const { sellerId } = useParams<SellerParam>();
  const { data, isLoading } = useSellerAllAddressQuery(sellerId);
  const { mutate: saveAdress } = useUpdateSellerAddress();
  const { mutate: deleteAddress } = useDeleteSellerAddress();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [editAddress, setEditAddress] = useState({});
  const [addressDelete, setAddressDelete] = useState<SellerAddress>();
  const { action } = useParseParams();

  const location = useLocation();
  const history = useHistory();

  const handleSetDefaultAddress = (input: SellerAddress) => {
    saveAdress({ ...input, isDefault: true, city: input.city?._id });
  };

  const handleOpenDeleteAddressModal = (item: SellerAddress) => {
    setOpenDeleteModal(true);
    setAddressDelete(item);
  };

  const handleDeleteAddress = () => {
    deleteAddress(addressDelete?._id as string, {
      onSuccess: (res) => {
        setOpenDeleteModal(false);
        message.success({
          content: 'Delete successfully',
          className: 'custom-class',
          style: {
            textAlign: 'right',
          },
        });
      },
      onError: (error) => {
        setOpenDeleteModal(false);
        message.error({
          content: 'Delete failed',
          className: 'custom-class',
          style: {
            textAlign: 'right',
          },
        });
      },
    });
  };

  const AddressMenu = (item: SellerAddress) => (
    <Menu className="action-menu">
      <Menu.Item disabled={item.isDefault} className="menu-item" onClick={() => handleSetDefaultAddress(item)}>
        Set as default
      </Menu.Item>
      <Menu.Item disabled={item.isDefault} className="menu-item" onClick={() => handleOpenDeleteAddressModal(item)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const handleEditAddress = (address: SellerAddress) => {
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
        <EditSellerAddress handleCancleEdit={handleCancleEdit} editAddress={editAddress} detailSeller={detailSeller} />
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
                      <span className="card-text">
                        (+{address?.shopProfile?.user.country?.numberCode}) {address.phone}
                      </span>
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
