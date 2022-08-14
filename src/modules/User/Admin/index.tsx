import { NotFoundPage } from 'pages';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { AdminMainPage } from './components/AdminMain';
import { AdminProfilePage } from './components/AdminProfile';
import { CreateAdmin } from './components/CreateAdmin';

export function UserAdminPage() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.url} component={AdminMainPage} />
      <Route exact path={`${match.url}/create`} component={CreateAdmin} />
      <Route exact path={`${match.url}/:adminId`} component={AdminProfilePage} />
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
