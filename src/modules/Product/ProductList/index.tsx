import { NotFoundPage } from 'pages';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { AddNewProduct } from './components/AddNewProduct';
import { ProductListMain } from './components/ProductListMain';

export function ProductLisingPage() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={match.path} exact>
        <ProductListMain />
      </Route>
      <Route path={`${match.path}/add-product`} exact>
        <AddNewProduct />
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
