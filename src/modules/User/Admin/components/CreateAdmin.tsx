import { Form, Button, Row, Col, Avatar, message, Select } from 'antd';
import { useEffect, useState } from 'react';
import { CameraIcon, LoadingIcon, ArrowDownIcon } from 'components/icons';
import { adminStatus } from './admin.const';
import { StatusSelect, TextInput } from 'components/form-control';
import { UploadFile } from 'components/UploadFile';
import { useAdminCreate, useAllCountryQuery } from '../admin.queries';
import { CommonButton } from 'components/CommonButton';
import { configs } from 'constant';
import { getCurrentUser } from 'redux/auth/auth.selectors';
import { store } from 'redux/store';
import { Country } from 'services/api-admin.type';
import { ConfirmModal } from 'components/modal';
import { onlyLettersNumbersUnderscoresPeriods, ValidatePhone } from 'regex';
import { LoadingComponent } from 'components/LoadingComponent';
import { useGetListGroupPermissionQuery } from 'modules/User/Admin/admin.queries';
import './CreateAdmin.scss';
import { SelectCountryModal } from 'components/modal/select-country-modal';
import { useHistory } from 'react-router';
import { useParseParams } from 'hooks/use-params';

type AvatarUpload = {
  avatarUrl: string;
  _id: string;
};

type CreateDetailValue = {
  username: string;
  name?: string;
  phoneNumber: string;
  status: string;
  groupPermission: string;
  email: string;
};

export function CreateAdmin() {
  const [visibleSelectCountryCode, setVisibleSelectCountryCode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [visibleConfirmModal, setVisibleConfirmModal] = useState<boolean>(false);
  const [countryCodeSearchResult, setCountryCodeSearchResult] = useState<Country[]>();
  const [selectedCountryCode, setSelectedCountryCode] = useState<Country>();
  const [displayCountryCode, setDisplayCountryCode] = useState<Country>();
  const [permissionId, setPermissionId] = useState<string>('');
  const [loadingUploadAvatar, setLoadingUploadAvatar] = useState<boolean>(false);
  const [visibleCancelConfirmModal, setVisibleCancelConfirmModal] = useState<boolean>(false);
  const [avatarUpload, setAvatarUpload] = useState<AvatarUpload>({ avatarUrl: '', _id: '' });
  const { data: listGroupPermission } = useGetListGroupPermissionQuery({ status: 'Active' });
  const { data, isLoading } = useAllCountryQuery('?pageSize=300');
  const { mutate: createAdmin } = useAdminCreate();
  const { Option } = Select;
  const [form] = Form.useForm();
  const currentUser = getCurrentUser(store.getState());
  const history = useHistory();
  const { action } = useParseParams();

  useEffect(() => {
    if (data?.length) {
      const filteredCountry = data?.find((i) => i.name === 'Switzerland');
      setDisplayCountryCode(filteredCountry);
    }
  }, [data]);

  const handleCancelEdit = () => {
    setVisibleConfirmModal(false);
    history.push('/user/admin');
  };

  const handleCancelButtonCloseModal = () => {
    setVisibleCancelConfirmModal(false);
    history.push('/user/admin');
  };

  const handleOpenModalSelectCountryCode = () => {
    setVisibleSelectCountryCode(true);
  };

  const handleCancelSelectCountryCode = () => {
    setVisibleSelectCountryCode(false);
    setSearchTerm('');
  };

  const handleOkConfirmModal = () => {
    setVisibleSelectCountryCode(false);
    setDisplayCountryCode(selectedCountryCode);
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

  const handleSaveAdminProfile = (values: CreateDetailValue) => {
    const { username, status, name, phoneNumber, email } = values;
    if (data && avatarUpload._id) {
      createAdmin(
        {
          username,
          fullName: name === '' ? null : name,
          avatar: avatarUpload._id,
          email,
          country: selectedCountryCode === undefined ? displayCountryCode?._id : selectedCountryCode?._id,
          groupPermission: permissionId,
          phone: phoneNumber,
          status,
        },

        {
          onSuccess: (res) => {
            message.success({
              content: 'Create Successfullly',
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
    } else {
      createAdmin(
        {
          username,
          fullName: name === '' ? null : name,
          email,
          country: selectedCountryCode === undefined ? displayCountryCode?._id : selectedCountryCode?._id,
          groupPermission: permissionId,
          phone: phoneNumber,
          status,
        },

        {
          onSuccess: (res) => {
            message.success({
              content: 'Create Successfullly',
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
        message.success({
          content: 'Uploaded avatar successfully',
          className: 'custom-class',
          style: {
            textAlign: 'right',
          },
        });
        let avatarUrl = configs.imageUrlTemp + info.file.response.data.key;
        setAvatarUpload({ avatarUrl, _id: info.file.response.data._id });
      } else if (info.file.status === 'error') {
        setLoadingUploadAvatar(false);
        message.error('Upload avatar failed !');
      }
    }
  };

  if (isLoading) {
    return <LoadingComponent size="large" />;
  }

  return (
    <div className="container-detail">
      <Row justify="center">
        <Col lg={12} span={12} md={18} xs={22}>
          <Row justify="center">
            <Col span={6} className="avatar-admin">
              <Avatar size={120} style={{ color: '#696984', backgroundColor: '#fde3cf' }} src={avatarUpload.avatarUrl}>
                <span className="avatar-default-by-name">A</span>
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
                  placeholder="Text Input"
                  rules={[
                    { required: true, message: 'This field is required' },
                    {
                      pattern: new RegExp(/^\S{6,30}$/),
                      message: 'Username must be between 6-30 characters with no space',
                    },
                    {
                      pattern: new RegExp(onlyLettersNumbersUnderscoresPeriods),
                      message: 'Username only use letters, numbers, underscores and periods',
                    },
                  ]}
                />
              </Col>
              <Col span={12}>
                <TextInput
                  label="Name"
                  name="name"
                  placeholder="Text Input"
                  rules={[
                    { required: false, message: 'This field is required' },
                    { min: 6, max: 30, message: 'Name must be between 6-30 characters' },
                  ]}
                />
              </Col>
            </Row>
            <Row gutter={[30, 0]}>
              <Col span={12}>
                <TextInput
                  label="Email*"
                  name="email"
                  placeholder="Text Input"
                  rules={[
                    { required: true, message: 'This field is required' },
                    {
                      min: 5,
                      max: 64,
                      type: 'email',
                      message: 'Email format is not correct',
                    },
                  ]}
                />
              </Col>
              <Col span={12}>
                <Row gutter={[16, 0]}>
                  <Col className="phone-number-col" span={9}>
                    <Form.Item name="countryCode" label="Phone Number*">
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
                    </Form.Item>
                  </Col>
                  <Col className="phone-input-container" span={15}>
                    <TextInput
                      placeholder="Ex: 123 456 789"
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
                <StatusSelect name="status" label="Status" options={adminStatus as []} initialValue={adminStatus[0]} />
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Group Permission*"
                  name="groupPermission"
                  className="select-permission-group-create-admin"
                  rules={[{ required: true, message: 'This field is required' }]}
                >
                  <Select
                    className="select-permission-group-container"
                    onChange={(value: string) => {
                      setPermissionId(value);
                    }}
                    placeholder="Select Group Permission"
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
                    <div className="flex confirm-buttom">
                      <CommonButton variant="default" onClick={() => setVisibleCancelConfirmModal(true)}>
                        Cancel
                      </CommonButton>
                      <CommonButton htmlType="submit">Save</CommonButton>
                    </div>
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
