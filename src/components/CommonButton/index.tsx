import { Button } from 'antd';
import { ButtonProps, ButtonType } from 'antd/lib/button/button';
import './styles.scss';
import clsx from 'clsx';

type ButtonSpace = 'space-small' | 'space-medium' | 'space-large';

interface CommonButtonProps extends ButtonProps {
  variant?: keyof typeof idByVariant;
  space?: ButtonSpace;
  textBold?: boolean;
  reverseIcon?: boolean;
  customWidth?: boolean;
}

const idByVariant: Record<ButtonType, string> = {
  primary: 'primary-button',
  default: 'default-button',
  ghost: '',
  dashed: 'dashed-button',
  link: '',
  text: '',
};
const classBySpace: Record<ButtonSpace, string> = {
  'space-small': 'space-small',
  'space-medium': 'space-medium',
  'space-large': 'space-large',
};

export const CommonButton = ({
  variant = 'primary',
  space = 'space-medium',
  textBold = true,
  customWidth = false,
  reverseIcon = false,
  ...props
}: CommonButtonProps) => {
  return (
    <Button
      {...props}
      id={idByVariant[variant]}
      type={variant}
      className={clsx(
        classBySpace[space],
        textBold ? 'font-semibold' : 'font-medium',
        customWidth ? 'custom-width' : '',
        { 'reverse-icon': reverseIcon },
      )}
    />
  );
};
