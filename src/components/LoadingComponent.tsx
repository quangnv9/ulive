import { Spin, SpinProps } from 'antd';

export const LoadingComponent = ({ ...props }: SpinProps) => {
  return (
    <div className="loading-wrapper">
      <Spin {...props} />
    </div>
  );
};
