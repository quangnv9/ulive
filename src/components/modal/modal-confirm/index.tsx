import { Modal, ModalProps } from 'antd';
import React from 'react';
import './styles.scss';

interface ConfirmModalProps extends ModalProps {
  children: string | React.ReactNode;
}

export function ConfirmModal({ okText, children, ...props }: ConfirmModalProps) {
  return (
    <Modal centered width={353} okText={okText || 'Save'} className="confirm-modal-wrapper" {...props}>
      <span className="mess-modal">{children}</span>
    </Modal>
  );
}
