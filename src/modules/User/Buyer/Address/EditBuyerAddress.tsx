import { useEffect, useState } from 'react';
import { Row, Col, Form, Switch, Space, Button, Image, Modal, Input } from 'antd';
import { useDetailAddressQuery, useUpdateAddress } from 'modules/User/Buyer/buyer.queries';
import './EditBuyerAddress.scss';
import { Address } from 'services/api-address.type';
import { Buyer } from 'services/api-buyer.type';
import { ArrowRightSelectAddressIcon, SearchIcon } from 'components/icons';
import { useAllCityQuery } from '../city.queries';
import { City } from 'services/api-city.type';
import { alertMessage, isEmpty } from 'utils/helper';
import { TextInput } from 'components/form-control';
import { ArrowDownIcon } from 'components/icons';
import { ConfirmModal } from 'components/modal';
import { SearchCityItem } from './SearchCityItem';
import { LoadingComponent } from 'components/LoadingComponent';
import { CommonButton } from 'components/CommonButton';
import { phoneNumber } from 'regex';

type AddressFormEdit = {
  fullName: string;
  phone: string;
  address: string;
  subAddress: string;
  label: string;
  isDefault: boolean;
};

type CityByName = {
  letter: string;
  cities: City[];
};

interface EditBuyerAddressProp {
  handleCancleEdit: () => void;
  editAddress: Partial<Address>;
  detailBuyer: Partial<Buyer>;
}

export const EditBuyerAddress = ({ handleCancleEdit, editAddress, detailBuyer }: EditBuyerAddressProp) => {
  const [form] = Form.useForm();
  const { data, isLoading } = useDetailAddressQuery(editAddress?._id as string);
  const { mutate: saveAddress } = useUpdateAddress();
  const { data: listCity, isLoading: loadingGetCity } = useAllCityQuery();
  const [label, setLabel] = useState<string>('');
  const [visibleModalConfirmGoBack, setVisibleModalConfirmGoBack] = useState<boolean>(false);
  const [visibleModalSelectCiy, setVisibleModalSelectCity] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [citySearchResult, setCitySearchResult] = useState([]);
  const [citySelected, setCitySelected] = useState<Partial<City>>({});
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false);

  const groupCityByName = (arr: City[]): Array<CityByName> => {
    const map = arr.reduce((acc: City | any, val: City | any) => {
      let char = val.name.charAt(0).toUpperCase();
      acc[char] = [].concat(acc[char] || [], val);
      return acc;
    }, {});
    const res = Object.keys(map).map((el) => ({
      letter: el,
      cities: map[el],
    }));
    return res as CityByName[];
  };

  const handleUpdateAddress = (values: AddressFormEdit) => {
    const { fullName, phone, address, subAddress, isDefault } = values;

    if (data) {
      setLoadingEdit(true);
      saveAddress(
        {
          ...data,
          fullName,
          phone,
          address,
          // @ts-ignore
          subAddress: subAddress === '' ? null : subAddress,
          label,
          isDefault,
          city: isEmpty(citySelected) ? data.city?._id : citySelected._id,
        },
        {
          onSuccess: (res) => {
            setLoadingEdit(false);

            alertMessage('Edit address successfully !', 'success');
            setTimeout(() => {
              handleCancleEdit();
            }, 2000);
          },
          onError: (error) => {
            setLoadingEdit(false);
            alertMessage('Edit address failed, try again !', 'error');
          },
        },
      );
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      fullName: data?.fullName,
      countryCode: `+${detailBuyer.country?.numberCode ?? ''}`,
      phone: data?.phone,
      country: detailBuyer.country?.name,
      city: data?.city,
      address: data?.address,
      subAddress: data?.subAddress,
      label: data?.label,
      isDefault: data?.isDefault,
    });
    if (data) {
      setLabel(data?.label);
    }
  }, [data, form, detailBuyer]);

  if (isLoading || loadingGetCity) {
    return <LoadingComponent size="large" />;
  }

  const handleCancelSelectCity = () => {
    setVisibleModalSelectCity(false);
    setSearchTerm('');
    setCitySelected({});
  };

  const filterCity = (keyWord: string) => {
    const result = listCity?.data.filter((el) => el.name.toUpperCase().includes(keyWord.toUpperCase()));
    const newArr = groupCityByName(result as City[]);
    setCitySearchResult(newArr as any);
  };

  const handleSearchCity = (e: any) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterCity(value);
  };

  const handleSelectCity = (city: City) => {
    setCitySelected(city);
  };

  return (
    <>
      <div className="edit-form-wrapper">
        <Row justify="center">
          <Col lg={12} span={12} md={18} xs={22}>
            <Form autoComplete="off" form={form} onFinish={handleUpdateAddress}>
              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <TextInput
                    name="fullName"
                    label="Rescipient'name"
                    rules={[
                      { required: true, message: 'This field is required'! },
                      { min: 4, max: 30, message: 'Recipient’s name is between 4 and 30 characters' },
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col span={6}>
                  <span className="phone-label">Phone Number</span>
                  <Space align="center" size="small" className="numbercode-box">
                    <Image src={detailBuyer.country?.flag} preview={false} />
                    <span>+{detailBuyer.country?.numberCode}</span>
                    <ArrowDownIcon />
                  </Space>
                </Col>
                <Col span={18} className="col-custom">
                  <TextInput
                    name="phone"
                    rules={[
                      { required: true, message: 'This field is required' },
                      { pattern: new RegExp(phoneNumber), message: 'Please enter a right phone number' },
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <TextInput name="country" label="Country" disabled={true} />
                </Col>
                <Col span={12}>
                  <Form.Item name="city" label="City" className="select-city-wrapper">
                    <Button
                      disabled={loadingGetCity}
                      className="btn-select-city"
                      onClick={() => setVisibleModalSelectCity(true)}
                    >
                      {isEmpty(citySelected) ? editAddress?.city?.name : citySelected.name}{' '}
                      <ArrowRightSelectAddressIcon />
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[0, 0]} className="mb-2">
                <Col span={24}>
                  <TextInput
                    name="address"
                    label="Detail Address"
                    rules={[
                      { required: true, message: 'This field is required' },
                      { min: 5, max: 125, message: 'The address must be 5-125 characters long. Please try again' },
                    ]}
                  />
                </Col>
              </Row>

              <Row gutter={[0, 0]} className="mb-2">
                <Col span={24}>
                  <TextInput
                    name="subAddress"
                    rules={[
                      { min: 5, max: 150, message: 'The address must be 5-150 characters long. Please try again' },
                    ]}
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24} className="select-label-section">
                  <span className="label-as">Label as</span>
                  <span className={`lbl-item ${label === 'HOME' && 'lbl-active'}`} onClick={() => setLabel('HOME')}>
                    Home
                  </span>
                  <span className={`lbl-item ${label === 'OFFICE' && 'lbl-active'}`} onClick={() => setLabel('OFFICE')}>
                    Office
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="switch-default-section">
                  <Form.Item name="isDefault" className="switch-label" label="Set as default address">
                    <Switch defaultChecked={data?.isDefault} />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end">
                <Col span={12} className="wrapper-button">
                  <div className="mr-3">
                    <CommonButton
                      variant="default"
                      size="middle"
                      space="space-medium"
                      onClick={() => setVisibleModalConfirmGoBack(true)}
                    >
                      Cancel
                    </CommonButton>
                  </div>
                  <CommonButton
                    size="middle"
                    space="space-large"
                    loading={loadingEdit}
                    htmlType="submit"
                    type="primary"
                  >
                    Save
                  </CommonButton>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>

      <ConfirmModal
        visible={visibleModalConfirmGoBack}
        cancelText="No"
        okText="Yes"
        onCancel={() => setVisibleModalConfirmGoBack(false)}
        onOk={handleCancleEdit}
      >
        Are you sure to cancel changing?
      </ConfirmModal>

      <Modal
        title="Select City"
        visible={visibleModalSelectCiy}
        className="modal-select-city"
        onOk={() => setVisibleModalSelectCity(false)}
        onCancel={handleCancelSelectCity}
        cancelText="Cancel"
        okText="Save"
        okButtonProps={{ disabled: isEmpty(citySelected) }}
        centered={true}
      >
        <p>City</p>
        <Input
          value={searchTerm}
          className="search-city-input radius-medium"
          size="middle"
          placeholder="Search"
          prefix={<SearchIcon className="flex mr-2" />}
          onChange={(e) => handleSearchCity(e)}
        />
        <div className="full-width">
          {searchTerm ? (
            <>
              {citySearchResult?.map((item: CityByName, index) => {
                return (
                  <SearchCityItem
                    key={index}
                    letter={item.letter}
                    cities={item.cities}
                    handleSelectCity={handleSelectCity}
                    citySelected={citySelected}
                  />
                );
              })}
            </>
          ) : (
            <>
              {groupCityByName(listCity?.data as City[])?.map((item: CityByName, index) => (
                <SearchCityItem
                  key={index}
                  letter={item.letter}
                  cities={item.cities}
                  handleSelectCity={handleSelectCity}
                  citySelected={citySelected}
                />
              ))}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
