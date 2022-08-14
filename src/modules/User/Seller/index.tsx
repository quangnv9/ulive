import { NotFoundPage } from 'pages';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { SellerMainPage } from './components/SellerMain';
import { SellerTab } from './components/SellerTab';
import { SellerDetailProduct } from './components/SellerDetailProduct';
export function UserSellerPage() {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={match.path} exact>
        <SellerMainPage />
      </Route>
      <Route path={`${match.path}/:sellerId`} exact>
        <SellerTab />
      </Route>
      <Route path={`${match.path}/product-details/:sellerId`} exact>
        <SellerDetailProduct />
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
