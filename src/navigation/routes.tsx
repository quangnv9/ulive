import { Route, Switch } from 'react-router-dom';
import { DashboardLayout } from 'components/Layout/DashboardLayout';
import { Login, NotFoundPage } from 'pages';
import { PrivatePage } from 'components/PrivatePage';

export default function Routes() {
  return (
    <Switch>
      <PrivatePage path="/login">
        <Login />
      </PrivatePage>
      <PrivatePage path="/">
        <DashboardLayout />
      </PrivatePage>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
