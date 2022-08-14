import { Form, Input, FormItemProps } from 'antd';
import './styles.scss';

interface TextInputProps extends FormItemProps {
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}
export function TextInput({ placeholder, disabled, maxLength, ...props }: TextInputProps) {
  return (
    <Form.Item className="form-input-wrapper" {...props}>
      <Input maxLength={maxLength} disabled={disabled} placeholder={placeholder} className="text-input-custom" />
    </Form.Item>
  );
}
