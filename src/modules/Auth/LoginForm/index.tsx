import { Form, Input, message } from 'antd';
import { ReactComponent as Logo } from 'assets/img/login/login-logo.svg';
import { ReactComponent as EmailIcon } from 'assets/img/login/email-icon.svg';
import { ReactComponent as PassIcon } from 'assets/img/login/pass-icon.svg';
import { ReactComponent as HidePassIconOn } from 'assets/img/login/hide-pass-icon-on.svg';
import { ReactComponent as HidePassIconOff } from 'assets/img/login/hide-pass-icon-off.svg';
import './style.scss';
import { Link } from 'react-router-dom';
import { login } from 'services/auth.service';
import { useEffect, useState } from 'react';
import { setUserInfo } from 'redux/auth/auth.slice';
import { useDispatch } from 'react-redux';
import { CommonButton } from 'components/CommonButton';

interface LoginValues {
  username: string;
  password: string;
}
const LoginForm = () => {
  const [formValidate] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleLogin = (values: LoginValues) => {
    setLoadingLogin(true);
    login(values.username.trim(), values.password.trim())
      .then((res) => {
        if (res) {
          setLoadingLogin(false);
          dispatch(setUserInfo(res));
        }
      })
      .catch(({ response }) => {
        if (response) {
          setLoadingLogin(false);
          message.error({
            content: response?.data?.message,
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        } else {
          setLoadingLogin(false);
          message.error({
            content: 'Please check your internet connection and try again',
            className: 'custom-class',
            style: {
              textAlign: 'right',
            },
          });
        }
      });
  };

  useEffect(() => {
    forceUpdate({});
  }, []);
  return (
    <div className="form-area">
      <Logo />
      <Form onFinish={handleLogin} form={formValidate}>
        <Form.Item
          className="email"
          name="username"
          rules={[
            { required: true, message: 'Please fill in this field' },
            { type: 'email', message: 'The input is not valid E-mail!' },
          ]}
        >
          <Input size="large" placeholder="Email" prefix={<EmailIcon />} />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Please fill in this field' }]}>
          <Input.Password
            size="large"
            placeholder="Password"
            prefix={<PassIcon />}
            iconRender={(visible) => (visible ? <HidePassIconOff /> : <HidePassIconOn />)}
          />
        </Form.Item>

        <Form.Item className="">
          <Link to="#" className="float-right color-base forgot-password">
            Forgot password?
          </Link>
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <CommonButton
              htmlType="submit"
              loading={loadingLogin}
              disabled={
                !formValidate.isFieldsTouched(true) ||
                !!formValidate.getFieldsError().filter(({ errors }) => errors.length).length
              }
              block
              size="large"
            >
              Sign In
            </CommonButton>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};
export default LoginForm;
