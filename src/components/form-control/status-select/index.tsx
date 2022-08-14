import { Form, FormItemProps, Select, Space } from 'antd';
import { classOptionByVariant } from 'modules/User/Buyer/components/buyer.const';
import './styles.scss';

interface StatusSelectProps extends FormItemProps {
  disabled?: boolean;
  showArrow?: boolean;
  onChange?: () => void;
  options: [];
}
export function StatusSelect({ disabled, showArrow, onChange, options, ...props }: StatusSelectProps) {
  const { Option } = Select;
  return (
    <Space className="form-select-wrapper">
      <Form.Item {...props}>
        <Select disabled={disabled} onChange={onChange} showArrow={showArrow}>
          {options.map((option, index) => (
            <Option value={option} key={index}>
              <span className={classOptionByVariant[option]}>{option}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Space>
  );
}
