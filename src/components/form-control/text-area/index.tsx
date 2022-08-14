import { Form, FormItemProps, Input } from 'antd';
import './styles.scss';
interface TextAreaInputProps extends FormItemProps {
  disabled?: boolean;
  placeholder?: string;
  autoSize?: any;
}
export function TextArea({ disabled, ...props }: TextAreaInputProps) {
  return (
    <Form.Item className="form-input-wrapper" {...props}>
      <Input.TextArea
        className="text-area-custom"
        autoSize={props.autoSize}
        style={{ borderRadius: '12px' }}
        placeholder={props.placeholder}
        disabled={disabled}
      />
    </Form.Item>
  );
}
