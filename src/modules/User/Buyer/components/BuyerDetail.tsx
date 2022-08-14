import { Form, Row, Col, message, Avatar } from 'antd';
import { CameraIcon, EditBuyerIcon, LoadingIcon } from 'components/icons';
import '../components/styles/BuyerDetail.scss';
import { useEffect, useState } from 'react';
import { buyerStatus } from './buyer.const';
import { useParams } from 'react-router-dom';
import { useGetBuyer, useUpdateBuyer } from '../buyer.queries';
import { DateInput, StatusSelect, TextInput } from 'components/form-control';
import { UploadFile } from 'components/UploadFile';
import { configs } from 'constant';
import { getCurrentUser } from 'redux/auth/auth.selectors';
import { store } from 'redux/store';
import { Buyer } from 'services/api-buyer.type';
import { alertMessage, isEmpty } from 'utils/helper';
import { CommonButton } from 'components/CommonButton';
import { LoadingComponent } from 'components/LoadingComponent';
import { noSpace, onlyLettersNumbersUnderscoresPeriods } from 'regex';
import { ConfirmModal } from 'components/modal';
import { useLocation, useHistory } from 'react-router-dom';
import { useParseParams } from 'hooks/use-params';
import avatarDefault from 'assets/img/avatar_default.png';

type BuyerDetailParam = {
  buyerId: string;
};

type ValueBuyerToUpdate = {
  username: string;
  name?: string;
  status: string;
};
type AvatarUpload = {
  avatarUrl: string;
  _id: string;
};
interface BuyerDetailProps {
  getDetailBuyer: (buyer: Buyer) => void;
}

export function BuyerDetail({ getDetailBuyer }: BuyerDetailProps) {
  const { buyerId } = useParams<BuyerDetailParam>();
  const { data, isLoading } = useGetBuyer(buyerId);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [avatarUpload, setAvatarUpload] = useState<AvatarUpload>({ avatarUrl: '', _id: '' });
  const [loadingUploadAvatar, setLoadingUploadAvatar] = useState<boolean>(false);
  const [isOpenModalConfirmCancleEdit, setIsOpenModalConfirmCancleEdit] = useState<boolean>(false);
  const location = useLocation();
  const history = useHistory();
  const { action } = useParseParams();

  const [form] = Form.useForm();
  const currentUser = getCurrentUser(store.getState());

  const handleOnEditProfile = () => {
    history.push(`${location.pathname}?action=edit`);
  };

  const { mutate: saveBuyer } = useUpdateBuyer();

  const handleSaveProfile = (values: ValueBuyerToUpdate) => {
    const { username, status, name } = values;
    if (!username.match(onlyLettersNumbersUnderscoresPeriods)) {
      if (!username.match(onlyLettersNumbersUnderscoresPeriods)) {
        form.setFields([
          {
            name: 'username',
            errors: ['Username only use letters, numbers, underscores and periods'],
          },
        ]);
      }

      return;
    }

    if (data) {
      const editName = isEmpty(name) ? null : name?.trim();
      const profile = {
        ...data.profile,
        avatar: avatarUpload._id ? avatarUpload._id : (data.profile.avatar?._id as string),
        fullName: editName?.length === 0 ? null : editName,
      };

      setLoadingSave(true);
      saveBuyer(
        { ...data, profile, username, status, country: data?.country?._id },
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
                history.push('/user/buyer');
              });
          },
          onError: (error: any) => {
            setLoadingSave(false);
            alertMessage(`${error.response.data.message}`, 'error');
          },
        },
      );
    }
  };

  const onModalOkEdit = () => {
    if (data) {
      form.setFieldsValue({
        username: data.username,
        name: data?.profile.fullName,
        status: data.status,
      });
    }
    history.push(location.pathname);

    setAvatarUpload({
      _id: '',
      avatarUrl: '',
    });
    setIsOpenModalConfirmCancleEdit(false);
    history.push(location.pathname);
  };
  const handleCancelEdit = () => {
    setIsOpenModalConfirmCancleEdit(true);
  };

  useEffect(() => {
    if (data) {
      getDetailBuyer(data);
    }
  }, [data, getDetailBuyer]);

  if (isLoading) {
    return <LoadingComponent size="large" />;
  }

  const handleUploadAvatar = (info: any) => {
    if (!info.file.status) {
      setLoadingUploadAvatar(false);
    } else {
      setLoadingUploadAvatar(true);
      if (info.file.status === 'done') {
        setLoadingUploadAvatar(false);
        let avatarUrl = configs.imageUrlTemp + info.file.response.data.key;
        setAvatarUpload({ avatarUrl, _id: info.file.response.data._id });
      } else if (info.file.status === 'error') {
        setLoadingUploadAvatar(false);
        alertMessage('Upload avatar failed, Please try again !', 'error');
      }
    }
  };

  return (
    <div className="container-buyer-detail">
      <Row justify="center">
        <Col lg={12} span={12} md={18} xs={22}>
          <Row justify="center">
            <Col span={6} className="avatar-buyer">
              <Avatar
                size={120}
                style={{ color: '#696984', backgroundColor: '#fde3cf' }}
                src={
                  isEmpty(avatarUpload.avatarUrl)
                    ? data?.profile.avatar
                      ? configs.imageUrl + data?.profile.avatar?.key
                      : avatarDefault
                    : avatarUpload.avatarUrl
                }
              >
                <span className="avatar-default-by-name">{data?.username?.charAt(0)}</span>
              </Avatar>
              {loadingUploadAvatar && (
                <div className="loading-upload-avatar">
                  <LoadingIcon />
                </div>
              )}

              {action && (
                <UploadFile
                  uploadUrl={`${configs.apiUploadUrl}/avatar`}
                  name="avatar"
                  onChange={handleUploadAvatar}
                  className="avatar-uploader"
                  accessToken={currentUser?.accessToken}
                >
                  <div className="icon-container">
                    <CameraIcon />
                  </div>
                </UploadFile>
              )}
            </Col>
          </Row>
          <Form className="form-input" autoComplete="off" form={form} onFinish={handleSaveProfile}>
            <Row gutter={[30, 15]}>
              <Col span={12}>
                <TextInput
                  label="User Name*"
                  name="username"
                  initialValue={data?.username}
                  rules={[
                    { required: true, message: 'This field is required' },
                    {
                      pattern: new RegExp(noSpace),
                      message: 'Username must be between 6-30 characters with no space',
                    },
                  ]}
                  disabled={!action}
                />
              </Col>
              <Col span={12}>
                <TextInput
                  label="Name"
                  name="name"
                  initialValue={data?.profile?.fullName}
                  rules={[
                    { required: false, message: 'This field is required' },
                    { min: 6, max: 30, message: 'Name must be between 6-30 characters' },
                  ]}
                  disabled={!action}
                />
              </Col>
            </Row>
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <TextInput label="Email" name="email" initialValue={data?.email?.trim()} disabled={true} />
              </Col>
              <Col span={12}>
                <TextInput
                  label="Phone Number"
                  name="phone"
                  disabled={true}
                  initialValue={data?.phone && `(+${data?.country?.numberCode}) ${data?.phone}`}
                />
              </Col>
            </Row>
            <Row gutter={[30, 0]} className="mb-2">
              <Col span={12}>
                <DateInput label="Created Date" name="dateCreated" initialValue={data?.dateCreated} disabled={true} />
              </Col>
              <Col span={12}>
                <StatusSelect
                  disabled={!action}
                  showArrow={!!action}
                  name="status"
                  label="Status"
                  initialValue={data?.status}
                  options={buyerStatus as []}
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
                      Edit buyer profile
                    </CommonButton>
                  ) : (
                    <>
                      <div className="mr-3">
                        <CommonButton
                          customWidth={true}
                          space="space-medium"
                          size="middle"
                          variant="default"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </CommonButton>
                      </div>
                      <CommonButton
                        customWidth={true}
                        space="space-medium"
                        size="middle"
                        htmlType="submit"
                        loading={loadingSave}
                      >
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
        visible={isOpenModalConfirmCancleEdit}
        onOk={onModalOkEdit}
        onCancel={() => setIsOpenModalConfirmCancleEdit(false)}
        cancelText="No"
        okText="Yes"
      >
        Are you sure to cancel changing?
      </ConfirmModal>
    </div>
  );
}
