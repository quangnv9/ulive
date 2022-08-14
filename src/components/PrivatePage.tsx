import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { RootState } from 'redux/rootReducers';
import { getCurrentUser } from 'redux/auth/auth.selectors';
import { Login } from 'pages';

const ProtectedRouteView = ({ currentUser, ...props }: RouteProps & ConnectedProps<typeof connector>) => {
  const location = useLocation();
  if (currentUser) {
    return location.pathname === '/login' ? <Redirect to="/" /> : <Route {...props} />;
  }
  return <Login />;
};

const connector = connect((state: RootState) => ({
  currentUser: getCurrentUser(state),
}));

export const PrivatePage = connector(ProtectedRouteView);
