import { useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Avatar, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { CameraIcon, LoadingIcon, EditBuyerIcon, ArrowDownIcon } from 'components/icons';
import { adminStatus } from './admin.const';
import { StatusSelect, TextInput } from 'components/form-control';
import { UploadFile } from 'components/UploadFile';
import { useAdminByIdQuery, useAllCountryQuery, useUpdateAdmin } from '../admin.queries';
import { CommonButton } from 'components/CommonButton';
import { configs } from 'constant';
import { getCurrentUser } from 'redux/auth/auth.selectors';
import { store } from 'redux/store';
import { Country } from 'services/api-admin.type';
import { alertMessage, isEmpty } from 'utils/helper';
import { ConfirmModal } from 'components/modal';
import { onlyLettersNumbersUnderscoresPeriods, ValidatePhone } from 'regex';
import { LoadingComponent } from 'components/LoadingComponent';
import { useGetListGroupPermissionQuery } from 'modules/User/Admin/admin.queries';
import './AdminProfile.scss';
import { SelectCountryModal } from 'components/modal/select-country-modal';
import { useHistory, useLocation } from 'react-router';
import { useParseParams } from 'hooks/use-params';
import avatarDefault from 'assets/img/avatar_default.png';

type AdminProfileParam = {
  adminId: string;
};

type AvatarUpload = {
  avatarUrl: string;
  _id: string;
};

type AdminDetailValue = {
  username: string;
  name: string;
  phoneNumber: string;
  status: string;
  groupPermission: string;
};

export function AdminProfilePage() {
  const { adminId } = useParams<AdminProfileParam>();
  const [loadingUploadAvatar, setLoadingUploadAvatar] = useState<boolean>(false);
  const [visibleSelectCountryCode, setVisibleSelectCountryCode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [visibleConfirmModal, setVisibleConfirmModal] = useState<boolean>(false);
  const [visibleCancelConfirmModal, setVisibleCancelConfirmModal] = useState<boolean>(false);
  const [countryCodeSearchResult, setCountryCodeSearchResult] = useState<Country[]>();
  const [selectedCountryCode, setSelectedCountryCode] = useState<Country>();
  const [displayCountryCode, setDisplayCountryCode] = useState<Country>();
  const [permissionId, setPermissionId] = useState<string>('');
  const [avatarUpload, setAvatarUpload] = useState<AvatarUpload>({ avatarUrl: '', _id: '' });
  const { data: listGroupPermission } = useGetListGroupPermissionQuery({ status: 'Active' });
  const { data } = useAllCountryQuery('?pageSize=300');
  const { data: admin, isLoading: isLoadingAdminData } = useAdminByIdQuery(adminId);
  const { mutate: saveAdmin } = useUpdateAdmin();
  const { action } = useParseParams();

  const location = useLocation();
  const history = useHistory();
  const { Option } = Select;
  const [form] = Form.useForm();
  const currentUser = getCurrentUser(store.getState());

  useEffect(() => {
    form.setFieldsValue({
      username: admin?.username,
      name: admin?.fullName,
      countryCode: admin?.country?.numberCode,
      phoneNumber: admin?.phone,
      status: admin?.status,
      groupPermission: admin?.groupPermission?.name,
    });
    setDisplayCountryCode(admin?.country);
  }, [admin, form]);

  const handleCancelEdit = () => {
    form.setFieldsValue({
      username: admin?.username,
      name: admin?.fullName,
      countryCode: admin?.country?.numberCode,
      phoneNumber: admin?.phone,
      status: admin?.status,
      groupPermission: admin?.groupPermission?.name,
    });
    setAvatarUpload({
      _id: '',
      avatarUrl: '',
    });
    history.push(location.pathname);
    setVisibleConfirmModal(false);
  };

  const handleCancelButtonCloseModal = () => {
    form.setFieldsValue({
      username: admin?.username,
      name: admin?.fullName,
      countryCode: admin?.country?.numberCode,
      phoneNumber: admin?.phone,
      status: admin?.status,
      groupPermission: admin?.groupPermission?.name,
    });
    setAvatarUpload({
      _id: '',
      avatarUrl: '',
    });
    history.push(location.pathname);
    setVisibleCancelConfirmModal(false);
  };

  const handleOnEditProfile = () => {
    history.push(`${location.pathname}?action=edit`);
  };

  const handleOpenModalSelectCountryCode = () => {
    setVisibleSelectCountryCode(true);
  };

  const handleCancelSelectCountryCode = () => {
    setVisibleSelectCountryCode(false);
    setSearchTerm('');
  };

  const handleOkConfirmModal = () => {
    setDisplayCountryCode(selectedCountryCode);
    setVisibleSelectCountryCode(false);
  };

  const filterCountryCode = (keyWord: string) => {
    const result = data?.filter((el) => el.name.toUpperCase().includes(keyWord.toUpperCase()));
    setCountryCodeSearchResult(result as any);
  };

  const handleSelectedCountryCode = (value: any) => {
    setSelectedCountryCode(value);
  };

  const handleSearchCountryCode = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterCountryCode(value);
  };

  const handleSaveAdminProfile = (values: AdminDetailValue) => {
    const { username, status, name, phoneNumber } = values;

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

    if (admin) {
      saveAdmin(
        {
          ...admin,
          username,
          fullName: name === '' ? null : name,
          avatar: isEmpty(avatarUpload._id) ? admin?.avatar?._id : avatarUpload._id,
          phone: phoneNumber,
          status,
          country: isEmpty(displayCountryCode) ? admin.country?._id : displayCountryCode?._id,
          groupPermission: isEmpty(permissionId) ? admin.groupPermission?._id : permissionId,
        },
        {
          onSuccess: (res) => {
            history.push(location.pathname);
            message.success({
              content: 'Edit Successfullly',
              className: 'custom-class',
              style: {
                textAlign: 'right',
              },
            });
            history.push('/user/admin');
          },
          onError: (errors: any) => {
            if (errors) {
              message.error({
                content: errors.message,
                className: 'custom-class',
                style: {
                  textAlign: 'right',
                },
              });
            }
          },
        },
      );
    }
  };

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

  if (isLoadingAdminData) {
    return <LoadingComponent size="large" />;
  }

  return (
    <div className="container-detail">
      <Row justify="center">
        <Col lg={12} span={12} md={18} xs={22}>
          <Row justify="center">
            <Col span={6} className="avatar-admin">
              <Avatar
                size={120}
                style={{ color: '#696984', backgroundColor: '#fde3cf' }}
                src={
                  isEmpty(avatarUpload.avatarUrl)
                    ? admin?.avatar?.key
                      ? configs.imageUrl + admin?.avatar?.key
                      : avatarDefault
                    : avatarUpload.avatarUrl
                }
              >
                <span className="avatar-default-by-name">{admin?.username?.charAt(0)}</span>
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
          <Form className="form-input" autoComplete="off" onFinish={handleSaveAdminProfile} form={form}>
            <Row gutter={[30, 15]}>
              <Col span={12}>
                <TextInput
                  label="Username*"
                  name="username"
                  rules={[
                    { required: true, message: 'This field is required' },
                    {
                      pattern: new RegExp(/^\S{6,30}$/),
                      message: 'Username must be between 6-30 characters with no space',
                    },
                  ]}
                  disabled={!action}
                  initialValue={admin?.username}
                />
              </Col>
              <Col span={12}>
                <TextInput
                  label="Name"
                  name="name"
                  rules={[
                    { required: false, message: 'This field is required' },
                    { min: 6, max: 30, message: 'Name must be between 6-30 characters' },
                  ]}
                  disabled={!action}
                  initialValue={admin?.fullName}
                />
              </Col>
            </Row>
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <TextInput label="Email*" name="email" initialValue={admin?.email} disabled />
              </Col>
              <Col span={12}>
                <Row gutter={[16, 0]}>
                  <Col className="phone-number-col" span={9}>
                    <Form.Item name="countryCode" label="Phone Number*">
                      {!action ? (
                        <Button disabled={!action} className="select-country-button">
                          <div className="select-country-container">
                            <img src={displayCountryCode?.flag} alt="country flag" />
                            <p>+{displayCountryCode?.numberCode}</p>
                          </div>
                        </Button>
                      ) : (
                        <>
                          <Button onClick={handleOpenModalSelectCountryCode} className="select-country-button">
                            <div className="select-country-container">
                              <img src={displayCountryCode?.flag} alt="country flag" />
                              <p>+{displayCountryCode?.numberCode}</p>
                            </div>
                            <ArrowDownIcon />
                          </Button>
                          <SelectCountryModal
                            visibleSelectCountryCode={visibleSelectCountryCode}
                            handleOkConfirmModal={handleOkConfirmModal}
                            handleCancelSelectCountryCode={handleCancelSelectCountryCode}
                            searchTerm={searchTerm}
                            handleSearchCountryCode={handleSearchCountryCode}
                            countryCodeSearchResult={countryCodeSearchResult}
                            handleSelectedCountryCode={handleSelectedCountryCode}
                            data={data}
                            selectedCountryCode={selectedCountryCode}
                          />
                        </>
                      )}
                    </Form.Item>
                  </Col>
                  <Col className="phone-input-container" span={15}>
                    <TextInput
                      disabled={!action}
                      className="phone-input"
                      label="Phone Number"
                      name="phoneNumber"
                      rules={[{ required: true, message: 'This field is required' }, ValidatePhone]}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <StatusSelect
                  disabled={!action}
                  showArrow={action}
                  name="status"
                  label="Status"
                  options={adminStatus as []}
                  initialValue={admin?.status}
                />
              </Col>
              <Col span={12}>
                <Form.Item label="Group Permission*" name="groupPermission" className="select-permission-group">
                  <Select
                    className="select-permission-group-container"
                    disabled={!action}
                    showArrow={action}
                    onChange={(value: string) => {
                      setPermissionId(value);
                    }}
                  >
                    {listGroupPermission?.map((permission, index) => (
                      <Option value={permission._id}>{permission.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12} />
              <Col span={12}>
                <Row justify="end">
                  <Form.Item>
                    {!action ? (
                      <CommonButton
                        onClick={handleOnEditProfile}
                        size="middle"
                        variant="default"
                        icon={<EditBuyerIcon className="mr-1-5" />}
                      >
                        Edit Admin Profile
                      </CommonButton>
                    ) : (
                      <div className="flex confirm-buttom">
                        <CommonButton variant="default" onClick={() => setVisibleCancelConfirmModal(true)}>
                          Cancel
                        </CommonButton>
                        <CommonButton htmlType="submit">Save</CommonButton>
                      </div>
                    )}
                  </Form.Item>
                </Row>
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
  );
}
