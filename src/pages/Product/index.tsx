import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ProductLisingPage, ProductCategoryPage, ProductAttributePage } from 'modules/Product';
import { NotFoundPage } from 'pages';

export const ProductManagementPage = () => {
  const match = useRouteMatch();
  return (
    <Switch>
      <Route path={`${match.path}/product-list`}>
        <ProductLisingPage />
      </Route>
      <Route path={`${match.path}/category`}>
        <ProductCategoryPage />
      </Route>
      <Route path={`${match.path}/attribute`}>
        <ProductAttributePage />
      </Route>
      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
};
