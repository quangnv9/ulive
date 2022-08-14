import { NotFoundPage } from 'pages';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import { BuyerDetailTab } from './components/BuyerDetailTab';
import { BuyerMain } from './components/BuyerMain';

export function UserBuyerPage() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={match.path} exact>
        <BuyerMain />
      </Route>
      <Route path={`${match.path}/:buyerId`}>
        <BuyerDetailTab />
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
