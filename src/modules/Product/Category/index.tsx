import { NotFoundPage } from 'pages';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { ProductCateMain } from './screens/ProductCateMain';

export function ProductCategoryPage() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.url} component={ProductCateMain} />
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
