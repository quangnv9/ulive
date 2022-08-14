import { Modal, ModalProps } from 'antd';
import React from 'react';
import './styles.scss';

interface NotificationModalProps extends ModalProps {
  children: string | React.ReactNode;
}

export function NotificationModal({ okText, children, ...props }: NotificationModalProps) {
  return (
    <Modal centered width={494} okText={okText || 'Save'} className="notification-modal-wrapper" {...props}>
      <span className="mess-modal">{children}</span>
    </Modal>
  );
}
