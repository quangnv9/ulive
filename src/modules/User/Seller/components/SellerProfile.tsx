// import { useParams } from 'react-router-dom';
import { Form, Row, Col, message, Image } from 'antd';
import { EditBuyerIcon } from 'components/icons';
import { useEffect, useState } from 'react';
import { DateInput, StatusSelect, TextArea, TextInput } from 'components/form-control';
import { useParseParams } from 'hooks/use-params';
import { useHistory, useLocation, useParams } from 'react-router';
import { sellerStatus } from './seller.const';
import { CommonButton } from 'components/CommonButton';
import { ConfirmModal } from 'components/modal';
import './SellerProfile.scss';
import { configs } from 'constant';
import default_wall_image from 'assets/img/default_wall_image.png';
import { useGetSeller, useUpdateSeller } from '../seller.queries';
import { Seller } from 'services/api-seller.type';
import { LoadingComponent } from 'components/LoadingComponent';
import { isEmpty } from 'utils/helper';
import { numberOfCharactersShopDescription, numberOfCharactersShopName } from 'regex';

type AvatarUpload = {
  avatarUrl: string;
  _id: string;
};

type WallImageUpload = {
  wallImageUrl: string;
  _id: string;
};

type SellerDetailParam = {
  sellerId: string;
};

interface SellerDetailProps {
  getDetailSeller: (seller: Seller) => void;
}

export function SellerProfile({ getDetailSeller }: SellerDetailProps) {
  const [avatarUpload] = useState<AvatarUpload>({ avatarUrl: '', _id: '' });
  const [wallImageUpload] = useState<WallImageUpload>({ wallImageUrl: '', _id: '' });
  const [, setLoadingSave] = useState<boolean>(false);
  const [visibleConfirmModal, setVisibleConfirmModal] = useState<boolean>(false);
  const [visibleCancelConfirmModal, setVisibleCancelConfirmModal] = useState<boolean>(false);
  const { sellerId } = useParams<SellerDetailParam>();
  const [form] = Form.useForm();
  const { action } = useParseParams();
  const location = useLocation();
  const history = useHistory();

  const { data, isLoading } = useGetSeller(sellerId);
  const { mutate: saveSeller } = useUpdateSeller();

  const handleOnEditProfile = () => {
    history.push(`${location.pathname}?action=edit`);
  };

  const handleCancelButtonCloseModal = () => {
    form.setFieldsValue({
      name: data?.name,
      status: data?.status,
      shopDescription: data?.description,
    });
    history.push(location.pathname);
    setVisibleCancelConfirmModal(false);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data?.name,
        status: data?.status,
        shopDescription: data?.description,
      });
      getDetailSeller(data);
    }
  }, [data, getDetailSeller, form]);

  if (isLoading) {
    return <LoadingComponent size="large" />;
  }

  const handleCancelEdit = () => {
    form.setFieldsValue({
      name: data?.name,
      status: data?.status,
    });
    history.push(location.pathname);
    setVisibleConfirmModal(false);
  };

  const handleSaveProfile = (values: any) => {
    const { name, status, shopDescription } = values;
    const editName = name.trim();
    const editShopdescription = shopDescription.trim();
    if (
      editShopdescription.length === 0 ||
      editName.length === 0 ||
      !editName.match(numberOfCharactersShopName) ||
      !editShopdescription.match(numberOfCharactersShopDescription)
    ) {
      if (editShopdescription.length === 0) {
        form.setFields([
          {
            name: 'shopDescription',
            errors: ['This field is required'],
          },
        ]);
      }
      if (editName.length === 0) {
        form.setFields([
          {
            name: 'name',
            errors: ['This field is required'],
          },
        ]);
      }
      if (!editName.match(numberOfCharactersShopName)) {
        form.setFields([
          {
            name: 'name',
            errors: ['Shop name is between 5 to 30 characters'],
          },
        ]);
      }
      if (!editShopdescription.match(numberOfCharactersShopDescription)) {
        form.setFields([
          {
            name: 'shopDescription',
            errors: ['Shop description is between 50 to 500 characters'],
          },
        ]);
      }
      return;
    }
    if (data) {
      setLoadingSave(true);
      saveSeller(
        {
          ...data,
          name: editName,
          description: editShopdescription,
          status,
          logo: avatarUpload._id,
          wallImage: isEmpty(data?.wallImage) ? data?.wallImage?.key : wallImageUpload._id,
        },
        {
          onSuccess: (res) => {
            setLoadingSave(false);
            message
              .success(
                {
                  content: 'Edit successfully',
                  style: {
                    textAlign: 'right',
                  },
                },
                0.5,
              )
              .then(() => {
                history.push('/user/seller');
              });
          },
          onError: (error: any) => {
            setLoadingSave(false);
            message.error({
              content: error.response.data.message,
              style: {
                textAlign: 'right',
              },
            });
          },
        },
      );
    }
  };
  return (
    <>
      <div className="container-detail">
        <Row justify="center">
          <Col span={6} className="avatar-seller">
            <Image
              className="avatar-image"
              // size={120}
              style={{ color: '#696984', backgroundColor: '#fde3cf' }}
              src={isEmpty(avatarUpload.avatarUrl) ? configs.imageUrl + data?.logo?.key : avatarUpload.avatarUrl}
            >
              <span className="avatar-default-by-name">{data?.name?.charAt(0)}</span>
            </Image>
          </Col>
        </Row>
        <Row className="cover-image-container">
          <Image
            className="cover-image"
            src={isEmpty(data?.wallImage?.key) ? default_wall_image : configs.imageUrl + data?.wallImage?.key}
            alt=""
          />
        </Row>
        <Row justify="center">
          <Col lg={12} span={12} md={18} xs={22}>
            <Form className="form-input" autoComplete="off" onFinish={handleSaveProfile} form={form}>
              <Row gutter={[30, 15]}>
                <Col span={24}>
                  <TextInput
                    label="Shop Name"
                    name="name"
                    initialValue={data?.name}
                    rules={[
                      { required: true, message: 'This field is required' },
                      {
                        min: 5,
                        max: 30,
                        message: 'Shop name is between 5 to 30 characters',
                      },
                    ]}
                    disabled={!action}
                  />
                </Col>
              </Row>
              <Row gutter={[30, 15]}>
                <Col span={12}>
                  <TextInput label="Email" initialValue={data?.user?.email} name="email" disabled={true} />
                </Col>
                <Col span={12}>
                  <TextInput
                    label="Phone Number"
                    initialValue={data?.user?.phone && `(+${data?.user?.country.numberCode}) ${data?.user?.phone}`}
                    name="phone"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row gutter={[30, 15]}>
                <Col span={12}>
                  <DateInput label="Created Date" initialValue={data?.dateCreated} name="dateCreated" disabled={true} />
                </Col>
                <Col span={12}>
                  <StatusSelect
                    disabled={!action}
                    showArrow={!!action}
                    name="status"
                    label="Status"
                    initialValue={data?.status}
                    options={sellerStatus as []}
                  />
                </Col>
              </Row>
              <Row className="modified-row" gutter={[30, 0]}>
                <Col span={24}>
                  <TextArea
                    disabled={!action}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    rules={[
                      { required: true, message: 'This field is required' },
                      {
                        min: 50,
                        max: 500,
                        message: 'Shop description is between 50 to 500 characters',
                      },
                    ]}
                    label="Shop Description"
                    name="shopDescription"
                  />
                </Col>
              </Row>
              <Row>
                <Col span={12} />
                <Col span={12}>
                  <Form.Item className="btn-wrapper">
                    {!action ? (
                      <CommonButton
                        onClick={handleOnEditProfile}
                        size="middle"
                        variant="default"
                        icon={<EditBuyerIcon className="mr-1-5" />}
                      >
                        Edit seller profile
                      </CommonButton>
                    ) : (
                      <>
                        <div className="button-edit mr-3">
                          <CommonButton
                            space="space-medium"
                            onClick={() => setVisibleCancelConfirmModal(true)}
                            size="middle"
                            variant="default"
                            customWidth={true}
                          >
                            Cancel
                          </CommonButton>
                        </div>
                        <CommonButton space="space-medium" size="middle" customWidth={true} htmlType="submit">
                          Save
                        </CommonButton>
                      </>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <ConfirmModal
          visible={visibleConfirmModal}
          cancelText="No"
          okText="Yes"
          onCancel={() => setVisibleConfirmModal(false)}
          onOk={handleCancelEdit}
        >
          Are you sure to go back without saving?
        </ConfirmModal>
        <ConfirmModal
          visible={visibleCancelConfirmModal}
          cancelText="No"
          okText="Yes"
          onCancel={() => setVisibleCancelConfirmModal(false)}
          onOk={handleCancelButtonCloseModal}
        >
          Are you sure to cancel changing?
        </ConfirmModal>
      </div>
    </>
  );
}
