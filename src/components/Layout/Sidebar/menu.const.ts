import {
  OtherIcon,
  ProductAttributeIcon,
  ProductCateIcon,
  ProductIcon,
  SubProductIcon,
  UserAdminIcon,
  UserBuyerIcon,
  UserIcon,
  UserPermissionIcon,
  UserSellerIcon,
  VideoIcon,
} from 'components/icons';
import { MenuItem, CollapseMenu } from './type.menu';

export const menuLists: MenuItem[] = [
  {
    id: '01',
    name: 'User',
    icon: UserIcon,
    path: '/',
    subMenu: [
      {
        subId: '01-01',
        name: 'Buyer',
        icon: UserBuyerIcon,
        path: '/user/buyer',
      },
      {
        subId: '01-02',
        name: 'Seller',
        icon: UserSellerIcon,
        path: '/user/seller',
      },
      {
        subId: '01-03',
        name: 'Admin',
        icon: UserAdminIcon,
        path: '/user/admin',
      },
      {
        subId: '01-04',
        name: 'Permission',
        icon: UserPermissionIcon,
        path: '/user/permission',
      },
    ],
  },
  {
    id: '02',
    name: 'Video',
    icon: VideoIcon,
    path: '/video',
  },
  {
    id: '03',
    name: 'Product',
    icon: ProductIcon,
    path: '/product',
    subMenu: [
      { subId: '03-01', name: 'Product', path: '/product/product-list', icon: SubProductIcon },
      { subId: '03-02', name: 'Category', path: '/product/category', icon: ProductCateIcon },
      { subId: '03-03', name: 'Attribute', path: '/product/attribute', icon: ProductAttributeIcon },
    ],
  },
  {
    id: '04',
    name: 'Other',
    icon: OtherIcon,
    path: '/other',
  },
];

export const collapseMenuLists: CollapseMenu[] = [
  // {
  //   id: '01',
  //   name: 'User',
  //   icon: UserIcon,
  //   path: '/',
  // },

  {
    id: '01-01',
    name: 'Buyer',
    icon: UserBuyerIcon,
    path: '/user/buyer',
  },
  {
    id: '01-02',
    name: 'Seller',
    icon: UserSellerIcon,
    path: '/user/seller',
  },
  {
    id: '01-03',
    name: 'Admin',
    icon: UserAdminIcon,
    path: '/user/admin',
  },
  {
    id: '01-04',
    name: 'Permission',
    icon: UserPermissionIcon,
    path: '/user/permission',
  },

  {
    id: '02',
    name: 'Video',
    icon: VideoIcon,
    path: '/video',
  },
  // {
  //   id: '03',
  //   name: 'Product',
  //   icon: ProductIcon,
  //   path: '/product',
  // },

  { id: '03-01', name: 'Product', path: '/product/product-list', icon: SubProductIcon },
  { id: '03-02', name: 'Category', path: '/product/category', icon: ProductCateIcon },
  { id: '03-03', name: 'Attribute', path: '/product/attribute', icon: ProductAttributeIcon },
  {
    id: '04',
    name: 'Other',
    icon: OtherIcon,
    path: '/other',
  },
];
