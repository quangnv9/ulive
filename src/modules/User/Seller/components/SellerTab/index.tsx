import { Tabs } from 'antd';
import { useParseParams } from 'hooks/use-params';
import { SellerProfile } from '../SellerProfile';
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Seller } from 'services/api-seller.type';
import { ViewSellerAddress } from '../ViewSellerAddress';
import { ConfirmModal } from 'components/modal';
import './index.scss';
import { SellerDetailPage } from '../SellerDetail';

export const SellerTab = () => {
  const [activeKey, setActiveKey] = useState<string>('info');
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [nextTab, setNextTab] = useState('');
  const [detailSeller, setDetailSeller] = useState({});

  const location = useLocation();
  const { action } = useParseParams();
  const history = useHistory();

  const getDetailSeller = (seller: Seller) => {
    setDetailSeller(seller);
  };

  const handleOk = () => {
    history.push(location.pathname);
    setIsOpenModal(false);
    setActiveKey(nextTab);
  };

  const { TabPane } = Tabs;
  const handleChangeTab = (activeKey: string) => {
    if (action) {
      setIsOpenModal(true);
      setNextTab(activeKey);
    } else {
      setActiveKey(activeKey);
      history.push(location.pathname);
    }
  };

  return (
    <div className="seller-tab-control">
      <Tabs activeKey={activeKey} onChange={handleChangeTab}>
        <TabPane tab="Basic Information" key="info">
          <SellerProfile getDetailSeller={getDetailSeller} />
        </TabPane>
        <TabPane tab="Address" key="address">
          <ViewSellerAddress detailSeller={detailSeller} />
        </TabPane>
        <TabPane tab="Product" key="product">
          <SellerDetailPage />
        </TabPane>
        <TabPane tab="LiveStream" key="livestream">
          LiveStream
        </TabPane>
      </Tabs>
      <ConfirmModal
        visible={isOpenModal}
        okText="Yes"
        cancelText="No"
        onOk={handleOk}
        onCancel={() => setIsOpenModal(false)}
      >
        Are you sure to go back without saving?
      </ConfirmModal>
    </div>
  );
};
