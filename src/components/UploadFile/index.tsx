import { Upload, UploadProps } from 'antd';
import { alertMessage } from 'utils/helper';

interface UploadFileProps extends UploadProps {
  onChange: (file: any) => void;
  children: React.ReactNode;
  name: string;
  accessToken?: string;
  uploadUrl: string;
  limitSize?: number;
  accept?: string;
}

export const UploadFile = ({
  onChange,
  children,
  name,
  accessToken,
  uploadUrl,
  limitSize = 2,
  accept = '.png, .jpg',
  ...props
}: UploadFileProps) => {
  const uploadProps = {
    name,
    accept,
    action: uploadUrl,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    onChange,
    showUploadList: false,
    beforeUpload: (file: any) => {
      const limitedSize: boolean = file.size / 1024 / 1024 < Number(limitSize);
      if (!limitedSize) {
        alertMessage(
          `The picture should be in certain format (including PNG, JPG) and no larger than ${limitSize}MB`,
          'error',
        );
      }

      return limitedSize;
    },
  };

  return (
    <Upload {...uploadProps} {...props}>
      {children}
    </Upload>
  );
};
