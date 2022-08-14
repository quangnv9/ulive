import { Col, Input, Modal, Row } from 'antd';
import { SearchIcon, SelectIcon } from 'components/icons';
import { Country } from 'services/api-admin.type';
import { isEmpty } from 'utils/helper';

export type SelectCountryModalProps = {
  visibleSelectCountryCode: boolean;
  handleOkConfirmModal: () => void;
  handleCancelSelectCountryCode: () => void;
  searchTerm: string;
  handleSearchCountryCode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  countryCodeSearchResult: Country[] | undefined;
  handleSelectedCountryCode: (country: Country) => void;
  data: Country[] | undefined;
  selectedCountryCode: Country | undefined;
};

export function SelectCountryModal({
  visibleSelectCountryCode,
  handleOkConfirmModal,
  handleCancelSelectCountryCode,
  searchTerm,
  countryCodeSearchResult,
  handleSearchCountryCode,
  data,
  selectedCountryCode,
  handleSelectedCountryCode,
}: SelectCountryModalProps) {
  return (
    <Modal
      title="Select Country Code"
      visible={visibleSelectCountryCode}
      className="modal-select-country-code"
      onOk={handleOkConfirmModal}
      onCancel={handleCancelSelectCountryCode}
      okButtonProps={{ disabled: isEmpty(selectedCountryCode) }}
      cancelText="Cancel"
      okText="Save"
      closable={false}
    >
      <Input
        value={searchTerm}
        className="radius-medium search-input"
        size="middle"
        placeholder="Search"
        prefix={<SearchIcon className="flex mr-2" />}
        onChange={(e) => handleSearchCountryCode(e)}
      />
      <div className="country-container">
        {searchTerm ? (
          <>
            {countryCodeSearchResult?.map((countryCodeSearchResult, ind) => (
              <Row
                key={ind}
                className={`${
                  selectedCountryCode?._id === countryCodeSearchResult._id ? 'selected-country-code' : 'country-item'
                }`}
                onClick={() => handleSelectedCountryCode(countryCodeSearchResult)}
              >
                <Col span={3}>
                  <img src={countryCodeSearchResult?.flag} alt="flag" />
                </Col>
                <Col span={6}>
                  <p>+{countryCodeSearchResult?.numberCode}</p>
                </Col>
                {selectedCountryCode?._id === countryCodeSearchResult._id ? (
                  <>
                    <Col span={13}>
                      <p>{countryCodeSearchResult?.name}</p>
                    </Col>
                    <Col span={2}>
                      <SelectIcon />
                    </Col>
                  </>
                ) : (
                  <Col span={15}>
                    <p>{countryCodeSearchResult?.name}</p>
                  </Col>
                )}
              </Row>
            ))}
          </>
        ) : (
          <>
            {data?.map((country, index) => (
              <>
                <Row
                  key={index}
                  className={`${selectedCountryCode?._id === country._id ? 'selected-country-code' : 'country-item'}`}
                  onClick={() => handleSelectedCountryCode(country)}
                >
                  <Col span={3}>
                    <img src={country?.flag} alt="flag" />
                  </Col>
                  <Col span={6}>
                    <p>+{country?.numberCode}</p>
                  </Col>
                  {selectedCountryCode?._id === country._id ? (
                    <>
                      <Col span={13}>
                        <p>{country?.name}</p>
                      </Col>
                      <Col span={2}>
                        <SelectIcon />
                      </Col>
                    </>
                  ) : (
                    <Col span={15}>
                      <p>{country?.name}</p>
                    </Col>
                  )}
                </Row>
              </>
            ))}
          </>
        )}
      </div>
    </Modal>
  );
}
