import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const LoadingIcon = () => {
  return <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: '#D8528E' }} spin />} />;
};
