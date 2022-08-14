import { NotFoundPage } from 'pages';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { ProductAttributeMain } from './components/ProductAttributeMain';

export function ProductAttributePage() {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={match.url} component={ProductAttributeMain} />
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
}
