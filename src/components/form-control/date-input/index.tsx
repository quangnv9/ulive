import { DatePicker, Form, FormItemProps } from 'antd';
import moment from 'moment';
import './styles.scss';

interface DateInputProps extends FormItemProps {
  initialValue?: string;
  format?: string;
  disabled?: boolean;
}
export function DateInput({ format = 'DD/MM/YYYY', initialValue, disabled, ...props }: DateInputProps) {
  return (
    <Form.Item
      className="date-input-wrapper"
      initialValue={moment(new Date(initialValue as string), format)}
      {...props}
    >
      <DatePicker format={format} disabled={disabled} />
    </Form.Item>
  );
}
