import { Button, Dropdown, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from 'redux/auth/auth.slice';
import './style.scss';
import { useMemo, useState } from 'react';
import { getCurrentUser } from 'redux/auth/auth.selectors';
import avatar_admin from 'assets/img/avatar_admin.png';
import { ArrowRightIcon } from 'components/icons';
import { ChangePasswordModal } from './ChangePasswordModal';
import { useHistory } from 'react-router';

export type LogOutProps = {
  collapsed: boolean;
};
export const LogOut = ({ collapsed }: LogOutProps) => {
  const history = useHistory();
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  const [visibleChangePasswordModal, setVisibleChangePasswordModal] = useState<boolean>(false);

  const handleLogout = () => {
    dispatch(authActions.logout());
    history.push('/login');
  };

  const menu = (
    <Menu className="my-profile-container">
      <Menu.Item>
        <div>My Profile</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => setVisibleChangePasswordModal(true)}>Change Password</div>
        <ChangePasswordModal
          visibleChangePasswordModal={visibleChangePasswordModal}
          handleHiddenModal={() => setVisibleChangePasswordModal(false)}
        />
      </Menu.Item>
      <div className="divide" />
      <Menu.Item>
        <div onClick={handleLogout} className="text-red">
          Sign Out
        </div>
      </Menu.Item>
    </Menu>
  );

  const UserComponent = useMemo(() => {
    if (collapsed) {
      return <img src={avatar_admin} alt="avatar" style={{ width: 36, height: 36 }} />;
    }
    return (
      <div className="flex">
        <img src={avatar_admin} alt="avatar" style={{ width: 36, height: 36 }} />
        <p style={{ marginLeft: 12 }}>{currentUser?.username}</p>
        <ArrowRightIcon />
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  return (
    <div className="user-info">
      <Dropdown overlay={menu} placement="topCenter">
        <Button>{UserComponent}</Button>
      </Dropdown>
    </div>
  );
};
