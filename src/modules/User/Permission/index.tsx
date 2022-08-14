import { NotFoundPage } from 'pages';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { AddGroupPage } from './components/AddGroup';
import { PermissionDetailPage } from './components/PermissionDetail';
import { PermissionMain } from './components/PermissionMain';

export function UserPermissionPage() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.url} component={PermissionMain} />
      <Route path={`${match.url}/add-group`} component={AddGroupPage} exact />
      <Route path={`${match.url}/:permissionId`} component={PermissionDetailPage} exact />
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
