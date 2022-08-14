import { Tabs } from 'antd';
import { BuyerDetail } from 'modules/User/Buyer/components/BuyerDetail';
import './index.scss';
import { ViewBuyerAddress } from '../../Address/ViewBuyerAddress';
import { useState } from 'react';
import { Buyer } from 'services/api-buyer.type';
import { useLocation, useHistory } from 'react-router-dom';
import { ConfirmModal } from 'components/modal';
import { useParseParams } from 'hooks/use-params';

export const BuyerDetailTab = () => {
  const { TabPane } = Tabs;
  const location = useLocation();
  const history = useHistory();
  const [detailBuyer, setDetailBuyer] = useState({});
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>('info');
  const [nextTab, setNextTab] = useState('');

  const { action } = useParseParams();
  const getDetailBuyer = (buyer: Buyer) => {
    setDetailBuyer(buyer);
  };

  const handleOk = () => {
    history.push(location.pathname);
    setIsOpenModal(false);
    setActiveKey(nextTab);
  };

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
    <div className="buyer-tab-control">
      <Tabs activeKey={activeKey} onChange={handleChangeTab}>
        <TabPane tab="Basic Information" key="info">
          <BuyerDetail getDetailBuyer={getDetailBuyer} />
        </TabPane>
        <TabPane tab="Address" key="address">
          <ViewBuyerAddress detailBuyer={detailBuyer} />
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
