import { Form, message, Modal } from 'antd';
import { ReactComponent as HidePassIconOn } from 'assets/img/login/hide-pass-icon-on.svg';
import { ReactComponent as HidePassIconOff } from 'assets/img/login/hide-pass-icon-off.svg';
import { useState } from 'react';
import { PasswordInput } from 'components/form-control';
import { changePassword } from 'services/auth.service';
import { authActions } from 'redux/auth/auth.slice';
import { useDispatch } from 'react-redux';
import './style.scss';
export type ChangePasswordModalProps = {
  visibleChangePasswordModal: boolean;
  handleHiddenModal: () => void;
};

export function ChangePasswordModal({ visibleChangePasswordModal, handleHiddenModal }: ChangePasswordModalProps) {
  const [formChangePass] = Form.useForm();
  const dispatch = useDispatch();
  const [loadingChange, setLoadingChange] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(true);
  const [currentPass, setCurrentPass] = useState<string>();
  const [newPass, setNewPass] = useState<string>();
  const [comfrPass, setComfrPass] = useState<string>();

  const handleChangePassword = async () => {
    await formChangePass.validateFields();
    setLoadingChange(true);
    const currPass = formChangePass.getFieldValue('currentPass').trim();
    const newPass = formChangePass.getFieldValue('newPass').trim();

    changePassword(currPass, newPass)
      .then((res) => {
        setLoadingChange(false);
        if (res) {
          dispatch(authActions.logout());
          message.success('You have successfully change your password');
        }
      })
      .catch((errors) => {
        if (errors) {
          setLoadingChange(false);
          message.error(errors.message, 5);
        } else {
          setLoadingChange(false);
          message.error('Please check your internet connection and try again');
        }
      });
  };

  const handleCancelChangePassword = () => {
    handleHiddenModal();
    setShowDescription(true);
    formChangePass.resetFields();
  };

  const checkShowDescription = (e: any) => {
    e.stopPropagation();
    const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,16}$/);
    const confirmP = formChangePass.getFieldValue('confirmPass');
    const newP = formChangePass.getFieldValue('newPass');

    if (regex.test(confirmP) && confirmP === newP) {
      setComfrPass(confirmP);
      setShowDescription(true);
    } else {
      setComfrPass('');
      setShowDescription(true);
    }
  };

  const onChangeNewPass = (e: any) => {
    const { value } = e.target;
    const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,16}$/);
    if (value && regex.test(value)) {
      setNewPass(value);
    } else if (value === '') {
      setNewPass('');
    } else {
      setNewPass('');
    }
  };
  const onChangeCurrPass = (e: any) => {
    const { value } = e.target;
    if (value) {
      setCurrentPass(value);
    } else {
      setCurrentPass('');
    }
  };

  return (
    <Modal
      title="Change Password"
      visible={visibleChangePasswordModal}
      className="modal-select-country-code change-pass-form"
      onOk={handleChangePassword}
      onCancel={handleCancelChangePassword}
      okButtonProps={{
        disabled: (!currentPass && !newPass && !comfrPass) || !currentPass || !newPass || !comfrPass,
      }} //fix this
      confirmLoading={loadingChange}
      cancelText="Cancel"
      okText="Save"
      closable={false}
    >
      <Form form={formChangePass} className="change-password-modal">
        <PasswordInput
          label="Current Password"
          name="currentPass"
          hasFeedback
          className="radius-medium search-input bottom-input"
          placeholder="Type your password"
          iconRender={(visible: boolean) => (visible ? <HidePassIconOff /> : <HidePassIconOn />)}
          rules={[{ required: true, message: 'This field is required' }]}
          onChange={onChangeCurrPass}
        />
        <PasswordInput
          label="New Password"
          name="newPass"
          hasFeedback
          className="radius-medium search-input bottom-input"
          placeholder="Type your password"
          iconRender={(visible: boolean) => (visible ? <HidePassIconOff /> : <HidePassIconOn />)}
          rules={[
            { required: true, message: 'This field is required' },
            {
              pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,16}$/),
              message:
                'Password must be 8-16 characters long, contains at least one uppercase letter, one number and a special character',
            },
          ]}
          onChange={onChangeNewPass}
        />
        <PasswordInput
          extra={
            showDescription
              ? 'Password must be 8-16 characters long, contains at least one uppercase letter, one number and a special character'
              : ''
          }
          label="Confirm New Password"
          name="confirmPass"
          hasFeedback
          className="radius-medium search-input bottom-input"
          placeholder="Type your password"
          iconRender={(visible: boolean) => (visible ? <HidePassIconOff /> : <HidePassIconOn />)}
          rules={[
            { required: true, message: 'This field is required' },

            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPass') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Confirm password does not match'));
              },
            }),
            {
              pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,16}$/),
              message:
                'Password must be 8-16 characters long, contains at least one uppercase letter, one number and a special character',
            },
          ]}
          onChange={(e) => checkShowDescription(e)}
        />
      </Form>
    </Modal>
  );
}
