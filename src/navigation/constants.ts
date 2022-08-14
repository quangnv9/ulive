export interface IRoute {
  path: string;
  display: string;
}
export interface IRoutes {
  root: IRoute;
  user: IRoute;
  notfound: IRoute;
  login: IRoute;
  product: IRoute;
  video: IRoute;
  other: IRoute;
  seller: IRoute;
  buyer: IRoute;
  admin: IRoute;
  permission: IRoute;
  category: IRoute;
  'product-list': IRoute;
  attribute: IRoute;
}

export const routes: IRoutes = {
  root: {
    path: '/',
    display: 'Dashboard',
  },
  user: {
    path: '/user/buyer',
    display: 'Buyer Management',
  },
  seller: {
    path: '/user/seller',
    display: 'Seller Management',
  },
  admin: {
    path: '/user/admin',
    display: 'Admin Management',
  },
  buyer: {
    path: '/user/buyer',
    display: 'Buyer Management',
  },
  permission: {
    path: '/user/permission',
    display: 'Permission Management',
  },
  product: {
    path: '/product/:id',
    display: 'Product',
  },
  'product-list': {
    path: '/product/product-list',
    display: ' Product Management ',
  },
  category: {
    path: '/product/category',
    display: 'Category Management',
  },
  attribute: {
    path: '/product/attribute',
    display: 'Attribute Management',
  },
  notfound: {
    path: '/404',
    display: 'Not found',
  },
  login: {
    path: '/login',
    display: 'Login',
  },
  video: {
    path: '/video',
    display: 'Video Management',
  },
  other: {
    path: '/other',
    display: 'Other Management',
  },
};
