import { Form, Input, FormItemProps } from 'antd';

interface TextInputProps extends FormItemProps {
  disabled?: boolean;
  placeholder?: string;
  iconRender?: any;
  className?: string;
  onChange?: (e: any) => void;
}
export function PasswordInput({ placeholder, disabled, iconRender, className, onChange, ...props }: TextInputProps) {
  return (
    <Form.Item className="form-input-wrapper" {...props}>
      <Input.Password
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        iconRender={iconRender}
        className={className}
      />
    </Form.Item>
  );
}
