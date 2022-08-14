import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { UserSellerPage, UserBuyerPage, UserAdminPage, UserPermissionPage } from 'modules/User';
import { NotFoundPage } from 'pages';

export const UserPage = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/buyer`}>
        <UserBuyerPage />
      </Route>
      <Route path={`${match.path}/seller`}>
        <UserSellerPage />
      </Route>
      <Route path={`${match.path}/admin`}>
        <UserAdminPage />
      </Route>
      <Route path={`${match.path}/permission`}>
        <UserPermissionPage />
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
};
